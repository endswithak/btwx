import React, { ReactElement, useEffect, useState } from 'react';
import { getLayerTextContent, getTextAbsPoint } from '../store/utils/paper';
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
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevFontFamily, setPrevFontFamily] = useState(layerItem.textStyle.fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(layerItem.textStyle.fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(layerItem.textStyle.fontSize);
  const [prevJustification, setPrevJustification] = useState(layerItem.textStyle.justification);
  const [prevOblique, setPrevOblique] = useState(layerItem.textStyle.oblique);
  const [prevLeading, setPrevLeading] = useState(layerItem.textStyle.leading);
  const [prevLetterSpacing, setPrevLetterSpacing] = useState(layerItem.textStyle.letterSpacing);
  const [prevTextTransform, setPrevTextTransform] = useState(layerItem.textStyle.textTransform);

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperLayer = paperProject.getItem({data: {id: layerItem.id}}) as paper.Group;
    if (paperLayer) {
      const textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
      const textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      return {
        paperLayer,
        textLinesGroup,
        textBackground
      };
    } else {
      return {
        paperLayer: null,
        textLinesGroup: null,
        textBackground: null
      }
    }
  }

  useEffect(() => {
    if (rendered && prevFontFamily !== layerItem.textStyle.fontFamily) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
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
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontWeight = layerItem.textStyle.fontWeight;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontWeight(layerItem.textStyle.fontWeight);
    }
  }, [layerItem.textStyle.fontWeight]);

  useEffect(() => {
    if (rendered && prevLetterSpacing !== layerItem.textStyle.letterSpacing) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText, index) => {
        line.letterSpacing = layerItem.textStyle.letterSpacing;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevLetterSpacing(layerItem.textStyle.letterSpacing);
    }
  }, [layerItem.textStyle.letterSpacing]);

  useEffect(() => {
    if (rendered && prevTextTransform !== layerItem.textStyle.textTransform) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText, index) => {
        line.content = getLayerTextContent(layerItem.lines[index].text, layerItem.textStyle.textTransform);
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevTextTransform(layerItem.textStyle.textTransform);
    }
  }, [layerItem.textStyle.textTransform]);

  useEffect(() => {
    if (rendered && prevFontSize !== layerItem.textStyle.fontSize) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
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
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      const absTextPointX = getTextAbsPoint(layerItem.point, artboardItem.frame).x;
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new paperMain.Point(layerItem.textStyle.oblique, 0));
        line.justification = layerItem.textStyle.justification;
        line.point.x = absTextPointX;
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
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      paperLayer.pivot = textBackground.bounds.center;
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText, index) => {
        // leading affects horizontal skew
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new paperLayerScope.Point(prevOblique, 0));
        line.skew(new paperLayerScope.Point(-layerItem.textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      paperLayer.pivot = null;
      setPrevOblique(layerItem.textStyle.oblique);
    }
  }, [layerItem.textStyle.oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== layerItem.textStyle.leading) {
      const { paperLayer, textLinesGroup, textBackground } = getPaperLayer();
      const absTextPointY = getTextAbsPoint(layerItem.point, artboardItem.frame).y;
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = layerItem.textStyle.leading;
        line.point.y = absTextPointY + (index * layerItem.textStyle.leading);
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