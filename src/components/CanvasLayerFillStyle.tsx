import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperFillColor } from '../store/utils/paper';
import { colorsMatch, gradientStopsMatch } from '../utils';
import { paperMain, paperPreview } from '../canvas';
import CanvasTextLayerFillStyle from './CanvasTextLayerFillStyle';

export interface CanvasLayerFillStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerFillStyle = (props: CanvasLayerFillStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const isText = layerItem ? layerItem.type === 'Text' : false;
  const isShape = layerItem ? layerItem.type === 'Shape' : false;
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  const [prevInnerWidth, setPrevInnerWidth] = useState(layerItem.frame.innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(layerItem.frame.innerHeight);
  const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);
  const [prevFillEnabled, setPrevFillEnabled] = useState(layerItem.style.fill.enabled);
  const [prevFillType, setPrevFillType] = useState(layerItem.style.fill.fillType);
  const [prevFillColor, setPrevFillColor] = useState(layerItem.style.fill.color);
  const [prevFillGradientType, setPrevFillGradientType] = useState(layerItem.style.fill.gradient.gradientType);
  const [prevFillGradientOriginX, setPrevFillGradientOriginX] = useState(layerItem.style.fill.gradient.origin.x);
  const [prevFillGradientOriginY, setPrevFillGradientOriginY] = useState(layerItem.style.fill.gradient.origin.y);
  const [prevFillGradientDestinationX, setPrevFillGradientDestinationX] = useState(layerItem.style.fill.gradient.destination.x);
  const [prevFillGradientDestinationY, setPrevFillGradientDestinationY] = useState(layerItem.style.fill.gradient.destination.y);
  const [prevFillGradientStops, setPrevFillGradientStops] = useState(layerItem.style.fill.gradient.stops);

  const getStyleLayer = (): paper.Item => {
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

  const applyFill = (): void => {
    const paperLayer = getStyleLayer();
    paperLayer.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      layerFrame: layerItem.frame,
      artboardFrame: layerItem.type !== 'Artboard' ? artboardItem.frame : null,
      isLine
    });
  }

  useEffect(() => {
    if (rendered && prevRotation !== layerItem.transform.rotation) {
      applyFill();
      setPrevRotation(layerItem.transform.rotation);
    }
  }, [layerItem.transform.rotation]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== layerItem.frame.innerWidth) {
      applyFill();
      setPrevInnerWidth(layerItem.frame.innerWidth);
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered && prevInnerHeight !== layerItem.frame.innerHeight) {
      applyFill();
      setPrevInnerHeight(layerItem.frame.innerHeight);
    }
  }, [layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered && prevFillEnabled !== layerItem.style.fill.enabled) {
      applyFill();
      setPrevFillEnabled(layerItem.style.fill.enabled);
    }
  }, [layerItem.style.fill.enabled]);

  useEffect(() => {
    if (rendered && prevFillType !== layerItem.style.fill.fillType) {
      applyFill();
      setPrevFillType(layerItem.style.fill.fillType);
    }
  }, [layerItem.style.fill.fillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevFillColor, layerItem.style.fill.color)) {
      applyFill();
      setPrevFillColor(layerItem.style.fill.color);
    }
  }, [layerItem.style.fill.color]);

  useEffect(() => {
    if (rendered && prevFillGradientType !== layerItem.style.fill.gradient.gradientType) {
      applyFill();
      setPrevFillGradientType(layerItem.style.fill.gradient.gradientType);
    }
  }, [layerItem.style.fill.gradient.gradientType]);

  useEffect(() => {
    if (rendered && prevFillGradientOriginX !== layerItem.style.fill.gradient.origin.x) {
      applyFill();
      setPrevFillGradientOriginX(layerItem.style.fill.gradient.origin.x);
    }
  }, [layerItem.style.fill.gradient.origin.x]);

  useEffect(() => {
    if (rendered && prevFillGradientOriginY !== layerItem.style.fill.gradient.origin.y) {
      applyFill();
      setPrevFillGradientOriginY(layerItem.style.fill.gradient.origin.y);
    }
  }, [layerItem.style.fill.gradient.origin.y]);

  useEffect(() => {
    if (rendered && prevFillGradientDestinationX !== layerItem.style.fill.gradient.destination.x) {
      applyFill();
      setPrevFillGradientDestinationX(layerItem.style.fill.gradient.destination.x);
    }
  }, [layerItem.style.fill.gradient.destination.x]);

  useEffect(() => {
    if (rendered && prevFillGradientDestinationY !== layerItem.style.fill.gradient.destination.y) {
      applyFill();
      setPrevFillGradientDestinationY(layerItem.style.fill.gradient.destination.y);
    }
  }, [layerItem.style.fill.gradient.destination.y]);

  useEffect(() => {
    if (rendered && !gradientStopsMatch(layerItem.style.fill.gradient.stops, prevFillGradientStops)) {
      applyFill();
      setPrevFillGradientStops(layerItem.style.fill.gradient.stops);
    }
  }, [layerItem.style.fill.gradient.stops]);

  return (
    <>
      {
        isText
        ? <CanvasTextLayerFillStyle
            rendered={rendered}
            layerItem={layerItem as Btwx.Text}
            applyFill={applyFill} />
        : null
      }
    </>
  );
}

export default CanvasLayerFillStyle;