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
  const pointX = layerItem && layerItem.type === 'Text' ? (layerItem as Btwx.Text).point.x : null;
  const pointY = layerItem && layerItem.type === 'Text' ? (layerItem as Btwx.Text).point.y : null;
  const justification = layerItem && layerItem.type === 'Text' ? (layerItem as Btwx.Text).textStyle.justification : null;
  const [prevX, setPrevX] = useState(x);
  const [prevY, setPrevY] = useState(y);
  const [prevInnerWidth, setPrevInnerWidth] = useState(innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(innerHeight);
  const [prevPointX, setPrevPointX] = useState(pointX);
  const [prevPointY, setPrevPointY] = useState(pointY);
  const [prevJustification, setPrevJustification] = useState(justification);

  const getPaperLayer = (): paper.Item => {
    return uiPaperScope.projects[projectIndex].getItem({data: {id}});
  }

  const getTextPaperLayers = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textContent: paper.PointText;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperLayer = getPaperLayer() as paper.Group;
    const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
    const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
    const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
    return {
      paperLayer,
      textLinesGroup,
      textContent,
      textBackground
    };
  }

  useEffect(() => {
    if (rendered && prevPointX !== pointX && layerType === 'Text') {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      paperLayer.rotation = -layerItem.transform.rotation;
      const absPointX = pointX + artboardItem.frame.x;
      textContent.point.x = absPointX;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = line.fontSize;
        line.skew(new uiPaperScope.Point((layerItem as Btwx.Text).textStyle.oblique, 0));
        line.point.x = absPointX;
        line.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
        line.leading = textContent.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointX(pointX);
    }
  }, [pointX]);

  useEffect(() => {
    if (rendered && prevPointY !== pointY && layerType === 'Text') {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      paperLayer.rotation = -layerItem.transform.rotation;
      const absPointY = pointY + artboardItem.frame.y;
      textContent.point.y = absPointY;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = line.fontSize;
        line.skew(new uiPaperScope.Point((layerItem as Btwx.Text).textStyle.oblique, 0));
        line.point.y = absPointY + (index * (layerItem as Btwx.Text).textStyle.leading);
        line.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
        line.leading = textContent.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointY(pointY);
    }
  }, [pointY]);

  useEffect(() => {
    if (rendered && prevX !== x && layerType !== 'Text') {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      setPrevX(x);
    }
  }, [x]);

  useEffect(() => {
    if (rendered && prevY !== y && layerType !== 'Text') {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      setPrevY(y);
    }
  }, [y]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== innerWidth && layerType !== 'Text') {
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
    if (rendered && prevInnerHeight !== innerHeight && layerType !== 'Text') {
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