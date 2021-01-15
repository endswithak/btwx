import React, { ReactElement, useEffect, useState } from 'react';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerTextStyleProps {
  layerItem: Btwx.Text;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerTextStyle = (props: CanvasLayerTextStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [prevFontFamily, setPrevFontFamily] = useState(layerItem.textStyle.fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(layerItem.textStyle.fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(layerItem.textStyle.fontSize);
  const [prevJustification, setPrevJustification] = useState(layerItem.textStyle.justification);
  const [prevOblique, setPrevOblique] = useState(layerItem.textStyle.oblique);
  const [prevLeading, setPrevLeading] = useState(layerItem.textStyle.leading);

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textContent: paper.PointText;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    const paperLayer = paperProject.getItem({data: {id: layerItem.id}}) as paper.Group;
    if (paperLayer) {
      const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
      const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
      const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      return {
        paperLayer,
        textLinesGroup,
        textContent,
        textBackground
      };
    } else {
      return {
        paperLayer: null,
        textLinesGroup: null,
        textContent: null,
        textBackground: null
      }
    }
  }

  useEffect(() => {
    if (rendered && prevFontFamily !== layerItem.textStyle.fontFamily) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontFamily = layerItem.textStyle.fontFamily;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontFamily = layerItem.textStyle.fontFamily;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontFamily(layerItem.textStyle.fontFamily);
    }
  }, [layerItem.textStyle.fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== layerItem.textStyle.fontWeight) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontWeight = layerItem.textStyle.fontWeight;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontWeight = layerItem.textStyle.fontWeight;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontWeight(layerItem.textStyle.fontWeight);
    }
  }, [layerItem.textStyle.fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== layerItem.textStyle.fontSize) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontSize = layerItem.textStyle.fontSize;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontSize = layerItem.textStyle.fontSize;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontSize(layerItem.textStyle.fontSize);
    }
  }, [layerItem.textStyle.fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== layerItem.textStyle.justification) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.justification = layerItem.textStyle.justification;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = layerItem.textStyle.fontSize;
        line.justification = layerItem.textStyle.justification;
        line.point.x = textContent.point.x;
        line.skew(new paperMain.Point(-layerItem.textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevJustification(layerItem.textStyle.justification);
    }
  }, [layerItem.textStyle.justification]);

  useEffect(() => {
    if (rendered && prevOblique !== layerItem.textStyle.oblique) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        // leading affects horizontal skew
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new paperLayerScope.Point(prevOblique, 0));
        line.skew(new paperLayerScope.Point(-layerItem.textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevOblique(layerItem.textStyle.oblique);
    }
  }, [layerItem.textStyle.oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== layerItem.textStyle.leading) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.leading = layerItem.textStyle.leading;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = layerItem.textStyle.leading;
        line.point.y = textContent.point.y + (index * layerItem.textStyle.leading);
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevLeading(layerItem.textStyle.leading);
    }
  }, [layerItem.textStyle.leading]);

  return (
    <></>
  );
}

export default CanvasLayerTextStyle;