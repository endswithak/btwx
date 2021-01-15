import React, { ReactElement, useEffect, useState } from 'react';

interface CanvasTextLayerFillStyleProps {
  layerItem: Btwx.Text;
  rendered: boolean;
  applyFill(): void;
}

const CanvasTextLayerFillStyle = (props: CanvasTextLayerFillStyleProps): ReactElement => {
  const { rendered, layerItem, applyFill } = props;
  const [prevText, setPrevText] = useState(layerItem.text);
  const [prevFontFamily, setPrevFontFamily] = useState(layerItem.textStyle.fontFamily);
  const [prevFontWeight, setPrevFontWeight] = useState(layerItem.textStyle.fontWeight);
  const [prevFontSize, setPrevFontSize] = useState(layerItem.textStyle.fontSize);
  const [prevJustification, setPrevJustification] = useState(layerItem.textStyle.justification);
  const [prevOblique, setPrevOblique] = useState(layerItem.textStyle.oblique);
  const [prevLeading, setPrevLeading] = useState(layerItem.textStyle.leading);

  useEffect(() => {
    if (rendered && prevText !== layerItem.text) {
      applyFill();
      setPrevText(layerItem.text);
    }
  }, [layerItem.text]);

  useEffect(() => {
    if (rendered && prevFontFamily !== layerItem.textStyle.fontFamily) {
      applyFill();
      setPrevFontFamily(layerItem.textStyle.fontFamily);
    }
  }, [layerItem.textStyle.fontFamily]);

  useEffect(() => {
    if (rendered && prevFontWeight !== layerItem.textStyle.fontWeight) {
      applyFill();
      setPrevFontWeight(layerItem.textStyle.fontWeight);
    }
  }, [layerItem.textStyle.fontWeight]);

  useEffect(() => {
    if (rendered && prevFontSize !== layerItem.textStyle.fontSize) {
      applyFill();
      setPrevFontSize(layerItem.textStyle.fontSize);
    }
  }, [layerItem.textStyle.fontSize]);

  useEffect(() => {
    if (rendered && prevJustification !== layerItem.textStyle.justification) {
      applyFill();
      setPrevJustification(layerItem.textStyle.justification);
    }
  }, [layerItem.textStyle.justification]);

  useEffect(() => {
    if (rendered && prevOblique !== layerItem.textStyle.oblique) {
      applyFill();
      setPrevOblique(layerItem.textStyle.oblique);
    }
  }, [layerItem.textStyle.oblique]);

  useEffect(() => {
    if (rendered && prevLeading !== layerItem.textStyle.leading) {
      applyFill();
      setPrevLeading(layerItem.textStyle.leading);
    }
  }, [layerItem.textStyle.leading]);

  return (
    <></>
  );
}

export default CanvasTextLayerFillStyle;