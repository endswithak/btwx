import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperStrokeColor } from '../store/utils/paper';
import { colorsMatch, gradientStopsMatch } from '../utils';
import { paperMain, paperPreview } from '../canvas';
import CanvasTextLayerStrokeStyle from './CanvasTextLayerStrokeStyle';

export interface CanvasLayerStrokeStyleProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  paperScope: Btwx.PaperScope;
  rendered: boolean;
  projectIndex: number;
}

const CanvasLayerStrokeStyle = (props: CanvasLayerStrokeStyleProps): ReactElement => {
  const { paperScope, rendered, layerItem, parentItem, projectIndex, artboardItem } = props;
  const isText = layerItem ? layerItem.type === 'Text' : false;
  const isShape = layerItem ? layerItem.type === 'Shape' : false;
  const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
  const [prevInnerWidth, setPrevInnerWidth] = useState(layerItem.frame.innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(layerItem.frame.innerHeight);
  const [prevRotation, setPrevRotation] = useState(layerItem.transform.rotation);
  const [prevStrokeEnabled, setPrevStrokeEnabled] = useState(layerItem.style.stroke.enabled);
  const [prevStrokeFillType, setPrevStrokeFillType] = useState(layerItem.style.stroke.fillType);
  const [prevStrokeColor, setPrevStrokeColor] = useState(layerItem.style.stroke.color);
  const [prevStrokeGradientType, setPrevStrokeGradientType] = useState(layerItem.style.stroke.gradient.gradientType);
  const [prevStrokeGradientOriginX, setPrevStrokeGradientOriginX] = useState(layerItem.style.stroke.gradient.origin.x);
  const [prevStrokeGradientOriginY, setPrevStrokeGradientOriginY] = useState(layerItem.style.stroke.gradient.origin.y);
  const [prevStrokeGradientDestinationX, setPrevStrokeGradientDestinationX] = useState(layerItem.style.stroke.gradient.destination.x);
  const [prevStrokeGradientDestinationY, setPrevStrokeGradientDestinationY] = useState(layerItem.style.stroke.gradient.destination.y);
  const [prevStrokeGradientStops, setPrevStrokeGradientStops] = useState(layerItem.style.stroke.gradient.stops);
  const [prevStrokeWidth, setPrevStrokeWidth] = useState(layerItem.style.stroke.width);

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

  const applyStroke = (): void => {
    const paperLayer = getStyleLayer();
    paperLayer.strokeColor = getPaperStrokeColor({
      stroke: layerItem.style.stroke,
      layerFrame: layerItem.frame,
      artboardFrame: layerItem.type !== 'Artboard' ? artboardItem.frame : null,
      isLine
    });
  }

  useEffect(() => {
    if (rendered && prevRotation !== layerItem.transform.rotation) {
      applyStroke();
      setPrevRotation(layerItem.transform.rotation);
    }
  }, [layerItem.transform.rotation]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== layerItem.frame.innerWidth) {
      applyStroke();
      setPrevInnerWidth(layerItem.frame.innerWidth);
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered && prevInnerHeight !== layerItem.frame.innerHeight) {
      applyStroke();
      setPrevInnerHeight(layerItem.frame.innerHeight);
    }
  }, [layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered && prevStrokeEnabled !== layerItem.style.stroke.enabled) {
      applyStroke();
      setPrevStrokeEnabled(layerItem.style.stroke.enabled);
    }
  }, [layerItem.style.stroke.enabled]);

  useEffect(() => {
    if (rendered && prevStrokeFillType !== layerItem.style.stroke.fillType) {
      applyStroke();
      setPrevStrokeFillType(layerItem.style.stroke.fillType);
    }
  }, [layerItem.style.stroke.fillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevStrokeColor, layerItem.style.stroke.color)) {
      applyStroke();
      setPrevStrokeColor(layerItem.style.stroke.color);
    }
  }, [layerItem.style.stroke.color]);

  useEffect(() => {
    if (rendered && prevStrokeGradientType !== layerItem.style.stroke.gradient.gradientType) {
      applyStroke();
      setPrevStrokeGradientType(layerItem.style.stroke.gradient.gradientType);
    }
  }, [layerItem.style.stroke.gradient.gradientType]);

  useEffect(() => {
    if (rendered && prevStrokeGradientOriginX !== layerItem.style.stroke.gradient.origin.x) {
      applyStroke();
      setPrevStrokeGradientOriginX(layerItem.style.stroke.gradient.origin.x);
    }
  }, [layerItem.style.stroke.gradient.origin.x]);

  useEffect(() => {
    if (rendered && prevStrokeGradientOriginY !== layerItem.style.stroke.gradient.origin.y) {
      applyStroke();
      setPrevStrokeGradientOriginY(layerItem.style.stroke.gradient.origin.y);
    }
  }, [layerItem.style.stroke.gradient.origin.y]);

  useEffect(() => {
    if (rendered && prevStrokeGradientDestinationX !== layerItem.style.stroke.gradient.destination.x) {
      applyStroke();
      setPrevStrokeGradientDestinationX(layerItem.style.stroke.gradient.destination.x);
    }
  }, [layerItem.style.stroke.gradient.destination.x]);

  useEffect(() => {
    if (rendered && prevStrokeGradientDestinationY !== layerItem.style.stroke.gradient.destination.y) {
      applyStroke();
      setPrevStrokeGradientDestinationY(layerItem.style.stroke.gradient.destination.y);
    }
  }, [layerItem.style.stroke.gradient.destination.y]);

  useEffect(() => {
    if (rendered && !gradientStopsMatch(layerItem.style.stroke.gradient.stops, prevStrokeGradientStops)) {
      applyStroke();
      setPrevStrokeGradientStops(layerItem.style.stroke.gradient.stops);
    }
  }, [layerItem.style.stroke.gradient.stops]);

  useEffect(() => {
    if (rendered && prevStrokeWidth !== layerItem.style.stroke.width) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeWidth = layerItem.style.stroke.width;
      setPrevStrokeWidth(layerItem.style.stroke.width);
    }
  }, [layerItem.style.stroke.width]);

  return (
    <>
      {
        isText
        ? <CanvasTextLayerStrokeStyle
            rendered={rendered}
            layerItem={layerItem as Btwx.Text}
            applyStroke={applyStroke} />
        : null
      }
    </>
  );
}

export default CanvasLayerStrokeStyle;