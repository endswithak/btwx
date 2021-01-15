import React, { ReactElement, useEffect, useState } from 'react';
import paper from 'paper';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerFrameTextProps {
  layerItem: Btwx.Text;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerFrameText = (props: CanvasLayerFrameTextProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [prevPointX, setPrevPointX] = useState(layerItem.point.x);
  const [prevPointY, setPrevPointY] = useState(layerItem.point.y);

  const getTextPaperLayers = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textContent: paper.PointText;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    const paperLayer = paperProject.getItem({data: {id: layerItem.id}}) as paper.Group;
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
    if (rendered && prevPointX !== layerItem.point.x) {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      const absolutePointX = layerItem.point.x + artboardItem.frame.x;
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.point.x = absolutePointX;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new paper.Point(layerItem.textStyle.oblique, 0));
        line.point.x = absolutePointX;
        line.skew(new paper.Point(-layerItem.textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointX(layerItem.point.x);
    }
  }, [layerItem.point.x]);

  useEffect(() => {
    if (rendered && prevPointY !== layerItem.point.y) {
      const { paperLayer, textLinesGroup, textContent, textBackground} = getTextPaperLayers();
      const absolutePointY = layerItem.point.y + artboardItem.frame.y;
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.point.y = absolutePointY;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new paper.Point(layerItem.textStyle.oblique, 0));
        line.point.y = absolutePointY + (index * layerItem.textStyle.leading);
        line.skew(new paperLayerScope.Point(-layerItem.textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevPointY(layerItem.point.y);
    }
  }, [layerItem.point.y]);

  return (
    <></>
  );
}

export default CanvasLayerFrameText;