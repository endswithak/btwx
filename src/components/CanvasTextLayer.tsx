import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import {
  getPaperStyle, getPaperParent, getPaperLayerIndex,
  getPaperStrokeColor, getPaperFillColor, positionTextContent,
  clearLayerTransforms, applyLayerTransforms
} from '../store/utils/paper';
import { applyLayerTimelines } from '../utils';
import { paperMain, paperPreview } from '../canvas';
import CanvasPreviewEventLayerTimeline from './CanvasPreviewEventLayerTimeline';

interface CanvasTextLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  }
}

interface GetAutoLineHeight {
  fontSize: number;
  leading: number | 'auto';
}

export const getLeading = ({ fontSize, leading }: GetAutoLineHeight): number => {
  if (leading === 'auto') {
    return Math.round(fontSize * 1.25);
  } else {
    return leading;
  }
};

interface GetFontStyle {
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  fontStyle: Btwx.FontStyle;
}

export const getFontStyle = ({fontSize, fontWeight, fontFamily, fontStyle}: GetFontStyle): string => {
  return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
};

interface GetParagraphs {
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  textResize: Btwx.TextResize;
  innerWidth: number;
  letterSpacing: number;
  textTransform: Btwx.TextTransform;
  fontStyle: Btwx.FontStyle;
  preview?: boolean;
}

