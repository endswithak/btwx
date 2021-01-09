import React, { ReactElement, useEffect, useState } from 'react';
import { uiPaperScope } from '../canvas';

interface CanvasLayerStrokeOptionsStyleProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerStrokeOptionsStyle = (props: CanvasLayerStrokeOptionsStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const strokeCap = layerItem ? layerItem.style.strokeOptions.cap : null;
  const strokeJoin = layerItem ? layerItem.style.strokeOptions.join : null;
  const strokeDashArrayWidth = layerItem ? layerItem.style.strokeOptions.dashArray[0] : null;
  const strokeDashArrayGap = layerItem ? layerItem.style.strokeOptions.dashArray[1] : null;
  const strokeDashOffset = layerItem ? layerItem.style.strokeOptions.dashOffset : null;
  const [prevStrokeCap, setPrevStrokeCap] = useState(strokeCap);
  const [prevStrokeJoin, setPrevStrokeJoin] = useState(strokeJoin);
  const [prevStrokeDashArrayWidth, setPrevStrokeDashArrayWidth] = useState(strokeDashArrayWidth);
  const [prevStrokeDashArrayGap, setPrevStrokeDashArrayGap] = useState(strokeDashArrayGap);
  const [prevStrokeDashOffset, setPrevStrokeDashOffset] = useState(strokeDashOffset);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (paperLayer) {
      if (layerType === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerType === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  useEffect(() => {
    if (rendered && prevStrokeCap !== strokeCap) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeCap = strokeCap;
      setPrevStrokeCap(strokeCap);
    }
  }, [strokeCap]);

  useEffect(() => {
    if (rendered && prevStrokeJoin !== strokeJoin) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeJoin = strokeJoin;
      setPrevStrokeJoin(strokeJoin);
    }
  }, [strokeJoin]);

  useEffect(() => {
    if (rendered && prevStrokeDashArrayWidth !== strokeDashArrayWidth) {
      const paperLayer = getStyleLayer();
      paperLayer.dashArray = [strokeDashArrayWidth, strokeDashArrayGap];
      setPrevStrokeDashArrayWidth(strokeDashArrayWidth);
    }
  }, [strokeDashArrayWidth]);

  useEffect(() => {
    if (rendered && prevStrokeDashArrayGap !== strokeDashArrayGap) {
      const paperLayer = getStyleLayer();
      paperLayer.dashArray = [strokeDashArrayWidth, strokeDashArrayGap];
      setPrevStrokeDashArrayGap(strokeDashArrayGap);
    }
  }, [strokeDashArrayGap]);

  useEffect(() => {
    if (rendered && prevStrokeDashOffset !== strokeDashOffset) {
      const paperLayer = getStyleLayer();
      paperLayer.dashOffset = strokeDashOffset;
      setPrevStrokeDashOffset(strokeDashOffset);
    }
  }, [strokeDashOffset]);

  return (
    <></>
  );
}

export default CanvasLayerStrokeOptionsStyle;