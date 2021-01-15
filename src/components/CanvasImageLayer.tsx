import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { bufferToBase64 } from '../utils';
import { getPaperShadowColor, getLayerAbsPosition, getLayerPaperParent } from '../store/utils/paper';
import { paperMain } from '../canvas';

interface CanvasImageLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  layerItem: Btwx.Image;
  layerIndex: number;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasImageLayer = (props: CanvasImageLayerProps): ReactElement => {
  const { id, paperScope, layerItem, layerIndex, artboardItem, rendered, setRendered } = props;
  const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);

  const createImage = (): void => {
    const paperShadowColor = layerItem.style.shadow.enabled ? getPaperShadowColor(layerItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = layerItem.style.shadow.enabled ? new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y) : null;
    const paperShadowBlur = layerItem.style.shadow.enabled ? layerItem.style.shadow.blur : null;
    const paperParent = getLayerPaperParent(paperMain.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.parent}}), layerItem);
    const base64 = bufferToBase64(documentImages[layerItem.imageId].buffer);
    const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
    const imageContainer = new paperMain.Group({
      name: layerItem.name,
      data: { id: layerItem.id, imageId: layerItem.imageId, type: 'Layer', layerType: 'Image', scope: layerItem.scope },
      children: [paperLayer],
      insert: false
    });
    paperParent.insertChild(layerIndex, imageContainer);
    paperLayer.onLoad = (): void => {
      paperLayer.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
      imageContainer.bounds.width = layerItem.frame.innerWidth;
      imageContainer.bounds.height = layerItem.frame.innerHeight;
      imageContainer.position = getLayerAbsPosition(layerItem.frame, artboardItem.frame);
      imageContainer.shadowColor = paperShadowColor;
      imageContainer.shadowOffset = paperShadowOffset;
      imageContainer.shadowBlur = paperShadowBlur;
      setRendered(true);
    }
  }

  useEffect(() => {
    // build layer
    createImage();
    return (): void => {
      // remove layer
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <></>
  );
}

export default CanvasImageLayer;