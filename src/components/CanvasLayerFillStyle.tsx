import React, { ReactElement, useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { colorsMatch, gradientStopsMatch } from '../utils';
import { uiPaperScope } from '../canvas';
import CanvasTextLayerFillStyle from './CanvasTextLayerFillStyle';

interface CanvasLayerFillStyleProps {
  id: string;
  layerItem: Btwx.Layer;
  artboardItem: Btwx.Artboard;
  rendered: boolean;
}

const CanvasLayerFillStyle = (props: CanvasLayerFillStyleProps): ReactElement => {
  const { id, layerItem, artboardItem, rendered } = props;
  const isShape = layerItem ? layerItem.type === 'Shape' : null;
  const isLine = layerItem ? isShape && (layerItem as Btwx.Shape).shapeType === 'Line' : null;
  // const mask = layerItem && isShape ? (layerItem as Btwx.Shape).mask : null;
  const layerType = layerItem ? layerItem.type : null;
  const projectIndex = layerItem ? layerItem.type === 'Artboard' ? (layerItem as Btwx.Artboard).projectIndex : artboardItem.projectIndex : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const innerWidth = layerItem ? layerItem.frame.innerWidth : null;
  const innerHeight = layerItem ? layerItem.frame.innerHeight : null;
  const artboardFrame = artboardItem ? artboardItem.frame : null;
  const rotation = layerItem ? layerItem.transform.rotation : null;
  const fillEnabled = layerItem ? layerItem.style.fill.enabled : null;
  const fillType = layerItem ? layerItem.style.fill.fillType : null;
  const fillColor = layerItem ? layerItem.style.fill.color : null;
  const fillGradientType = layerItem ? layerItem.style.fill.gradient.gradientType : null;
  const fillGradientOriginX = layerItem ? layerItem.style.fill.gradient.origin.x : null;
  const fillGradientOriginY = layerItem ? layerItem.style.fill.gradient.origin.y : null;
  const fillGradientDestinationX = layerItem ? layerItem.style.fill.gradient.destination.x : null;
  const fillGradientDestinationY = layerItem ? layerItem.style.fill.gradient.destination.y : null;
  const fillGradientStops = layerItem ? layerItem.style.fill.gradient.stops : null;
  // const [prevMask, setPrevMask] = useState(mask);
  const [prevInnerWidth, setPrevInnerWidth] = useState(innerWidth);
  const [prevInnerHeight, setPrevInnerHeight] = useState(innerHeight);
  const [prevRotation, setPrevRotation] = useState(rotation);
  const [prevFillEnabled, setPrevFillEnabled] = useState(fillEnabled);
  const [prevFillType, setPrevFillType] = useState(fillType);
  const [prevFillColor, setPrevFillColor] = useState(fillColor);
  const [prevFillGradientType, setPrevFillGradientType] = useState(fillGradientType);
  const [prevFillGradientOriginX, setPrevFillGradientOriginX] = useState(fillGradientOriginX);
  const [prevFillGradientOriginY, setPrevFillGradientOriginY] = useState(fillGradientOriginY);
  const [prevFillGradientDestinationX, setPrevFillGradientDestinationX] = useState(fillGradientDestinationX);
  const [prevFillGradientDestinationY, setPrevFillGradientDestinationY] = useState(fillGradientDestinationY);
  const [prevFillGradientStops, setPrevFillGradientStops] = useState(fillGradientStops);

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

  const applyFill = (): void => {
    const paperLayer = getStyleLayer();
    if (fillEnabled) {
      const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
      const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
      const layerAbsPosition = layerPosition.add(artboardPosition);
      switch(fillType) {
        case 'color':
          paperLayer.fillColor = {
            hue: fillColor.h,
            saturation: fillColor.s,
            lightness: fillColor.l,
            alpha: fillColor.a
          } as paper.Color;
          break;
        case 'gradient':
          paperLayer.fillColor  = {
            gradient: {
              stops: fillGradientStops.reduce((result, current) => {
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
              radial: fillGradientType === 'radial'
            },
            origin: new uiPaperScope.Point(
              (fillGradientOriginX * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
              (fillGradientOriginY * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
            ),
            destination: new uiPaperScope.Point(
              (fillGradientDestinationX * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
              (fillGradientDestinationY * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
            )
          } as Btwx.PaperGradientFill;
          break;
      }
    } else {
      paperLayer.fillColor = tinyColor('#fff').setAlpha(0).toHslString() as any;
    }
  }

  // useEffect(() => {
  //   if (rendered && prevMask !== mask) {
  //     if (fillEnabled) {
  //       applyFill();
  //     }
  //     setPrevMask(mask);
  //   }
  // }, [mask]);

  useEffect(() => {
    if (rendered && prevRotation !== rotation) {
      applyFill();
      setPrevRotation(rotation);
    }
  }, [rotation]);

  useEffect(() => {
    if (rendered && prevInnerWidth !== innerWidth) {
      applyFill();
      setPrevInnerWidth(innerWidth);
    }
  }, [innerWidth]);

  useEffect(() => {
    if (rendered && prevInnerHeight !== innerHeight) {
      applyFill();
      setPrevInnerHeight(innerHeight);
    }
  }, [innerHeight]);

  useEffect(() => {
    if (rendered && prevFillEnabled !== fillEnabled) {
      applyFill();
      setPrevFillEnabled(fillEnabled);
    }
  }, [fillEnabled]);

  useEffect(() => {
    if (rendered && prevFillType !== fillType) {
      applyFill();
      setPrevFillType(fillType);
    }
  }, [fillType]);

  useEffect(() => {
    if (rendered && !colorsMatch(prevFillColor, fillColor)) {
      applyFill();
      setPrevFillColor(fillColor);
    }
  }, [fillColor]);

  useEffect(() => {
    if (rendered && prevFillGradientType !== fillGradientType) {
      applyFill();
      setPrevFillGradientType(fillGradientType);
    }
  }, [fillGradientType]);

  useEffect(() => {
    if (rendered && prevFillGradientOriginX !== fillGradientOriginX) {
      applyFill();
      setPrevFillGradientOriginX(fillGradientOriginX);
    }
  }, [fillGradientOriginX]);

  useEffect(() => {
    if (rendered && prevFillGradientOriginY !== fillGradientOriginY) {
      applyFill();
      setPrevFillGradientOriginY(fillGradientOriginY);
    }
  }, [fillGradientOriginY]);

  useEffect(() => {
    if (rendered && prevFillGradientDestinationX !== fillGradientDestinationX) {
      applyFill();
      setPrevFillGradientDestinationX(fillGradientDestinationX);
    }
  }, [fillGradientDestinationX]);

  useEffect(() => {
    if (rendered && prevFillGradientDestinationY !== fillGradientDestinationY) {
      applyFill();
      setPrevFillGradientDestinationY(fillGradientDestinationY);
    }
  }, [fillGradientDestinationY]);

  useEffect(() => {
    if (rendered && !gradientStopsMatch(fillGradientStops, prevFillGradientStops)) {
      applyFill();
      setPrevFillGradientStops(fillGradientStops);
    }
  }, [fillGradientStops]);

  return (
    <>
      {
        layerType === 'Text'
        ? <CanvasTextLayerFillStyle
            {...props}
            layerItem={layerItem as Btwx.Text}
            applyFill={applyFill} />
        : null
      }
    </>
  );
}

export default CanvasLayerFillStyle;