export const getParagraphs = ({
  text,
  fontSize,
  fontWeight,
  fontFamily,
  textResize,
  innerWidth,
  letterSpacing,
  textTransform,
  fontStyle,
  preview = false
 }: GetParagraphs): string[][] => {
  const paragraphs = [];
  const lines = text.split(/\r\n|\n|\r/mg);
  const font = getFontStyle({
    fontSize,
    fontWeight,
    fontFamily,
    fontStyle
  });
  for (let j = 0; j < lines.length; j++) {
    if (textResize === 'autoWidth') {
      paragraphs.push([lines[j]]);
    } else {
      let pLines = [],
          words = lines[j].split(' '),
          line = '';
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        const testLineWidth = getTextWidth({
          font: font,
          text: testLine.substring(0, testLine.length - 1),
          letterSpacing,
          textTransform,
          preview
        });
        if (testLineWidth > innerWidth && i > 0) {
          pLines.push(line.substring(0, line.length - 1));
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      pLines.push(line.substring(0, line.length - 1));
      paragraphs.push(pLines);
    }
  }
  return paragraphs;
};

interface GetContent {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  textResize?: Btwx.TextResize;
  innerWidth?: number;
  letterSpacing?: number;
  textTransform?: Btwx.TextTransform;
  paragraphs?: string[][];
}

export const getContent = (props: GetContent): string => {
  const paragraphs = props.paragraphs ? props.paragraphs : getParagraphs(props as GetParagraphs);
  return paragraphs.reduce((result, current, index) => {
    return result + `${current.reduce((cr, cc, ci) => `${cr}${cc}${ci !== current.length - 1 ? `\n` : ''}`, '')}${index !== paragraphs.length - 1 ? `\n` : ''}`;
  }, '');
};

interface GetTextWidth {
  font: string;
  text: string;
  letterSpacing: number;
  textTransform: Btwx.TextTransform
  preview?: boolean;
}

export const getTextWidth = ({font, text, letterSpacing, textTransform, preview}: GetTextWidth) => {
  const canvas = preview ? paperPreview.view.element : paperMain.view.element;
  const ctx = preview ? paperPreview.view.element.getContext('2d') : paperMain.view.element.getContext('2d');
  let prevFont = ctx.font;
  let width = 0;
  let measureText = text;
  if (textTransform === 'uppercase') {
    measureText = text.toUpperCase();
  }
  if (textTransform === 'lowercase') {
    measureText = text.toLowerCase();
  }
  if (letterSpacing) {
    canvas.style.letterSpacing = `${letterSpacing}px`;
  }
  ctx.font = font;
  width = ctx.measureText(measureText).width;
  ctx.font = prevFont;
  canvas.style.letterSpacing = `initial`;
  return width;
};

const debug = false;

const CanvasTextLayer = (props: CanvasTextLayerProps): ReactElement => {
  const { id, paperScope, eventTimelines } = props;
  const layerItem: Btwx.Text = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Text);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const eventsById = useSelector((state: RootState) => state.layer.present.events.byId);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [rendered, setRendered] = useState<boolean>(false);
  const [layerTimelines, setLayerTimelines] = useState(null);
  // const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);
  const content = useMemo(() =>
    getContent({paragraphs: layerItem.paragraphs}),
    [layerItem.paragraphs]
  );

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    textContent: paper.PointText;
    textBackground: paper.Path.Rectangle;
    textMask: paper.Path.Rectangle;
  } => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    const paperLayer = paperProject.getItem({ data: { id } }) as paper.Group;
    if (paperLayer) {
      const textContent = paperLayer.getItem({ data: { id: 'textContent' } }) as paper.PointText;
      const textBackground = paperLayer.getItem({ data: { id: 'textBackground' } }) as paper.Path.Rectangle;
      const textMask = paperLayer.getItem({ data: { id: 'textMask' } }) as paper.Path.Rectangle;
      return {
        paperLayer,
        textContent,
        textBackground,
        textMask
      };
    } else {
      return {
        paperLayer: null,
        textContent: null,
        textBackground: null,
        textMask: null
      }
    }
  }

  const getAreaTextRectangle = () => {
    const artboardPosition = new paperLayerScope.Point(artboardItem.frame.x, artboardItem.frame.y);
    const textPosition = new paperLayerScope.Point(layerItem.frame.x, layerItem.frame.y);
    const absPosition = textPosition.add(artboardPosition);
    const topLeft = new paperLayerScope.Point(
      absPosition.x - (layerItem.frame.innerWidth / 2),
      absPosition.y - (layerItem.frame.innerHeight / 2)
    );
    const bottomRight = new paperLayerScope.Point(
      absPosition.x + (layerItem.frame.innerWidth / 2),
      absPosition.y + (layerItem.frame.innerHeight / 2)
    );
    return new paperLayerScope.Rectangle({
      from: topLeft,
      to: bottomRight
    });
  }

  const applyTextBounds = ({textBackground, textMask}) => {
    const bounds = getAreaTextRectangle();
    textBackground.bounds = bounds;
    textMask.bounds = bounds;
  }

  const getAbsPoint = () => {
    const point = new paperLayerScope.Point(layerItem.point.x, layerItem.point.y);
    const artboardPosition = new paperLayerScope.Point(artboardItem.frame.x, artboardItem.frame.y);
    return point.add(artboardPosition);
  }

  const applyFill = (): void => {
    const { textContent } = getPaperLayer();
    textContent.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyStroke = (): void => {
    const { textContent } = getPaperLayer();
    textContent.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: artboardItem.frame
    });
  }

  const applyShadow = (): void => {
    const { textContent } = getPaperLayer();
    if (layerItem.style.shadow.enabled) {
      textContent.shadowColor = {
        hue: layerItem.style.shadow.color.h,
        saturation: layerItem.style.shadow.color.s,
        lightness: layerItem.style.shadow.color.l,
        alpha: layerItem.style.shadow.color.a
      } as paper.Color;
      textContent.shadowBlur = layerItem.style.shadow.blur;
      textContent.shadowOffset = new paperLayerScope.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
    } else {
      textContent.shadowColor = null;
    }
  }

  const createText = (): paper.Group => {
    const textContainer = new paperLayerScope.Group({
      name: `text-${layerItem.name}`,
      insert: false,
      data: {
        id,
        type: 'Layer',
        layerType: 'Text',
        scope: layerItem.scope
      },
      children: [
        new paperLayerScope.Path.Rectangle({
          rectangle: getAreaTextRectangle(),
          fillColor: '#000',
          data: {
            id: 'textMask',
            type: 'LayerChild',
            layerType: 'Text',
            layerId: id
          },
          clipMask: layerItem.textStyle.textResize !== 'autoWidth',
          visible: layerItem.textStyle.textResize !== 'autoWidth'
        }),
        new paperLayerScope.Path.Rectangle({
          rectangle: getAreaTextRectangle(),
          fillColor: debug ? tinyColor('red').setAlpha(0.25).toRgbString() : tinyColor('#fff').setAlpha(0.01).toRgbString(),
          blendMode: debug ? 'normal' : 'multiply',
          data: {
            id: 'textBackground',
            type: 'LayerChild',
            layerType: 'Text',
            layerId: id
          }
        }),
        new paperLayerScope.PointText({
          content: content,
          point: getAbsPoint(),
          data: {
            id: 'textContent',
            type: 'LayerChild',
            layerType: 'Text',
            layerId: id
          },
          ...getPaperStyle({
            style: layerItem.style,
            textStyle: layerItem.textStyle,
            isLine: false,
            layerFrame: layerItem.frame,
            artboardFrame: artboardItem.frame
          })
        })
      ]
    });
    positionTextContent({
      paperLayer: textContainer,
      verticalAlignment: layerItem.textStyle.verticalAlignment,
      justification: layerItem.textStyle.justification,
      textResize: layerItem.textStyle.textResize
    });
    applyLayerTransforms({
      paperLayer: textContainer,
      transform: layerItem.transform
    });
    return textContainer;
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
      masked: layerItem.masked,
      underlyingMask: layerItem.underlyingMask
    }).insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createText()
    );
    // hack fix for morning brain
    if (layerItem.style.fill.fillType === 'gradient') {
      applyFill();
    }
    if (layerItem.style.stroke.fillType === 'gradient') {
      applyStroke();
    }
    setRendered(true);
    return (): void => {
      const { paperLayer } = getPaperLayer();
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // INDEX & MASK
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.data.scope = layerItem.scope;
    }
  }, [layerItem.scope]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        paperLayer.parent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerIndex]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({ data: { id: layerItem.parent } });
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({ data: { id:'artboardLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.masked]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      if (layerItem.masked) {
        const maskGroup = paperProject.getItem({ data: { id: layerItem.underlyingMask } }).parent;
        maskGroup.insertChild(maskedIndex, paperLayer);
      } else {
        let paperParent = paperProject.getItem({ data: { id: layerItem.parent } });
        if (layerItem.parent === layerItem.artboard) {
          paperParent = paperParent.getItem({ data: { id: 'artboardLayers' } });
        }
        paperParent.insertChild(layerIndex, paperLayer);
      }
    }
  }, [layerItem.underlyingMask]);

  ///////////////////////////////////////////////////////
  // TRANSFORM
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.transform.rotation, layerItem.transform.horizontalFlip, layerItem.transform.verticalFlip]);

  ///////////////////////////////////////////////////////
  // FRAME / TEXT / TEXTRESIZE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [
    layerItem.frame.x, layerItem.frame.y, layerItem.frame.innerWidth,
    layerItem.frame.innerHeight, layerItem.textStyle.textResize, layerItem.text,
    artboardItem.frame.innerWidth, artboardItem.frame.innerHeight
  ]);

  ///////////////////////////////////////////////////////
  // CONTEXT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.opacity = layerItem.style.opacity;
    }
  }, [layerItem.style.opacity]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.blendMode = layerItem.style.blendMode;
    }
  }, [layerItem.style.blendMode]);

  ///////////////////////////////////////////////////////
  // BLUR STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const paperLayer = paperProject.getItem({ data: { id } });
      if (layerItem.style.blur.enabled) {
        paperLayer.style.blur = layerItem.style.blur.radius;
      } else {
        paperLayer.style.blur = null;
      }
    }
  }, [layerItem.style.blur.enabled]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.blur.enabled) {
        const paperLayer = paperProject.getItem({ data: { id } });
        paperLayer.style.blur = layerItem.style.blur.radius;
      }
    }
  }, [layerItem.style.blur.radius]);

  ///////////////////////////////////////////////////////
  // STROKE OPTIONS
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.strokeCap = layerItem.style.strokeOptions.cap;
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.strokeJoin = layerItem.style.strokeOptions.join;
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.dashArray = [layerItem.style.strokeOptions.dashArray[0], layerItem.style.strokeOptions.dashArray[1]];
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.dashOffset = layerItem.style.strokeOptions.dashOffset;
    }
  }, [layerItem.style.strokeOptions.dashOffset]);

  ///////////////////////////////////////////////////////
  // TEXT STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      switch(layerItem.textStyle.textResize) {
        case 'autoWidth':
          textMask.clipMask = false;
          textMask.visible = false;
          break;
        case 'fixed':
        case 'autoHeight':
          textMask.visible = true;
          textMask.clipMask = true;
          break;
      }
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.textResize]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.fontFamily = layerItem.textStyle.fontFamily;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.fontFamily]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.fontWeight = layerItem.textStyle.fontWeight;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.fontWeight]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.fontStyle = layerItem.textStyle.fontStyle;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.fontStyle]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.letterSpacing = layerItem.textStyle.letterSpacing;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.letterSpacing]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.textTransform = layerItem.textStyle.textTransform;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.textTransform]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.justification = layerItem.textStyle.justification;
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.justification]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.verticalAlignment]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        layerType: 'Text',
        paperLayer
      });
      textContent.leading = getLeading({
        leading: layerItem.textStyle.leading,
        fontSize: layerItem.textStyle.fontSize
      });
      textContent.fontSize = layerItem.textStyle.fontSize;
      textContent.content = content;
      applyTextBounds({
        textBackground,
        textMask
      });
      positionTextContent({
        paperLayer: paperLayer,
        verticalAlignment: layerItem.textStyle.verticalAlignment,
        justification: layerItem.textStyle.justification,
        textResize: layerItem.textStyle.textResize
      });
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.leading, layerItem.textStyle.fontSize]);

  ///////////////////////////////////////////////////////
  // FILL & STROKE & SHADOW
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      applyFill();
    }
  }, [layerItem.style.fill]);

  useEffect(() => {
    if (rendered) {
      applyStroke();
    }
  }, [layerItem.style.stroke]);

  useEffect(() => {
    if (rendered) {
      applyShadow();
    }
  }, [layerItem.style.shadow]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
      if (layerItem.style.stroke.fillType === 'gradient') {
        applyStroke();
      }
    }
  }, [
    layerItem.transform.rotation, layerItem.frame.innerWidth, layerItem.frame.innerHeight,
    layerItem.text, layerItem.textStyle.fontFamily, layerItem.textStyle.fontWeight,
    layerItem.textStyle.fontSize, layerItem.textStyle.justification,
    layerItem.textStyle.leading, layerItem.textStyle.textTransform,
    layerItem.textStyle.verticalAlignment, layerItem.textStyle.textResize,
    layerItem.textStyle.letterSpacing
  ]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.strokeWidth = layerItem.style.stroke.width;
    }
  }, [layerItem.style.stroke.width]);

  ///////////////////////////////////////////////////////
  // EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    useEffect(() => {
      if (rendered && eventTimelines) {
        const { paperLayer } = getPaperLayer();
        setLayerTimelines(applyLayerTimelines({
          paperLayer,
          eventTimelines,
          eventsById,
          layerItem
        }));
      } else {
        if (layerTimelines) {
          setLayerTimelines(null);
        }
      }
    }, [eventTimelines, rendered]);
  }

  ///////////////////////////////////////////////////////
  // EVENT TWEENS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered && layerTimelines && eventTimelines
      ? <>
          {
            Object.keys(layerTimelines).map((eventId) => (
              <CanvasPreviewEventLayerTimeline
                key={eventId}
                id={id}
                eventId={eventId}
                layerTimeline={layerTimelines[eventId]}
                eventTimeline={eventTimelines[eventId]} />
            ))
          }
        </>
      : null
    )
  } else {
    return null;
  }
}

export default CanvasTextLayer;