import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import {
  getPaperStyle, getPaperParent, getTextAbsPoint, getLayerAbsBounds, getPaperLayerIndex,
  getLayerTextContent, getPaperStrokeColor, getPaperFillColor, clearTextOblique, applyTextOblique,
  clearLayerTransforms, applyLayerTransforms
} from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasTextLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

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

const CanvasTextLayer = (props: CanvasTextLayerProps): ReactElement => {
  const { id, paperScope } = props;
  const layerItem: Btwx.Text = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Text);
  const parentItem: Btwx.Artboard | Btwx.Group = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null);
  const artboardItem: Btwx.Artboard = useSelector((state: RootState) => layerItem ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null);
  const tweening = useSelector((state: RootState) => state.preview.tweening === artboardItem.id);
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = layerItem.underlyingMask ? parentItem.children.indexOf(layerItem.underlyingMask) : null;
  const maskedIndex = (layerIndex - underlyingMaskIndex) + 1;
  const projectIndex = artboardItem.projectIndex;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [rendered, setRendered] = useState<boolean>(false);
  const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);
  const [prevTweening, setPrevTweening] = useState(tweening);
  const [eventInstance, setEventInstance] = useState(0);
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
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
    const textPosition = new paperMain.Point(layerItem.frame.x, layerItem.frame.y);
    const absPosition = textPosition.add(artboardPosition);
    const topLeft = new paperMain.Point(
      absPosition.x - (layerItem.frame.innerWidth / 2),
      absPosition.y - (layerItem.frame.innerHeight / 2)
    );
    const bottomRight = new paperMain.Point(
      absPosition.x + (layerItem.frame.innerWidth / 2),
      absPosition.y + (layerItem.frame.innerHeight / 2)
    );
    return new paperLayerScope.Rectangle({
      from: topLeft,
      to: bottomRight
    });
  }

  const getAbsPoint = () => {
    const point = new paperMain.Point(layerItem.point.x, layerItem.point.y);
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
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
      textContent.shadowOffset = new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
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
          // fillColor: tinyColor('#fff').setAlpha(0.01).toRgbString(),
          // blendMode: 'multiply',
          fillColor: '#000',
          data: {
            id: 'textMask',
            type: 'LayerChild',
            layerType: 'Text',
            layerId: id
          },
          clipMask: true
        }),
        new paperLayerScope.Path.Rectangle({
          rectangle: getAreaTextRectangle(),
          // fillColor: tinyColor('#fff').setAlpha(0.01).toRgbString(),
          // blendMode: 'multiply',
          fillColor: tinyColor('red').setAlpha(0.25).toRgbString(),
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
    setRendered(true);
    return (): void => {
      const { paperLayer } = getPaperLayer();
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // TWEENS
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (paperScope === 'preview') {
      if (!tweening && prevTweening) {
        const { paperLayer, textContent } = getPaperLayer();
        paperLayer.replaceWith(createText());
        setEventInstance(eventInstance + 1);
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

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
          paperParent = paperParent.getItem({ data:{ id:'artboardLayers' } });
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
      const { paperLayer } = getPaperLayer();
      paperLayer.rotation = -prevRotation;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevRotation(layerItem.transform.rotation);
    }
  }, [layerItem.transform.rotation]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.scale(-1, 1);
    }
  }, [layerItem.transform.horizontalFlip]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer } = getPaperLayer();
      paperLayer.scale(1, -1);
    }
  }, [layerItem.transform.verticalFlip]);

  ///////////////////////////////////////////////////////
  // TEXT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.text]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.frame.innerWidth, layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.point.x, layerItem.point.y, artboardItem.frame.innerWidth, artboardItem.frame.innerHeight]);

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
        paperLayer.style.blur = layerItem.style.blur.blur;
      } else {
        paperLayer.style.blur = null;
      }
    }
  }, [layerItem.style.blur.enabled]);

  useEffect(() => {
    if (rendered) {
      if (layerItem.style.blur.enabled) {
        const paperLayer = paperProject.getItem({ data: { id } });
        paperLayer.style.blur = layerItem.style.blur.blur;
      }
    }
  }, [layerItem.style.blur.blur]);

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
    layerItem.textStyle.fontSize, layerItem.textStyle.justification, layerItem.textStyle.leading
  ]);

  useEffect(() => {
    if (rendered) {
      const { textContent } = getPaperLayer();
      textContent.strokeWidth = layerItem.style.stroke.width;
    }
  }, [layerItem.style.stroke.width]);

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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.fontFamily = layerItem.textStyle.fontFamily;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.fontWeight = layerItem.textStyle.fontWeight;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.fontStyle = layerItem.textStyle.fontStyle;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.letterSpacing = layerItem.textStyle.letterSpacing;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.textTransform = layerItem.textStyle.textTransform;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.textTransform]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.fontSize = layerItem.textStyle.fontSize;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.fontSize]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      textContent.justification = layerItem.textStyle.justification;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.justification]);

  useEffect(() => {
    if (rendered) {
      const { paperLayer, textContent, textBackground } = getPaperLayer();
      clearLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
      textContent.point = getAbsPoint();
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
        paperLayer,
        transform: layerItem.transform
      });
      const bounds = getAreaTextRectangle();
      textContent.leading = layerItem.textStyle.leading;
      textContent.content = content;
      textBackground.bounds = bounds;
      textMask.bounds = bounds;
      textContent.point = getAbsPoint();
      applyLayerTransforms({
        paperLayer,
        transform: layerItem.transform
      });
    }
  }, [layerItem.textStyle.leading]);

  // useEffect(() => {
  //   if (rendered) {
  //     const { paperLayer, textContent, textBackground, textMask } = getPaperLayer();
  //     clearLayerTransforms({
  //       paperLayer,
  //       transform: layerItem.transform
  //     });
  //     const bounds = getAreaTextRectangle();
  //     textContent.paragraph = layerItem.textStyle.paragraph;
  //     textContent.content = content;
  //     textBackground.bounds = bounds;
  //     textMask.bounds = bounds;
  //     textContent.point = getAbsPoint();
  //     applyLayerTransforms({
  //       paperLayer,
  //       transform: layerItem.transform
  //     });
  //   }
  // }, [layerItem.textStyle.paragraph]);

  ///////////////////////////////////////////////////////
  // EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered
      ? <>
          {
            layerItem.events.map((eventId) => (
              <CanvasPreviewLayerEvent
                key={eventId}
                eventId={eventId}
                instanceId={`${eventInstance}-${eventId}`} />
            ))
          }
        </>
      : null
    );
  } else {
    return null;
  }
}

export default CanvasTextLayer;