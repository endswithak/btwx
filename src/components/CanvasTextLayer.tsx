import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getPaperParent, getPaperShadowOffset, getPaperShadowBlur } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import CanvasLayerFrame from './CanvasLayerFrame';
import CanvasLayerStyle from './CanvasLayerStyle';
import CanvasLayerTransform from './CanvasLayerTransform';
import CanvasMaskableLayer from './CanvasMaskableLayer';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasTextLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasTextLayer = (props: CanvasLayerContainerProps & CanvasTextLayerProps): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, setRendered } = props;
  const textItem = layerItem as Btwx.Text;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevText, setPrevText] = useState(textItem.text);
  const [prevLines, setPrevLines] = useState(textItem.lines);

  const createText = (): void => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
      masked: textItem.masked,
      underlyingMask: textItem.underlyingMask
    });
    const layerIndex = parentItem.children.indexOf(id);
    const underlyingMaskIndex = textItem.underlyingMask ? parentItem.children.indexOf(textItem.underlyingMask) : null;
    const paperLayerIndex = textItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const point = new paperLayerScope.Point(textItem.point.x, textItem.point.y).add(new paperLayerScope.Point(artboardItem.frame.x, artboardItem.frame.y));
    const textContainer = new paperLayerScope.Group({
      name: textItem.name,
      insert: false,
      data: {
        id,
        type: 'Layer',
        layerType: 'Text',
        scope: textItem.scope
      }
    });
    const baseText = new paperLayerScope.PointText({
      point: point,
      content: textItem.text,
      fillColor: getPaperFillColor({
        fill: textItem.style.fill,
        isLine: false,
        layerFrame: textItem.frame,
        artboardFrame: artboardItem.frame
      }),
      strokeColor: getPaperStrokeColor({
        stroke: textItem.style.stroke,
        isLine: false,
        layerFrame: textItem.frame,
        artboardFrame: artboardItem.frame
      }),
      strokeWidth: textItem.style.stroke.width,
      shadowColor: getPaperShadowColor(textItem.style.shadow),
      shadowOffset: getPaperShadowOffset(textItem.style.shadow),
      shadowBlur: getPaperShadowBlur(textItem.style.shadow),
      blendMode: textItem.style.blendMode,
      opacity: textItem.style.opacity,
      dashArray: textItem.style.strokeOptions.dashArray,
      dashOffset: textItem.style.strokeOptions.dashOffset,
      strokeCap: textItem.style.strokeOptions.cap,
      strokeJoin: textItem.style.strokeOptions.join,
      fontSize: textItem.textStyle.fontSize,
      leading: textItem.textStyle.leading,
      fontWeight: textItem.textStyle.fontWeight,
      fontFamily: textItem.textStyle.fontFamily,
      justification: textItem.textStyle.justification,
      parent: textContainer,
      visible: false,
      data: { id: 'textContent', type: 'LayerChild', layerType: 'Text' },
    });
    const textLinesGroup = new paperLayerScope.Group({
      data: { id: 'textLines', type: 'LayerChild', layerType: 'Text' },
      children: textItem.lines.reduce((result: paper.PointText[], current: Btwx.TextLine, index: number) => {
        const line = new paperLayerScope.PointText({
          point: new paperLayerScope.Point(baseText.point.x, baseText.point.y + (index * textItem.textStyle.leading)),
          content: current.text,
          style: baseText.style,
          visible: true,
          data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
        });
        return [...result, line];
      }, []),
      parent: textContainer
    });
    const textBackground = new paperLayerScope.Path.Rectangle({
      rectangle: textLinesGroup.bounds,
      fillColor: tinyColor('red').setAlpha(0.25).toHslString(),
      data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' },
      parent: textContainer
    });
    textContainer.scale(textItem.transform.horizontalFlip ? -1 : 1, textItem.transform.verticalFlip ? -1 : 1);
    textContainer.rotation = textItem.transform.rotation;
    paperParent.insertChild(paperLayerIndex, textContainer);
  }

  useEffect(() => {
    // build layer
    createText();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (rendered && prevText !== textItem.text) {
      const paperLayer = paperProject.getItem({data: {id}}) as paper.Group;
      const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
      const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
      const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      const newLines = textItem.text.split(/\r\n|\r|\n/).reduce((result, current) => {
        return [...result, {
          text: current,
          width: null
        }];
      }, []);
      const maxLines = Math.max(newLines.length, prevLines.length);
      paperLayer.rotation = -textItem.transform.rotation;
      const originalPoint = textContent.point;
      textContent.content = textItem.text;
      textContent.point = originalPoint;
      textLinesGroup.removeChildren();
      for(let i = 0; i < maxLines; i++) {
        if (newLines[i]) {
          const newLine = new paperLayerScope.PointText({
            point: new paperLayerScope.Point(originalPoint.x, originalPoint.y + (i * (textItem as Btwx.Text).textStyle.leading)),
            content: newLines[i].text,
            style: textContent.style,
            parent: textLinesGroup,
            data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
          });
          newLine.leading = newLine.fontSize;
          newLines[i].width = newLine.bounds.width;
          newLine.skew(new paperLayerScope.Point(-(textItem as Btwx.Text).textStyle.oblique, 0));
          newLine.leading = textContent.leading;
        }
      }
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = textItem.transform.rotation;
      setPrevText(textItem.text);
      setPrevLines(newLines);
    }
  }, [textItem.text]);

  return (
    <>
      <CanvasMaskableLayer
        layerItem={layerItem as Btwx.MaskableLayer}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerTransform
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerFrame
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerStyle
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      {
        paperScope === 'preview' && rendered
        ? layerItem.events.map((eventId, index) => (
            <CanvasPreviewLayerEvent
              key={eventId}
              id={id}
              eventId={eventId} />
          ))
        : null
      }
    </>
  );
}

export default CanvasLayerContainer(CanvasTextLayer);