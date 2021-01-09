import React, { ReactElement, useEffect } from 'react';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasShapeLayerProps {
  id: string;
  layerItem: Btwx.Shape;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasShapeLayer = (props: CanvasShapeLayerProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered, setRendered } = props;

  const createShape = (): void => {
    const shapeItem = layerItem as Btwx.Shape;
    const paperShadowColor = shapeItem.style.shadow.enabled ? getPaperShadowColor(shapeItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = shapeItem.style.shadow.enabled ? new uiPaperScope.Point(shapeItem.style.shadow.offset.x, shapeItem.style.shadow.offset.y) : null;
    const paperShadowBlur = shapeItem.style.shadow.enabled ? shapeItem.style.shadow.blur : null;
    const paperFillColor = shapeItem.style.fill.enabled ? getPaperFillColor(shapeItem.style.fill, shapeItem.frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = shapeItem.style.stroke.enabled ? getPaperStrokeColor(shapeItem.style.stroke, shapeItem.frame) as Btwx.PaperGradientFill : null;
    const paperLayer = new uiPaperScope.CompoundPath({
      name: layerItem.name,
      pathData: shapeItem.pathData,
      closed: shapeItem.closed,
      strokeWidth: shapeItem.style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: shapeItem.style.blendMode,
      opacity: shapeItem.style.opacity,
      dashArray: shapeItem.style.strokeOptions.dashArray,
      dashOffset: shapeItem.style.strokeOptions.dashOffset,
      strokeCap: shapeItem.style.strokeOptions.cap,
      clipMask: shapeItem.mask,
      strokeJoin: shapeItem.style.strokeOptions.join,
      data: { id: id, type: 'Layer', layerType: 'Shape', shapeType: shapeItem.shapeType, scope: shapeItem.scope },
      parent: getLayerPaperParent(uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: shapeItem.parent}}), shapeItem)
    });
    paperLayer.children.forEach((item) => item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = getLayerAbsPosition(shapeItem.frame, artboardItem.frame);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    // paperLayer.scale(shapeItem.transform.horizontalFlip ? -1 : 1, shapeItem.transform.verticalFlip ? -1 : 1);
    // paperLayer.rotation = shapeItem.transform.rotation;
    if (shapeItem.mask) {
      const maskGroup = new uiPaperScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        children: [paperLayer.clone()]
      });
      paperLayer.replaceWith(maskGroup);
    }
  }

  useEffect(() => {
    // build layer
    createShape();
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

export default CanvasShapeLayer;