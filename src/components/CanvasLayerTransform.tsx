import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerTransformProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerTransform = (props: CanvasLayerTransformProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const isShape = layerItem.type === 'Shape';
  const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);
  const [prevHorizontalFlip, setPrevHorizontalFlip] = useState(layerItem.transform.horizontalFlip);
  const [prevVerticalFlip, setPrevVerticalFlip] = useState(layerItem.transform.verticalFlip);

  const getPaperLayer = (): paper.Item => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    return paperProject.getItem({data: {id: layerItem.id}});
  }

  useEffect(() => {
    if (rendered && layerItem.transform.rotation !== prevRotation && !isShape) {
      const paperLayer = getPaperLayer();
      paperLayer.rotation = -prevRotation;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevRotation(layerItem.transform.rotation);
    }
  }, [layerItem.transform.rotation]);

  useEffect(() => {
    if (rendered && layerItem.transform.horizontalFlip !== prevHorizontalFlip && !isShape) {
      const paperLayer = getPaperLayer();
      paperLayer.scale(-1, 1);
      setPrevHorizontalFlip(layerItem.transform.horizontalFlip);
    }
  }, [layerItem.transform.horizontalFlip]);

  useEffect(() => {
    if (rendered && layerItem.transform.verticalFlip !== prevVerticalFlip && !isShape) {
      const paperLayer = getPaperLayer();
      paperLayer.scale(1, -1);
      setPrevVerticalFlip(layerItem.transform.verticalFlip);
    }
  }, [layerItem.transform.verticalFlip]);

  return (
    <></>
  );
}

export default CanvasLayerTransform;