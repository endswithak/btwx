import React, { ReactElement, useEffect, useState } from 'react';
import { colorsMatch, gradientStopsMatch } from '../utils';
import { uiPaperScope } from '../canvas';

interface CanvasLayerStrokeStyleProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerStrokeStyle = (props: CanvasLayerStrokeStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const isLine = layerItem ? layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const artboardFrame = artboardItem ? artboardItem.frame : null;
  const strokeEnabled = layerItem ? layerItem.style.stroke.enabled : null;
  const strokeFillType = layerItem ? layerItem.style.stroke.fillType : null;
  const strokeColor = layerItem ? layerItem.style.stroke.color : null;
  const strokeGradientType = layerItem ? layerItem.style.stroke.gradient.gradientType : null;
  const strokeGradientOriginX = layerItem ? layerItem.style.stroke.gradient.origin.x : null;
  const strokeGradientOriginY = layerItem ? layerItem.style.stroke.gradient.origin.y : null;
  const strokeGradientDestinationX = layerItem ? layerItem.style.stroke.gradient.destination.x : null;
  const strokeGradientDestinationY = layerItem ? layerItem.style.stroke.gradient.destination.y : null;
  const strokeGradientStops = layerItem ? layerItem.style.stroke.gradient.stops : null;
  const strokeWidth = layerItem ? layerItem.style.stroke.width : null;
  const [prevStrokeEnabled, setPrevStrokeEnabled] = useState(strokeEnabled);
  const [prevStrokeFillType, setPrevStrokeFillType] = useState(strokeFillType);
  const [prevStrokeColor, setPrevStrokeColor] = useState(strokeColor);
  const [prevStrokeGradientType, setPrevStrokeGradientType] = useState(strokeGradientType);
  const [prevStrokeGradientOriginX, setPrevStrokeGradientOriginX] = useState(strokeGradientOriginX);
  const [prevStrokeGradientOriginY, setPrevStrokeGradientOriginY] = useState(strokeGradientOriginY);
  const [prevStrokeGradientDestinationX, setPrevStrokeGradientDestinationX] = useState(strokeGradientDestinationX);
  const [prevStrokeGradientDestinationY, setPrevStrokeGradientDestinationY] = useState(strokeGradientDestinationY);
  const [prevStrokeGradientStops, setPrevStrokeGradientStops] = useState(strokeGradientStops);
  const [prevStrokeWidth, setPrevStrokeWidth] = useState(strokeWidth);

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

  const applyStroke = () => {
    const paperLayer = getStyleLayer();
    if (strokeEnabled) {
      const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
      const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
      const layerAbsPosition = layerPosition.add(artboardPosition);
      switch(strokeFillType) {
        case 'color':
          paperLayer.strokeColor = {
            hue: strokeColor.h,
            saturation: strokeColor.s,
            lightness: strokeColor.l,
            alpha: strokeColor.a
          } as paper.Color;
          break;
        case 'gradient':
          paperLayer.strokeColor  = {
            gradient: {
              stops: strokeGradientStops.reduce((result, current) => {
                result = [
                  ...result,
                  new uiPaperScope.GradientStop({
                    hue: current.color.h,
                    saturation: current.color.s,
                    lightness: current.color.l,
                    alpha: current.color.a
                  } as paper.Color, current.position)
                ];
                return result;
              }, []) as paper.GradientStop[],
              radial: strokeGradientType === 'radial'
            },
            origin: new uiPaperScope.Point(
              (strokeGradientOriginX * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
              (strokeGradientOriginY * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
            ),
            destination: new uiPaperScope.Point(
              (strokeGradientDestinationX * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
              (strokeGradientDestinationY * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
            )
          } as Btwx.PaperGradientFill;
          break;
      }
    } else {
      paperLayer.strokeColor = null;
    }
  }

  useEffect(() => {
    if (rendered && prevStrokeEnabled !== strokeEnabled) {
      applyStroke();
      setPrevStrokeEnabled(strokeEnabled);
    }
  }, [strokeEnabled]);

  useEffect(() => {
    if (rendered && prevStrokeFillType !== strokeFillType) {
      applyStroke();
      setPrevStrokeFillType(strokeFillType);
    }
  }, [strokeFillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevStrokeColor, strokeColor)) {
      applyStroke();
      setPrevStrokeColor(strokeColor);
    }
  }, [strokeColor]);

  useEffect(() => {
    if (rendered && prevStrokeGradientType !== strokeGradientType) {
      applyStroke();
      setPrevStrokeGradientType(strokeGradientType);
    }
  }, [strokeGradientType]);

  useEffect(() => {
    if (rendered && prevStrokeGradientOriginX !== strokeGradientOriginX) {
      applyStroke();
      setPrevStrokeGradientOriginX(strokeGradientOriginX);
    }
  }, [strokeGradientOriginX]);

  useEffect(() => {
    if (rendered && prevStrokeGradientOriginY !== strokeGradientOriginY) {
      applyStroke();
      setPrevStrokeGradientOriginY(strokeGradientOriginY);
    }
  }, [strokeGradientOriginY]);

  useEffect(() => {
    if (rendered && prevStrokeGradientDestinationX !== strokeGradientDestinationX) {
      applyStroke();
      setPrevStrokeGradientDestinationX(strokeGradientDestinationX);
    }
  }, [strokeGradientDestinationX]);

  useEffect(() => {
    if (rendered && prevStrokeGradientDestinationY !== strokeGradientDestinationY) {
      applyStroke();
      setPrevStrokeGradientDestinationY(strokeGradientDestinationY);
    }
  }, [strokeGradientDestinationY]);

  useEffect(() => {
    if (rendered && !gradientStopsMatch(strokeGradientStops, prevStrokeGradientStops)) {
      applyStroke();
      setPrevStrokeGradientStops(strokeGradientStops);
    }
  }, [strokeGradientStops]);

  useEffect(() => {
    if (rendered && prevStrokeWidth !== strokeWidth) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeWidth = strokeWidth;
      setPrevStrokeWidth(strokeWidth);
    }
  }, [strokeWidth]);

  return (
    <></>
  );
}

export default CanvasLayerStrokeStyle;