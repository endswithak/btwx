import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerFrameText from './CanvasLayerFrameText';
import CanvasLayerFrameLine from './CanvasLayerFrameLine';

export interface CanvasLayerFrameProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerFrame = (props: CanvasLayerFrameProps): ReactElement => {
  const { paperScope, rendered, layerItem, projectIndex, parentItem, artboardItem } = props;
  const isText = layerItem ? layerItem.type === 'Text' : false;
  const isShape = layerItem ? layerItem.type === 'Shape' : false;
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  const isMask = isShape && (layerItem as Btwx.Shape).mask;
  const [prevX, setPrevX] = useState(layerItem.frame.x);
  const [prevY, setPrevY] = useState(layerItem.frame.y);
  const [prevInnerWidth, setPrevInnerWidth] = useState(layerItem.frame.innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(layerItem.frame.innerHeight);

  const getPaperLayer = (): paper.Item => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    return paperProject.getItem({data: {id: layerItem.id}});
  }

  useEffect(() => {
    if (rendered && prevX !== layerItem.frame.x && !isText && !isLine) {
      const absoluteX = layerItem.frame.x + (layerItem.type !== 'Artboard' ? artboardItem.frame.x : 0);
      const paperLayer = getPaperLayer();
      paperLayer.position.x = absoluteX;
      if (isMask) {
        const maskGroup = paperLayer.parent;
        const mask = maskGroup.children[0];
        mask.position = paperLayer.position;
      }
      setPrevX(layerItem.frame.x);
    }
  }, [layerItem.frame.x]);

  useEffect(() => {
    if (rendered && prevY !== layerItem.frame.y && !isText && !isLine) {
      const absoluteY = layerItem.frame.y + (layerItem.type !== 'Artboard' ? artboardItem.frame.y : 0);
      const paperLayer = getPaperLayer();
      paperLayer.position.y = absoluteY;
      if (isMask) {
        const maskGroup = paperLayer.parent;
        const mask = maskGroup.children[0];
        mask.position = paperLayer.position;
      }
      setPrevY(layerItem.frame.y);
    }
  }, [layerItem.frame.y]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== layerItem.frame.innerWidth && !isText && !isShape) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerItem.type) {
        case 'Image': {
          paperLayer.rotation = -layerItem.transform.rotation;
          paperLayer.bounds.width = layerItem.frame.innerWidth;
          paperLayer.rotation = layerItem.transform.rotation;
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.width = layerItem.frame.innerWidth;
          background.bounds.width = layerItem.frame.innerWidth;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
      setPrevInnerWidth(layerItem.frame.innerWidth);
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered && prevInnerHeight !== layerItem.frame.innerHeight && !isText && !isShape) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerItem.type) {
        case 'Image': {
          paperLayer.rotation = -layerItem.transform.rotation;
          paperLayer.bounds.height = layerItem.frame.innerHeight;
          paperLayer.rotation = layerItem.transform.rotation;
          paperLayer.position = startPosition;
          break;
        }
        case 'Artboard': {
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          mask.bounds.height = layerItem.frame.innerHeight;
          background.bounds.height = layerItem.frame.innerHeight;
          mask.position = startPosition;
          background.position = startPosition;
          break;
        }
      }
      setPrevInnerHeight(layerItem.frame.innerHeight);
    }
  }, [layerItem.frame.innerHeight]);

  return (
    <>
      {
        isText
        ? <CanvasLayerFrameText
            layerItem={layerItem as Btwx.Text}
            artboardItem={artboardItem}
            parentItem={parentItem}
            paperScope={paperScope}
            rendered={rendered}
            projectIndex={projectIndex} />
        : null
      }
      {
        isLine
        ? <CanvasLayerFrameLine
            layerItem={layerItem as Btwx.Line}
            artboardItem={artboardItem}
            parentItem={parentItem}
            paperScope={paperScope}
            rendered={rendered}
            projectIndex={projectIndex} />
        : null
      }
    </>
  );
}

export default CanvasLayerFrame;