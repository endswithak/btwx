import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerFrameLineProps {
  layerItem: Btwx.Line;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerFrameLine = (props: CanvasLayerFrameLineProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const [prevFromX, setPrevFromX] = useState(layerItem.from.x);
  const [prevFromY, setPrevFromY] = useState(layerItem.from.y);
  const [prevToX, setPrevToX] = useState(layerItem.to.x);
  const [prevToY, setPrevToY] = useState(layerItem.to.y);

  const getPaperLayer = (): paper.Item => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    return paperProject.getItem({data: {id: layerItem.id}});
  }

  useEffect(() => {
    if (rendered && prevFromX !== layerItem.from.x) {
      const paperLayer = getPaperLayer() as paper.Path;
      paperLayer.firstSegment.point.x = layerItem.from.x + artboardItem.frame.x;
      setPrevFromX(layerItem.from.x);
    }
  }, [layerItem.from.x]);

  useEffect(() => {
    if (rendered && prevFromY !== layerItem.from.y) {
      const paperLayer = getPaperLayer() as paper.Path;
      paperLayer.firstSegment.point.y = layerItem.from.y + artboardItem.frame.y;
      setPrevFromY(layerItem.from.y);
    }
  }, [layerItem.from.y]);

  useEffect(() => {
    if (rendered && prevToX !== layerItem.to.x) {
      const paperLayer = getPaperLayer() as paper.Path;
      paperLayer.lastSegment.point.x = layerItem.to.x + artboardItem.frame.x;
      setPrevToX(layerItem.to.x);
    }
  }, [layerItem.to.x]);

  useEffect(() => {
    if (rendered && prevToY !== layerItem.to.y) {
      const paperLayer = getPaperLayer() as paper.Path;
      paperLayer.lastSegment.point.y = layerItem.to.y + artboardItem.frame.y;
      setPrevToY(layerItem.to.y);
    }
  }, [layerItem.to.y]);

  return (
    <></>
  );
}

export default CanvasLayerFrameLine;