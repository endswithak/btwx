import React, { ReactElement, useEffect, useState } from 'react';
import { uiPaperScope } from '../canvas';
import { getLayerAbsPosition } from '../store/utils/paper';

interface CanvasLayerFrameProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerFrame = (props: CanvasLayerFrameProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const layerType = layerItem ? layerItem.type : null;
  const rotation =  layerItem ? layerItem.transform.rotation : null;
  const x = layerItem ? layerItem.frame.x : null;
  const y = layerItem ? layerItem.frame.y : null;
  const innerWidth = layerItem ? layerItem.frame.innerWidth : null;
  const innerHeight = layerItem ? layerItem.frame.innerHeight : null;
  const [prevX, setPrevX] = useState(x);
  const [prevY, setPrevY] = useState(y);
  const [prevInnerWidth, setPrevInnerWidth] = useState(innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(innerHeight);

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  useEffect(() => {
    if (rendered && prevX !== x) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      setPrevX(x);
    }
  }, [x]);

  useEffect(() => {
    if (rendered && prevY !== y) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      setPrevY(y);
    }
  }, [y]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== innerWidth) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerType) {
        case 'Shape':
        case 'Image': {
          if (rotation !== 0) {
            paperLayer.rotation = -rotation;
          }
          paperLayer.bounds.width = innerWidth;
          if (rotation !== 0) {
            paperLayer.rotation = rotation;
          }
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.width = innerWidth;
          background.bounds.width = innerWidth;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
      setPrevInnerWidth(innerWidth);
    }
  }, [innerWidth]);

  useEffect(() => {
    if (rendered && prevInnerHeight !== innerHeight) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerType) {
        case 'Shape':
        case 'Image': {
          if (rotation !== 0) {
            paperLayer.rotation = -rotation;
          }
          paperLayer.bounds.height = innerHeight;
          if (rotation !== 0) {
            paperLayer.rotation = rotation;
          }
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.height = innerHeight;
          background.bounds.height = innerHeight;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
      setPrevInnerHeight(innerHeight);
    }
  }, [innerHeight]);

  return (
    <></>
  );
}

export default CanvasLayerFrame;