import React, { ReactElement, useEffect } from 'react';
import { bufferToBase64 } from '../utils';
import { getPaperShadowColor, getPaperShadowOffset, getLayerAbsPosition, getPaperParent, getPaperShadowBlur } from '../store/utils/paper';
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
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, documentImage, rendered, setRendered } = props;
  const imageItem = layerItem as Btwx.Image;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;

  const createImage = (): void => {
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent: imageItem.parent,
      isParentArtboard: imageItem.parent === imageItem.artboard,
      masked: imageItem.masked,
      underlyingMask: imageItem.underlyingMask
    });
    const layerIndex = parentItem.children.indexOf(id);
    const underlyingMaskIndex = imageItem.underlyingMask ? parentItem.children.indexOf(imageItem.underlyingMask) : null;
    const paperLayerIndex = imageItem.masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const base64 = bufferToBase64(Buffer.from(documentImage.buffer));
    const raster = new paperLayerScope.Raster(`data:image/webp;base64,${base64}`);
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
      children: [raster],
      insert: false
    });
    paperParent.insertChild(paperLayerIndex, imageContainer);
    raster.onLoad = (): void => {
      raster.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
      imageContainer.bounds.width = imageItem.frame.innerWidth;
      imageContainer.bounds.height = imageItem.frame.innerHeight;
      imageContainer.position = getLayerAbsPosition(imageItem.frame, artboardItem.frame);
      setRendered(true);
    }
  }

  useEffect(() => {
    // build layer
    createImage();
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

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