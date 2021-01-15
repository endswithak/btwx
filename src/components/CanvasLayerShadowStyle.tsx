import React, { ReactElement, useEffect, useState } from 'react';
import { colorsMatch } from '../utils';
import { paperMain, paperPreview } from '../canvas';

export interface CanvasLayerShadowStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerShadowStyle = (props: CanvasLayerShadowStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const [prevShadowEnabled, setPrevShadowEnabled] = useState(layerItem.style.shadow.enabled);
  const [prevShadowFillType, setPrevShadowFillType] = useState(layerItem.style.shadow.fillType);
  const [prevShadowColor, setPrevShadowColor] = useState(layerItem.style.shadow.color);
  const [prevShadowBlur, setPrevShadowBlur] = useState(layerItem.style.shadow.blur);
  const [prevShadowOffsetX, setPrevShadowOffsetX] = useState(layerItem.style.shadow.offset.x);
  const [prevShadowOffsetY, setPrevShadowOffsetY] = useState(layerItem.style.shadow.offset.y);

  const getStyleLayer = (): paper.Item => {
    const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
    let paperLayer = paperProject.getItem({data: {id: layerItem.id}});
    if (paperLayer) {
      if (layerItem.type === 'Text') {
        paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
      }
      if (layerItem.type === 'Artboard') {
        paperLayer = paperLayer.getItem({data: {id: 'artboardBackground'}});
      }
    }
    return paperLayer;
  }

  const applyShadow = (): void => {
    const paperLayer = getStyleLayer();
    if (layerItem.style.shadow.enabled) {
      paperLayer.shadowColor = {
        hue: layerItem.style.shadow.color.h,
        saturation: layerItem.style.shadow.color.s,
        lightness: layerItem.style.shadow.color.l,
        alpha: layerItem.style.shadow.color.a
      } as paper.Color;
      paperLayer.shadowBlur = layerItem.style.shadow.blur;
      paperLayer.shadowOffset = new paperMain.Point(layerItem.style.shadow.offset.x, layerItem.style.shadow.offset.y);
    } else {
      paperLayer.shadowColor = null;
    }
  }

  useEffect(() => {
    if (rendered && prevShadowEnabled !== layerItem.style.shadow.enabled) {
      applyShadow();
      setPrevShadowEnabled(layerItem.style.shadow.enabled);
    }
  }, [layerItem.style.shadow.enabled]);

  useEffect(() => {
    if (rendered && prevShadowFillType !== layerItem.style.shadow.fillType) {
      applyShadow();
      setPrevShadowFillType(layerItem.style.shadow.fillType);
    }
  }, [layerItem.style.shadow.fillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevShadowColor, layerItem.style.shadow.color)) {
      applyShadow();
      setPrevShadowColor(layerItem.style.shadow.color);
    }
  }, [layerItem.style.shadow.color]);

  useEffect(() => {
    if (rendered && prevShadowBlur !== layerItem.style.shadow.blur) {
      applyShadow();
      setPrevShadowBlur(layerItem.style.shadow.blur);
    }
  }, [layerItem.style.shadow.blur]);

  useEffect(() => {
    if (rendered && prevShadowOffsetX !== layerItem.style.shadow.offset.x) {
      applyShadow();
      setPrevShadowOffsetX(layerItem.style.shadow.offset.x);
    }
  }, [layerItem.style.shadow.offset.x]);

  useEffect(() => {
    if (rendered && prevShadowOffsetY !== layerItem.style.shadow.offset.y) {
      applyShadow();
      setPrevShadowOffsetY(layerItem.style.shadow.offset.y);
    }
  }, [layerItem.style.shadow.offset.y]);

  return (
    <></>
  );
}

export default CanvasLayerShadowStyle;