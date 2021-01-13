import React, { ReactElement, useEffect, useState } from 'react';
import { uiPaperScope } from '../canvas';

interface CanvasLayerTextStyleProps {
  id: string;
  layerItem: Btwx.Text;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerTextStyle = (props: CanvasLayerTextStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const projectIndex = layerItem ? artboardItem.projectIndex : null;
  const fontFamily = layerItem ? layerItem.textStyle.fontFamily : null;
  const fontWeight = layerItem ? layerItem.textStyle.fontWeight : null;
  const fontSize = layerItem ? layerItem.textStyle.fontSize : null;
  const justification = layerItem ? layerItem.textStyle.justification : null;
  const oblique = layerItem ? layerItem.textStyle.oblique : null;
  const leading = layerItem ? layerItem.textStyle.leading : null;
  const [prevFontFamily, setPrevFontFamily] = useState(fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(fontSize);
  const [prevJustification, setPrevJustification] = useState(justification);
  const [prevOblique, setPrevOblique] = useState(oblique);
  const [prevLeading, setPrevLeading] = useState(leading);

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    textLinesGroup: paper.Group;
    textContent: paper.PointText;
    textBackground: paper.Path.Rectangle;
  } => {
    const paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}}) as paper.Group;
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
    if (rendered && prevFontFamily !== fontFamily) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontFamily = fontFamily;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontFamily = fontFamily;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontFamily(fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== fontWeight) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontWeight = fontWeight;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontWeight = fontWeight;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontWeight(fontWeight);
    }
  }, [fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== fontSize) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.fontSize = fontSize;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.fontSize = fontSize;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevFontSize(fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== justification) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.justification = justification;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        line.leading = layerItem.textStyle.fontSize;
        line.justification = justification;
        line.point.x = textContent.point.x;
        line.skew(new uiPaperScope.Point(-(layerItem as Btwx.Text).textStyle.oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevJustification(justification);
    }
  }, [justification]);

  useEffect(() => {
    if (rendered && prevOblique !== oblique) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textLinesGroup.children.forEach((line: paper.PointText) => {
        // leading affects horizontal skew
        line.leading = layerItem.textStyle.fontSize;
        line.skew(new uiPaperScope.Point(prevOblique, 0));
        line.skew(new uiPaperScope.Point(-oblique, 0));
        line.leading = layerItem.textStyle.leading;
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevOblique(oblique);
    }
  }, [oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== leading) {
      const { paperLayer, textLinesGroup, textContent, textBackground } = getPaperLayer();
      paperLayer.rotation = -layerItem.transform.rotation;
      textContent.leading = leading;
      textLinesGroup.children.forEach((line: paper.PointText, index: number) => {
        line.leading = leading;
        line.point.y = textContent.point.y + (index * leading);
      });
      textBackground.bounds = textLinesGroup.bounds;
      paperLayer.rotation = layerItem.transform.rotation;
      setPrevLeading(leading);
    }
  }, [leading]);

  return (
    <></>
  );
}

export default CanvasLayerTextStyle;