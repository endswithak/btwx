import React, { ReactElement, useEffect, useState } from 'react';

interface CanvasTextLayerStrokeStyleProps {
  id: string;
  layerItem: Btwx.Text;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  applyStroke(): void;
}

const CanvasTextLayerStrokeStyle = (props: CanvasTextLayerStrokeStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered, applyStroke } = props;
  const text = layerItem ? layerItem.text : null;
  const fontFamily = layerItem ? layerItem.textStyle.fontFamily : null;
  const fontWeight = layerItem ? layerItem.textStyle.fontWeight : null;
  const fontSize = layerItem ? layerItem.textStyle.fontSize : null;
  const justification = layerItem ? layerItem.textStyle.justification : null;
  const oblique = layerItem ? layerItem.textStyle.oblique : null;
  const leading = layerItem ? layerItem.textStyle.leading : null;
  const [prevText, setPrevText] = useState(text);
  const [prevFontFamily, setPrevFontFamily] = useState(fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(fontSize);
  const [prevJustification, setPrevJustification] = useState(justification);
  const [prevOblique, setPrevOblique] = useState(oblique);
  const [prevLeading, setPrevLeading] = useState(leading);

  useEffect(() => {
    if (rendered && prevText !== text) {
      applyStroke();
      setPrevText(text);
    }
  }, [text]);

  useEffect(() => {
    if (rendered && prevFontFamily !== fontFamily) {
      applyStroke();
      setPrevFontFamily(fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== fontWeight) {
      applyStroke();
      setPrevFontWeight(fontWeight);
    }
  }, [fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== fontSize) {
      applyStroke();
      setPrevFontSize(fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== justification) {
      applyStroke();
      setPrevJustification(justification);
    }
  }, [justification]);

  useEffect(() => {
    if (rendered && prevOblique !== oblique) {
      applyStroke();
      setPrevOblique(oblique);
    }
  }, [oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== leading) {
      applyStroke();
      setPrevLeading(leading);
    }
  }, [leading]);

  return (
    <></>
  );
}

export default CanvasTextLayerStrokeStyle;