import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerStrokeOptionsStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerStrokeOptionsStyle = (props: CanvasLayerStrokeOptionsStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const [prevStrokeCap, setPrevStrokeCap] = useState(layerItem.style.strokeOptions.cap);
  const [prevStrokeJoin, setPrevStrokeJoin] = useState(layerItem.style.strokeOptions.join);
  const [prevStrokeDashArrayWidth, setPrevStrokeDashArrayWidth] = useState(layerItem.style.strokeOptions.dashArray[0]);
  const [prevStrokeDashArrayGap, setPrevStrokeDashArrayGap] = useState(layerItem.style.strokeOptions.dashArray[1]);
  const [prevStrokeDashOffset, setPrevStrokeDashOffset] = useState(layerItem.style.strokeOptions.dashOffset);

  const getStyleLayer = (): paper.Item => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
    if (paperLayer) {
      if (layerItem.type === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerItem.type === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    if (rendered && prevStrokeCap !== layerItem.style.strokeOptions.cap) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeCap = layerItem.style.strokeOptions.cap;
      setPrevStrokeCap(layerItem.style.strokeOptions.cap);
    }
  }, [layerItem.style.strokeOptions.cap]);

  useEffect(() => {
    if (rendered && prevStrokeJoin !== layerItem.style.strokeOptions.join) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeJoin = layerItem.style.strokeOptions.join;
      setPrevStrokeJoin(layerItem.style.strokeOptions.join);
    }
  }, [layerItem.style.strokeOptions.join]);

  useEffect(() => {
    if (rendered && prevStrokeDashArrayWidth !== layerItem.style.strokeOptions.dashArray[0]) {
      const paperLayer = getStyleLayer();
      paperLayer.dashArray = [layerItem.style.strokeOptions.dashArray[0], layerItem.style.strokeOptions.dashArray[1]];
      setPrevStrokeDashArrayWidth(layerItem.style.strokeOptions.dashArray[0]);
    }
    if (rendered && prevStrokeDashArrayGap !== layerItem.style.strokeOptions.dashArray[1]) {
      const paperLayer = getStyleLayer();
      paperLayer.dashArray = [layerItem.style.strokeOptions.dashArray[0], layerItem.style.strokeOptions.dashArray[1]];
      setPrevStrokeDashArrayGap(layerItem.style.strokeOptions.dashArray[1]);
    }
  }, [layerItem.style.strokeOptions.dashArray]);

  useEffect(() => {
    if (rendered && prevStrokeDashOffset !== layerItem.style.strokeOptions.dashOffset) {
      const paperLayer = getStyleLayer();
      paperLayer.dashOffset = layerItem.style.strokeOptions.dashOffset;
      setPrevStrokeDashOffset(layerItem.style.strokeOptions.dashOffset);
    }
  }, [layerItem.style.strokeOptions.dashOffset]);

  return (
    <></>
  );
}

export default CanvasLayerStrokeOptionsStyle;