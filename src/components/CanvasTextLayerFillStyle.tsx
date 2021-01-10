import React, { ReactElement, useEffect, useState } from 'react';

interface CanvasTextLayerFillStyleProps {
  id: string;
  layerItem: Btwx.Text;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
  applyFill(): void;
}

const CanvasTextLayerFillStyle = (props: CanvasTextLayerFillStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered, applyFill } = props;
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
      applyFill();
      setPrevText(text);
    }
  }, [text]);

  useEffect(() => {
    if (rendered && prevFontFamily !== fontFamily) {
      applyFill();
      setPrevFontFamily(fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== fontWeight) {
      applyFill();
      setPrevFontWeight(fontWeight);
    }
  }, [fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== fontSize) {
      applyFill();
      setPrevFontSize(fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== justification) {
      applyFill();
      setPrevJustification(justification);
    }
  }, [justification]);

  useEffect(() => {
    if (rendered && prevOblique !== oblique) {
      applyFill();
      setPrevOblique(oblique);
    }
  }, [oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== leading) {
      applyFill();
      setPrevLeading(leading);
    }
  }, [leading]);

  return (
    <></>
  );
}

export default CanvasTextLayerFillStyle;