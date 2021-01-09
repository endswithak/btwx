import React, { ReactElement, useEffect, useState } from 'react';
import { colorsMatch } from '../utils';
import { uiPaperScope } from '../canvas';

interface CanvasLayerShadowStyleProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerShadowStyle = (props: CanvasLayerShadowStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const layerType = layerItem ? layerItem.type : null;
  const shadowEnabled = layerItem ? layerItem.style.shadow.enabled : null;
  const shadowFillType = layerItem ? layerItem.style.shadow.fillType : null;
  const shadowColor = layerItem ? layerItem.style.shadow.color : null;
  const shadowBlur = layerItem ? layerItem.style.shadow.blur : null;
  const shadowOffsetX = layerItem ? layerItem.style.shadow.offset.x : null;
  const shadowOffsetY = layerItem ? layerItem.style.shadow.offset.y : null;
  const [prevShadowEnabled, setPrevShadowEnabled] = useState(shadowEnabled);
  const [prevShadowFillType, setPrevShadowFillType] = useState(shadowFillType);
  const [prevShadowColor, setPrevShadowColor] = useState(shadowColor);
  const [prevShadowBlur, setPrevShadowBlur] = useState(shadowBlur);
  const [prevShadowOffsetX, setPrevShadowOffsetX] = useState(shadowOffsetX);
  const [prevShadowOffsetY, setPrevShadowOffsetY] = useState(shadowOffsetY);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (paperLayer) {
      if (layerType === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerType === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  const applyShadow = () => {
    const paperLayer = getStyleLayer();
    if (shadowEnabled) {
      paperLayer.shadowColor = {
        hue: shadowColor.h,
        saturation: shadowColor.s,
        lightness: shadowColor.l,
        alpha: shadowColor.a
      } as paper.Color;
      paperLayer.shadowBlur = shadowBlur;
      paperLayer.shadowOffset = new uiPaperScope.Point(shadowOffsetX, shadowOffsetY);
    } else {
      paperLayer.shadowColor = null;
    }
  }

  useEffect(() => {
    if (rendered && prevShadowEnabled !== shadowEnabled) {
      applyShadow();
      setPrevShadowEnabled(shadowEnabled);
    }
  }, [shadowEnabled]);

  useEffect(() => {
    if (rendered && prevShadowFillType !== shadowFillType) {
      applyShadow();
      setPrevShadowFillType(shadowFillType);
    }
  }, [shadowFillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevShadowColor, shadowColor)) {
      applyShadow();
      setPrevShadowColor(shadowColor);
    }
  }, [shadowColor]);

  useEffect(() => {
    if (rendered && prevShadowBlur !== shadowBlur) {
      applyShadow();
      setPrevShadowBlur(shadowBlur);
    }
  }, [shadowBlur]);

  useEffect(() => {
    if (rendered && prevShadowOffsetX !== shadowOffsetX) {
      applyShadow();
      setPrevShadowOffsetX(shadowOffsetX);
    }
  }, [shadowOffsetX]);

  useEffect(() => {
    if (rendered && prevShadowOffsetY !== shadowOffsetY) {
      applyShadow();
      setPrevShadowOffsetY(shadowOffsetY);
    }
  }, [shadowOffsetY]);

  return (
    <></>
  );
}

export default CanvasLayerShadowStyle;