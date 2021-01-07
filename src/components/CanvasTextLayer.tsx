import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasTextLayerProps {
  id: string;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasTextLayer = (props: CanvasTextLayerProps): ReactElement => {
  const { id, rendered, setRendered } = props;
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);

  const createText = (): void => {
    const textItem = layerItem as Btwx.Text;
    const paperShadowColor = textItem.style.shadow.enabled ? getPaperShadowColor(textItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = textItem.style.shadow.enabled ? new uiPaperScope.Point(textItem.style.shadow.offset.x, textItem.style.shadow.offset.y) : null;
    const paperShadowBlur = textItem.style.shadow.enabled ? textItem.style.shadow.blur : null;
    const point = new uiPaperScope.Point(textItem.point.x, textItem.point.y).add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y));
    const baseText = new uiPaperScope.PointText({
      point: point,
      content: textItem.text,
      data: { id: 'textContent', type: 'LayerChild', layerType: 'Text' },
      parent: getLayerPaperParent(uiPaperScope.projects[projectIndex].getItem({data: {id: textItem.parent}}), textItem),
      strokeWidth: textItem.style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
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
      visible: false
    });
    baseText.fillColor = textItem.style.fill.enabled ? getPaperFillColor(textItem.style.fill, textItem.frame) as Btwx.PaperGradientFill : null;
    baseText.strokeColor = textItem.style.stroke.enabled ? getPaperStrokeColor(textItem.style.stroke, textItem.frame) as Btwx.PaperGradientFill : null;
    const textContainer = new uiPaperScope.Group({
      name: textItem.name,
      parent: getLayerPaperParent(uiPaperScope.projects[projectIndex].getItem({data: {id: textItem.parent}}), textItem),
      data: { id, type: 'Layer', layerType: 'Text', scope: textItem.scope },
      children: [
        baseText,
        new uiPaperScope.Path.Rectangle({
          from: new uiPaperScope.Point(textItem.frame.x - textItem.frame.width / 2, textItem.frame.y - textItem.frame.height / 2),
          to: new uiPaperScope.Point(textItem.frame.x + textItem.frame.width / 2, textItem.frame.y + textItem.frame.height / 2),
          fillColor: tinyColor('red').setAlpha(0).toHslString(),
          data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' },
        }),
        new uiPaperScope.Group({
          data: { id: 'textLines', type: 'LayerChild', layerType: 'Text' },
          children: textItem.lines.reduce((result: paper.PointText[], current: Btwx.TextLine, index: number) => {
            const line = new uiPaperScope.PointText({
              point: new uiPaperScope.Point(baseText.point.x, baseText.point.y + (index * textItem.textStyle.leading)),
              content: current.text,
              style: baseText.style,
              visible: true,
              data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
            });
            return [...result, line];
          }, [])
        })
      ],
      position: getLayerAbsPosition(textItem.frame, artboardItem.frame)
    });
    textContainer.scale(textItem.transform.horizontalFlip ? -1 : 1, textItem.transform.verticalFlip ? -1 : 1);
    textContainer.rotation = textItem.transform.rotation;
  }

  useEffect(() => {
    // build layer
    createText();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, [id]);

  return (
    <></>
  );
}

export default CanvasTextLayer;