import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasTextLayerProps {
  id: string;
  layerItem: Btwx.Text;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasTextLayer = (props: CanvasTextLayerProps): ReactElement => {
  const { id, layerItem, layerIndex, artboardItem, rendered, setRendered } = props;
  const text = layerItem ? layerItem.text : null;
  const lines = layerItem ? layerItem.lines : null;
  const [prevText, setPrevText] = useState(text);
  const [prevLines, setPrevLines] = useState(lines);

  const createText = (): void => {
    const paperShadowColor = layerItem.style.shadow.enabled ? getPaperShadowColor(layerItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = layerItem.style.shadow.enabled ? new uiPaperScope.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y) : null;
    const paperShadowBlur = layerItem.style.shadow.enabled ? layerItem.style.shadow.blur : null;
    const point = new uiPaperScope.Point(layerItem.point.x, layerItem.point.y).add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y));
    const paperParent = getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem);
    const textContainer = new uiPaperScope.Group({
      name: layerItem.name,
      data: { id, type: 'Layer', layerType: 'Text', scope: layerItem.scope },
      insert: false
    });
    paperParent.insertChild(layerIndex, textContainer);
    const baseText = new uiPaperScope.PointText({
      point: point,
      content: layerItem.text,
      data: { id: 'textContent', type: 'LayerChild', layerType: 'Text' },
      strokeWidth: layerItem.style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: layerItem.style.blendMode,
      opacity: layerItem.style.opacity,
      dashArray: layerItem.style.strokeOptions.dashArray,
      dashOffset: layerItem.style.strokeOptions.dashOffset,
      strokeCap: layerItem.style.strokeOptions.cap,
      strokeJoin: layerItem.style.strokeOptions.join,
      fontSize: layerItem.textStyle.fontSize,
      leading: layerItem.textStyle.leading,
      fontWeight: layerItem.textStyle.fontWeight,
      fontFamily: layerItem.textStyle.fontFamily,
      justification: layerItem.textStyle.justification,
      parent: textContainer,
      visible: false
    });
    baseText.fillColor = layerItem.style.fill.enabled ? getPaperFillColor(layerItem.style.fill, layerItem.frame) as Btwx.PaperGradientFill : null;
    baseText.strokeColor = layerItem.style.stroke.enabled ? getPaperStrokeColor(layerItem.style.stroke, layerItem.frame) as Btwx.PaperGradientFill : null;
    const textLinesGroup = new uiPaperScope.Group({
      data: { id: 'textLines', type: 'LayerChild', layerType: 'Text' },
      children: layerItem.lines.reduce((result: paper.PointText[], current: Btwx.TextLine, index: number) => {
        const line = new uiPaperScope.PointText({
          point: new uiPaperScope.Point(baseText.point.x, baseText.point.y + (index * layerItem.textStyle.leading)),
          content: current.text,
          style: baseText.style,
          visible: true,
          data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
        });
        return [...result, line];
      }, []),
      parent: textContainer
    });
    const textBackground = new uiPaperScope.Path.Rectangle({
      rectangle: textLinesGroup.bounds,
      fillColor: tinyColor('red').setAlpha(0.25).toHslString(),
      data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' },
      parent: textContainer
    });
    textContainer.scale(layerItem.transform.horizontalFlip ? -1 : 1, layerItem.transform.verticalFlip ? -1 : 1);
    textContainer.rotation = layerItem.transform.rotation;
  }

  useEffect(() => {
    // build layer
    createText();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (rendered && prevText !== text) {
      const paperLayer = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}}) as paper.Group;
      const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
      const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
      const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      const newLines = text.split(/\r\n|\r|\n/).reduce((result, current) => {
        return [...result, {
          text: current,
          width: null
        }];
      }, []);
      const maxLines = Math.max(newLines.length, prevLines.length);
      paperLayer.rotation = -layerItem.transform.rotation;
      const originalPoint = textContent.point;
      textContent.content = text;
      textContent.point = originalPoint;
      textLinesGroup.removeChildren();
      for(let i = 0; i < maxLines; i++) {
        if (newLines[i]) {
          const newLine = new uiPaperScope.PointText({
            point: new uiPaperScope.Point(originalPoint.x, originalPoint.y + (i * (layerItem as Btwx.Text).textStyle.leading)),
            content: newLines[i].text,
            style: textContent.style,
            parent: textLinesGroup,
            data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
          });
          newLine.leading = newLine.fontSize;
          newLines[i].width = newLine.bounds.width;
          newLine.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
          newLine.leading = textContent.leading;
        }
      }
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevText(text);
      setPrevLines(newLines);
    }
  }, [text]);

  return (
    <></>
  );
}

export default CanvasTextLayer;