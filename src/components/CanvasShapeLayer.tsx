import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperFillColor, getPaperShadowColor, getPaperStrokeColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasShapeLayerProps {
  id: string;
  layerItem: Btwx.Shape;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  underlyingMaskIndex: number;
  setRendered(rendered: boolean): void;
}

const CanvasShapeLayer = (props: CanvasShapeLayerProps): ReactElement => {
  const { id, layerItem, layerIndex, artboardItem, rendered, underlyingMaskIndex, setRendered } = props;
  const pathData = layerItem ? layerItem.pathData : null;
  const x = layerItem ? layerItem.frame.x : null;
  const y = layerItem ? layerItem.frame.y : null;
  const [prevPathData, setPrevPathData] = useState(pathData);
  const [prevX, setPrevX] = useState(x);
  const [prevY, setPrevY] = useState(y);

  const createShape = (): void => {
    const paperShadowColor = layerItem.style.shadow.enabled ? getPaperShadowColor(layerItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = layerItem.style.shadow.enabled ? new uiPaperScope.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y) : null;
    const paperShadowBlur = layerItem.style.shadow.enabled ? layerItem.style.shadow.blur : null;
    const paperFillColor = layerItem.style.fill.enabled ? getPaperFillColor(layerItem.style.fill, layerItem.frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = layerItem.style.stroke.enabled ? getPaperStrokeColor(layerItem.style.stroke, layerItem.frame) as Btwx.PaperGradientFill : null;
    const paperParent = (() => {
      let parent = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}});
      if (layerItem.parent === artboardItem.id) {
        parent = parent.getItem({data:{id:'artboardLayers'}});
      }
      if (layerItem.masked) {
        parent = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.underlyingMask}}).parent;
      }
      return parent;
    })();
    const paperLayerIndex = layerItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const shapePaperLayer = new uiPaperScope.CompoundPath({
      name: layerItem.name,
      pathData: layerItem.pathData,
      closed: layerItem.closed,
      strokeWidth: layerItem.style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: layerItem.style.blendMode,
      opacity: layerItem.style.opacity,
      dashArray: layerItem.style.strokeOptions.dashArray,
      dashOffset: layerItem.style.strokeOptions.dashOffset,
      strokeCap: layerItem.style.strokeOptions.cap,
      insert: false,
      // clipMask: layerItem.mask,
      strokeJoin: layerItem.style.strokeOptions.join,
      data: { id: id, type: 'Layer', layerType: 'Shape', shapeType: layerItem.shapeType, scope: layerItem.scope }
    });
    shapePaperLayer.children.forEach((item) => item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' });
    shapePaperLayer.position = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
    shapePaperLayer.fillColor = paperFillColor;
    shapePaperLayer.strokeColor = paperStrokeColor;
    if (layerItem.mask) {
      paperParent.insertChild(paperLayerIndex, new uiPaperScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        children: [
          new uiPaperScope.CompoundPath({
            name: 'mask',
            pathData: shapePaperLayer.pathData,
            position: shapePaperLayer.position,
            fillColor: 'black',
            clipMask: true,
            data: { id: 'mask', type: 'LayerChild', layerType: 'Shape' }
          }),
          shapePaperLayer
        ]
      }));
    } else {
      paperParent.insertChild(paperLayerIndex, shapePaperLayer);
    }
    // paperLayer.scale(layerItem.transform.horizontalFlip ? -1 : 1, layerItem.transform.verticalFlip ? -1 : 1);
    // paperLayer.rotation = layerItem.transform.rotation;
  }

  useEffect(() => {
    // build layer
    createShape();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}});
      if (paperLayer) {
        if (layerItem.mask) {
          const maskGroup = paperLayer.parent;
          maskGroup.children[0].remove();
          maskGroup.parent.insertChildren(maskGroup.index, maskGroup.children);
          maskGroup.remove();
        }
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (rendered && prevPathData !== pathData) {
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const paperLayer = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}}) as paper.CompoundPath;
      paperLayer.pathData = pathData;
      paperLayer.position = absPosition;
      if (layerItem.mask) {
        const maskGroup = uiPaperScope.projects[artboardItem.projectIndex].getItem({data: {id}}).parent;
        (maskGroup.children[0] as paper.CompoundPath).pathData = paperLayer.pathData;
        maskGroup.children[0].position = paperLayer.position;
      }
      setPrevPathData(pathData);
    }
  }, [pathData]);

  return (
    <></>
  );
}

export default CanvasShapeLayer;