import React, { ReactElement, useEffect, useState } from 'react';

interface CanvasTextLayerStrokeStyleProps {
  layerItem: Btwx.Text;
  rendered: boolean;
  applyStroke(): void;
}

const CanvasTextLayerStrokeStyle = (props: CanvasTextLayerStrokeStyleProps): ReactElement => {
  const { rendered, layerItem, applyStroke } = props;
  const [prevText, setPrevText] = useState(layerItem.text);
  const [prevFontFamily, setPrevFontFamily] = useState(layerItem.textStyle.fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(layerItem.textStyle.fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(layerItem.textStyle.fontSize);
  const [prevJustification, setPrevJustification] = useState(layerItem.textStyle.justification);
  const [prevOblique, setPrevOblique] = useState(layerItem.textStyle.oblique);
  const [prevLeading, setPrevLeading] = useState(layerItem.textStyle.leading);

  useEffect(() => {
    if (rendered && prevText !== layerItem.text) {
      applyStroke();
      setPrevText(layerItem.text);
    }
  }, [layerItem.text]);

  useEffect(() => {
    if (rendered && prevFontFamily !== layerItem.textStyle.fontFamily) {
      applyStroke();
      setPrevFontFamily(layerItem.textStyle.fontFamily);
    }
  }, [layerItem.textStyle.fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== layerItem.textStyle.fontWeight) {
      applyStroke();
      setPrevFontWeight(layerItem.textStyle.fontWeight);
    }
  }, [layerItem.textStyle.fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== layerItem.textStyle.fontSize) {
      applyStroke();
      setPrevFontSize(layerItem.textStyle.fontSize);
    }
  }, [layerItem.textStyle.fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== layerItem.textStyle.justification) {
      applyStroke();
      setPrevJustification(layerItem.textStyle.justification);
    }
  }, [layerItem.textStyle.justification]);

  useEffect(() => {
    if (rendered && prevOblique !== layerItem.textStyle.oblique) {
      applyStroke();
      setPrevOblique(layerItem.textStyle.oblique);
    }
  }, [layerItem.textStyle.oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== layerItem.textStyle.leading) {
      applyStroke();
      setPrevLeading(layerItem.textStyle.leading);
    }
  }, [layerItem.textStyle.leading]);

  return (
    <></>
  );
}

export default CanvasTextLayerStrokeStyle;