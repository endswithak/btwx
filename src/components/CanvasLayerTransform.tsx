import React, { ReactElement, useEffect, useState } from 'react';
import { uiPaperScope } from '../canvas';

interface CanvasLayerTransformProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerTransform = (props: CanvasLayerTransformProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const rotation =  layerItem ? layerItem.transform.rotation : null;
  const horizontalFlip = layerItem ? layerItem.transform.horizontalFlip : null;
  const verticalFlip = layerItem ? layerItem.transform.verticalFlip : null;
  const [prevRotation, setPrevRotation] = useState(rotation);
  const [prevHorizontalFlip, setPrevHorizontalFlip] = useState(horizontalFlip);
  const [prevVerticalFlip, setPrevVerticalFlip] = useState(verticalFlip);

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  useEffect(() => {
    if (rendered && rotation !== prevRotation) {
      const paperLayer = getPaperLayer();
      paperLayer.rotation = -prevRotation;
      paperLayer.rotation = rotation;
      setPrevRotation(rotation);
    }
  }, [rotation]);

  useEffect(() => {
    if (rendered && horizontalFlip !== prevHorizontalFlip) {
      const paperLayer = getPaperLayer();
      paperLayer.scale(-1, 1);
      setPrevHorizontalFlip(horizontalFlip);
    }
  }, [horizontalFlip]);

  useEffect(() => {
    if (rendered && verticalFlip !== prevVerticalFlip) {
      const paperLayer = getPaperLayer();
      paperLayer.scale(1, -1);
      setPrevVerticalFlip(verticalFlip);
    }
  }, [verticalFlip]);

  return (
    <></>
  );
}

export default CanvasLayerTransform;