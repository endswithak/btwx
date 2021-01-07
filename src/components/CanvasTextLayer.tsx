import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasTextLayerProps {
  id: string;
  layerItem: Btwx.Text;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasTextLayer = (props: CanvasTextLayerProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered, setRendered } = props;
  // const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  // const artboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  // const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);

  const createText = (): void => {
    const paperShadowColor = layerItem.style.shadow.enabled ? getPaperShadowColor(layerItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = layerItem.style.shadow.enabled ? new uiPaperScope.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y) : null;
    const paperShadowBlur = layerItem.style.shadow.enabled ? layerItem.style.shadow.blur : null;
    const point = new uiPaperScope.Point(layerItem.point.x, layerItem.point.y).add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y));
    const baseText = new uiPaperScope.PointText({
      point: point,
      content: layerItem.text,
      data: { id: 'textContent', type: 'LayerChild', layerType: 'Text' },
      parent: getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem),
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
      visible: false
    });
    baseText.fillColor = layerItem.style.fill.enabled ? getPaperFillColor(layerItem.style.fill, layerItem.frame) as Btwx.PaperGradientFill : null;
    baseText.strokeColor = layerItem.style.stroke.enabled ? getPaperStrokeColor(layerItem.style.stroke, layerItem.frame) as Btwx.PaperGradientFill : null;
    const textContainer = new uiPaperScope.Group({
      name: layerItem.name,
      parent: getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem),
      data: { id, type: 'Layer', layerType: 'Text', scope: layerItem.scope },
      children: [
        baseText,
        new uiPaperScope.Path.Rectangle({
          from: new uiPaperScope.Point(layerItem.frame.x - layerItem.frame.width / 2, layerItem.frame.y - layerItem.frame.height / 2),
          to: new uiPaperScope.Point(layerItem.frame.x + layerItem.frame.width / 2, layerItem.frame.y + layerItem.frame.height / 2),
          fillColor: tinyColor('red').setAlpha(0).toHslString(),
          data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' },
        }),
        new uiPaperScope.Group({
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
          }, [])
        })
      ],
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame)
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

  return (
    <></>
  );
}

export default CanvasTextLayer;