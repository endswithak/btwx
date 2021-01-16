import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperFillColor, getPaperShadowColor, getPaperShadowOffset, getPaperStrokeColor, getLayerAbsPosition, getPaperParent, getPaperShadowBlur } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import CanvasLayerFrame from './CanvasLayerFrame';
import CanvasLayerStyle from './CanvasLayerStyle';
import CanvasLayerTransform from './CanvasLayerTransform';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';
import CanvasMaskableLayer from './CanvasMaskableLayer';

interface CanvasShapeLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasShapeLayer = (props: CanvasLayerContainerProps & CanvasShapeLayerProps): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, setRendered } = props;
  const shapeItem = layerItem as Btwx.Shape;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevPathData, setPrevPathData] = useState(shapeItem.pathData);

  const createShape = (): void => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: shapeItem.parent,
      isParentArtboard: shapeItem.parent === shapeItem.artboard,
      masked: shapeItem.masked,
      underlyingMask: shapeItem.underlyingMask
    });
    const layerIndex = parentItem.children.indexOf(id);
    const underlyingMaskIndex = shapeItem.underlyingMask ? parentItem.children.indexOf(shapeItem.underlyingMask) : null;
    const paperLayerIndex = shapeItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const shapePaperLayer = new paperLayerScope.CompoundPath({
      name: shapeItem.name,
      pathData: shapeItem.pathData,
      closed: shapeItem.closed,
      position: getLayerAbsPosition(shapeItem.frame, artboardItem.frame),
      fillColor: getPaperFillColor({
        fill: shapeItem.style.fill,
        isLine: shapeItem.shapeType === 'Line',
        layerFrame: shapeItem.frame,
        artboardFrame: artboardItem.frame
      }),
      strokeColor: getPaperStrokeColor({
        stroke: shapeItem.style.stroke,
        isLine: shapeItem.shapeType === 'Line',
        layerFrame: shapeItem.frame,
        artboardFrame: artboardItem.frame
      }),
      strokeWidth: shapeItem.style.stroke.width,
      shadowColor: getPaperShadowColor(shapeItem.style.shadow),
      shadowOffset: getPaperShadowOffset(shapeItem.style.shadow),
      shadowBlur: getPaperShadowBlur(shapeItem.style.shadow),
      blendMode: shapeItem.style.blendMode,
      opacity: shapeItem.style.opacity,
      dashArray: shapeItem.style.strokeOptions.dashArray,
      dashOffset: shapeItem.style.strokeOptions.dashOffset,
      strokeCap: shapeItem.style.strokeOptions.cap,
      strokeJoin: shapeItem.style.strokeOptions.join,
      insert: false,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'Shape',
        shapeType: shapeItem.shapeType,
        scope: shapeItem.scope
      }
    });
    shapePaperLayer.children.forEach((item) => item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' });
    if (shapeItem.mask) {
      paperParent.insertChild(paperLayerIndex, new paperLayerScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        children: [
          new paperLayerScope.CompoundPath({
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
  }

  useEffect(() => {
    // build layer
    createShape();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        if (shapeItem.mask) {
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
    if (rendered && prevPathData !== shapeItem.pathData) {
      const absPosition = getLayerAbsPosition(shapeItem.frame, artboardItem.frame);
      const paperLayer = paperProject.getItem({data: {id}}) as paper.CompoundPath;
      paperLayer.pathData = shapeItem.pathData;
      paperLayer.position = absPosition;
      if (shapeItem.mask) {
        const maskGroup = paperProject.getItem({data: {id}}).parent;
        (maskGroup.children[0] as paper.CompoundPath).pathData = paperLayer.pathData;
        maskGroup.children[0].position = paperLayer.position;
      }
      setPrevPathData(shapeItem.pathData);
    }
  }, [shapeItem.pathData]);

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
              eventId={eventId} />
          ))
        : null
      }
    </>
  );
}

export default CanvasLayerContainer(CanvasShapeLayer);