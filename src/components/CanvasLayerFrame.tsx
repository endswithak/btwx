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
  const isShape = layerItem && layerItem.type === 'Shape';
  const isText = layerItem && layerItem.type === 'Text';
  const isMask = isShape && (layerItem as Btwx.Shape).mask;
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  const pointX = isText ? (layerItem as Btwx.Text).point.x : null;
  const pointY = isText ? (layerItem as Btwx.Text).point.y : null;
  const fromX = isLine ? (layerItem as Btwx.Line).from.x : null;
  const fromY = isLine ? (layerItem as Btwx.Line).from.y : null;
  const toX = isLine ? (layerItem as Btwx.Line).to.x : null;
  const toY = isLine ? (layerItem as Btwx.Line).to.y : null;
  const [prevX, setPrevX] = useState(x);
  const [prevY, setPrevY] = useState(y);
  const [prevInnerWidth, setPrevInnerWidth] = useState(innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(innerHeight);
  const [prevPointX, setPrevPointX] = useState(pointX);
  const [prevPointY, setPrevPointY] = useState(pointY);
  const [prevFromX, setPrevFromX] = useState(fromX);
  const [prevFromY, setPrevFromY] = useState(fromY);
  const [prevToX, setPrevToX] = useState(toX);
  const [prevToY, setPrevToY] = useState(toY);

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

  ////////////////////////////
  // handle line from position
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevFromX !== fromX && isLine) {
      const paperLayer = getPaperLayer() as paper.Path;
      const paperFromX = artboardItem.frame.x + fromX;
      paperLayer.firstSegment.point.x = paperFromX;
      setPrevFromX(fromX);
    }
  }, [fromX]);

  useEffect(() => {
    if (rendered && prevFromY !== fromY && isLine) {
      const paperLayer = getPaperLayer() as paper.Path;
      const paperFromY = artboardItem.frame.y + fromY;
      paperLayer.firstSegment.point.y = paperFromY;
      setPrevFromY(fromY);
    }
  }, [fromY]);

  ////////////////////////////
  // handle line to position
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevToX !== toX && isLine) {
      const paperLayer = getPaperLayer() as paper.Path;
      const paperToX = artboardItem.frame.x + toX;
      paperLayer.lastSegment.point.x = paperToX;
      setPrevToX(toX);
    }
  }, [toX]);

  useEffect(() => {
    if (rendered && prevToY !== toY && isLine) {
      const paperLayer = getPaperLayer() as paper.Path;
      const paperToY = artboardItem.frame.y + toY;
      paperLayer.lastSegment.point.y = paperToY;
      setPrevToY(toY);
    }
  }, [toY]);

  ////////////////////////////
  // handle text position
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevPointX !== pointX && isText) {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      paperLayer.rotation = -layerItem.transform.rotation;
      const absPointX = pointX + artboardItem.frame.x;
      textContent.point.x = absPointX;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = (layerItem as Btwx.Text).textStyle.fontSize;
        line.skew(new uiPaperScope.Point((layerItem as Btwx.Text).textStyle.oblique, 0));
        line.point.x = absPointX;
        line.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
        line.leading = (layerItem as Btwx.Text).textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointX(pointX);
    }
  }, [pointX]);

  useEffect(() => {
    if (rendered && prevPointY !== pointY && isText) {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      paperLayer.rotation = -layerItem.transform.rotation;
      const absPointY = pointY + artboardItem.frame.y;
      textContent.point.y = absPointY;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = (layerItem as Btwx.Text).textStyle.fontSize;
        line.skew(new uiPaperScope.Point((layerItem as Btwx.Text).textStyle.oblique, 0));
        line.point.y = absPointY + (index * (layerItem as Btwx.Text).textStyle.leading);
        line.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
        line.leading = (layerItem as Btwx.Text).textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointY(pointY);
    }
  }, [pointY]);

  ////////////////////////////
  // handle rest of positions
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevX !== x && !isText && !isLine) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      if (isMask) {
        const maskGroup = paperLayer.parent;
        const mask = maskGroup.children[0];
        mask.position = paperLayer.position;
      }
      setPrevX(x);
    }
  }, [x]);

  useEffect(() => {
    if (rendered && prevY !== y && !isText && !isLine) {
      const paperLayer = getPaperLayer();
      paperLayer.position = getLayerAbsPosition(layerItem.frame, layerType === 'Artboard' ? null : artboardItem.frame);
      if (isMask) {
        const maskGroup = paperLayer.parent;
        const mask = maskGroup.children[0];
        mask.position = paperLayer.position;
      }
      setPrevY(y);
    }
  }, [y]);

  ////////////////////////////
  // handle width
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevInnerWidth !== innerWidth && !isText && !isShape) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerType) {
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

  ////////////////////////////
  // handle height
  ////////////////////////////

  useEffect(() => {
    if (rendered && prevInnerHeight !== innerHeight && !isText && !isShape) {
      const paperLayer = getPaperLayer();
      const startPosition = paperLayer.position;
      switch(layerType) {
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