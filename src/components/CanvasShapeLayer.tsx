import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperStyle, getLayerAbsPosition, getPaperParent, getPaperLayerIndex } from '../store/utils/paper';
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

const CanvasShapeLayer = (props: CanvasLayerContainerProps & CanvasShapeLayerProps & { layerItem: Btwx.Shape }): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, tweening, setRendered } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevPathData, setPrevPathData] = useState(layerItem.pathData);
  const [prevTweening, setPrevTweening] = useState(false);

  const createShape = (): paper.Item => {
    const shapePaperLayer = new paperLayerScope.CompoundPath({
      name: layerItem.name,
      pathData: layerItem.pathData,
      closed: layerItem.closed,
      position: getLayerAbsPosition(layerItem.frame, artboardItem.frame),
      insert: false,
      data: {
        id: id,
        type: 'Layer',
        layerType: 'Shape',
        shapeType: layerItem.shapeType,
        scope: layerItem.scope
      },
      ...getPaperStyle({
        style: layerItem.style,
        textStyle: null,
        isLine: layerItem.shapeType === 'Line',
        layerFrame: layerItem.frame,
        artboardFrame: artboardItem.frame
      })
    });
    shapePaperLayer.children.forEach((item) => {
      item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' };
    });
    if (layerItem.mask) {
      return new paperLayerScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        insert: false,
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
      });
    } else {
      return shapePaperLayer;
    }
  }

  useEffect(() => {
    // build layer
    getPaperParent({
      paperScope,
      projectIndex,
      parent: layerItem.parent,
      isParentArtboard: layerItem.parent === layerItem.artboard,
      masked: layerItem.masked,
      underlyingMask: layerItem.underlyingMask
    }).insertChild(
      getPaperLayerIndex(layerItem, parentItem),
      createShape()
    );
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
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
    if (prevTweening !== tweening && paperScope === 'preview') {
      if (!tweening) {
        let oldPaperLayer = paperProject.getItem({data: {id}});
        const newPaperLayer = createShape();
        if (layerItem.mask) {
          oldPaperLayer = oldPaperLayer.parent;
          const nonMaskChildren = oldPaperLayer.children.slice(2, oldPaperLayer.children.length);
          newPaperLayer.addChildren(nonMaskChildren);
        }
        oldPaperLayer.replaceWith(newPaperLayer);
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

  useEffect(() => {
    if (rendered && prevPathData !== layerItem.pathData) {
      const absPosition = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      const paperLayer = paperProject.getItem({data: {id}}) as paper.CompoundPath;
      paperLayer.pathData = layerItem.pathData;
      paperLayer.position = absPosition;
      if (layerItem.mask) {
        const maskGroup = paperProject.getItem({data: {id}}).parent;
        (maskGroup.children[0] as paper.CompoundPath).pathData = paperLayer.pathData;
        maskGroup.children[0].position = paperLayer.position;
      }
      setPrevPathData(layerItem.pathData);
    }
  }, [layerItem.pathData]);

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
        paperScope === 'preview' && rendered && !tweening
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