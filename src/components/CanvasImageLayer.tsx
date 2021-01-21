import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { getPaperShadowColor, getPaperShadowOffset, getLayerAbsPosition, getPaperParent, getPaperShadowBlur, getPaperLayerIndex } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import CanvasLayerFrame from './CanvasLayerFrame';
import CanvasLayerStyle from './CanvasLayerStyle';
import CanvasLayerTransform from './CanvasLayerTransform';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';
import CanvasMaskableLayer from './CanvasMaskableLayer';

interface CanvasImageLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasImageLayer = (props: CanvasLayerContainerProps & CanvasImageLayerProps): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, tweening, rendered, setRendered } = props;
  const imageItem = layerItem as Btwx.Image;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevImageId, setPrevImageId] = useState(imageItem.imageId);
  const [prevTweening, setPrevTweening] = useState(false);

  const createImage = (): Promise<paper.Group> => {
    const imageAbsPosition = getLayerAbsPosition(imageItem.frame, artboardItem.frame);
    return new Promise((resolve, reject) => {
      const raster = new paperLayerScope.Raster(imageItem.imageId);
      raster.visible = false;
      const imageContainer = new paperLayerScope.Group({
        name: imageItem.name,
        shadowColor: getPaperShadowColor(imageItem.style.shadow),
        shadowOffset: getPaperShadowOffset(imageItem.style.shadow),
        shadowBlur: getPaperShadowBlur(imageItem.style.shadow),
        data: {
          id: imageItem.id,
          imageId: imageItem.imageId,
          type: 'Layer',
          layerType: 'Image',
          scope: imageItem.scope
        },
        children: [
          raster,
          new paperLayerScope.Path.Rectangle({
            from: new paperLayerScope.Point(imageAbsPosition.x - (imageItem.frame.innerWidth / 2), imageAbsPosition.y - (imageItem.frame.innerHeight / 2)),
            to: new paperLayerScope.Point(imageAbsPosition.x + (imageItem.frame.innerWidth / 2), imageAbsPosition.y + (imageItem.frame.innerHeight / 2)),
            data: { id: 'imageScrim', type: 'LayerChild', layerType: 'Image' },
            fillColor: tinyColor('blue').setAlpha(0.20).toHslString(),
            // blendMode: 'multiply'
          })
        ],
        insert: false
      });
      raster.onLoad = (): void => {
        raster.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
        raster.bounds.width = imageItem.frame.innerWidth;
        raster.bounds.height = imageItem.frame.innerHeight;
        raster.position = imageAbsPosition;
        raster.visible = true;
        imageContainer.scale(imageItem.transform.horizontalFlip ? -1 : 1, imageItem.transform.verticalFlip ? -1 : 1);
        imageContainer.rotation = imageItem.transform.rotation;
        resolve(imageContainer);
      }
    })
  }

  useEffect(() => {
    // build layer
    createImage().then((imageContainer) => {
      getPaperParent({
        paperScope,
        projectIndex,
        parent: imageItem.parent,
        isParentArtboard: imageItem.parent === imageItem.artboard,
        masked: imageItem.masked,
        underlyingMask: imageItem.underlyingMask
      }).insertChild(getPaperLayerIndex(imageItem, parentItem), imageContainer);
      setRendered(true);
    });
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (prevTweening !== tweening && paperScope === 'preview') {
      if (!tweening) {
        createImage().then((imageContainer) => {
          paperProject.getItem({data: {id}}).replaceWith(imageContainer);
        });
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

  useEffect(() => {
    if (rendered && prevImageId !== imageItem.imageId) {
      const imageAbsPosition = getLayerAbsPosition(imageItem.frame, artboardItem.frame);
      const oldRaster = paperProject.getItem({data: {id}}).getItem({data:{id:'raster'}});
      const newRaster = new paperLayerScope.Raster(imageItem.imageId);
      newRaster.visible = false;
      newRaster.onLoad = (): void => {
        newRaster.bounds.width = imageItem.frame.innerWidth;
        newRaster.bounds.height = imageItem.frame.innerHeight;
        newRaster.position = imageAbsPosition;
        newRaster.scale(imageItem.transform.horizontalFlip ? -1 : 1, imageItem.transform.verticalFlip ? -1 : 1);
        newRaster.rotation = imageItem.transform.rotation;
        newRaster.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
        newRaster.visible = true;
        oldRaster.replaceWith(newRaster);
      }
      setPrevImageId(imageItem.imageId);
    }
  }, [imageItem.imageId]);

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

export default CanvasLayerContainer(CanvasImageLayer);