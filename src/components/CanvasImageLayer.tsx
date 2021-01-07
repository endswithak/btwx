import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { bufferToBase64 } from '../utils';
import { getPaperShadowColor, getLayerAbsPosition } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasImageLayerProps {
  id: string;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasImageLayer = (props: CanvasImageLayerProps): ReactElement => {
  const { id, rendered, setRendered } = props;
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard);
  const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);

  const createImage = (): void => {
    const imageItem = layerItem as Btwx.Image;
    const paperShadowColor = imageItem.style.shadow.enabled ? getPaperShadowColor(imageItem.style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = imageItem.style.shadow.enabled ? new uiPaperScope.Point(imageItem.style.shadow.offset.x, imageItem.style.shadow.offset.y) : null;
    const paperShadowBlur = imageItem.style.shadow.enabled ? imageItem.style.shadow.blur : null;
    const base64 = bufferToBase64(documentImages[imageItem.imageId].buffer);
    const paperLayer = new uiPaperScope.Raster(`data:image/webp;base64,${base64}`);
    const imageContainer = new uiPaperScope.Group({
      name: imageItem.name,
      parent: uiPaperScope.projects[projectIndex].getItem({data: {id: imageItem.parent}}),
      data: { id: imageItem.id, imageId: imageItem.imageId, type: 'Layer', layerType: 'Image', scope: imageItem.scope },
      children: [paperLayer]
    });
    paperLayer.onLoad = (): void => {
      paperLayer.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
      imageContainer.bounds.width = imageItem.frame.innerWidth;
      imageContainer.bounds.height = imageItem.frame.innerHeight;
      imageContainer.position = getLayerAbsPosition(imageItem.frame, artboardItem.frame);
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

export default CanvasImageLayer;