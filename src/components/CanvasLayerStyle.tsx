import React, { ReactElement, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
// import { updateCanvasLayer } from '../store/actions/layer';
// import { getHoverBounds } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';

interface CanvasLayerProps {
  id: string;
  rendered: boolean;
}

const CanvasLayerStyle = (props: CanvasLayerProps): ReactElement => {
  const { id, rendered } = props;
  const layerType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type);
  const isLine = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line');
  const projectIndex = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).projectIndex);
  // frames
  const layerFrame = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].frame);
  const artboardFrame = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[state.layer.present.byId[id].artboard] as Btwx.Artboard).frame);
  // fill
  const fillEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.enabled);
  const fillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.fillType);
  const fillColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.color);
  const fillGradientType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.gradientType);
  const fillGradientOrigin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.origin);
  const fillGradientDestination = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.destination);
  const fillGradientStops = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.fill.gradient.stops);
  // stroke
  const strokeEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.enabled);
  const strokeWidth = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.width);
  const strokeFillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.fillType);
  const strokeColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.color);
  const strokeGradientType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.gradientType);
  const strokeGradientOrigin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.origin);
  const strokeGradientDestination = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.destination);
  const strokeGradientStops = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.stroke.gradient.stops);
  // stroke options
  const strokeCap = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.cap);
  const strokeJoin = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.join);
  const strokeDashArray = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.dashArray);
  const strokeDashOffset = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.strokeOptions.dashOffset);
  // shadow
  const shadowEnabled = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.enabled);
  const shadowFillType = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.fillType);
  const shadowColor = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.color);
  const shadowBlur = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.blur);
  const shadowOffset = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.shadow.offset);
  // other
  const opacity = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.opacity);
  const blendMode = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].style.blendMode);

  const getStyleLayer = (): paper.Item => {
    let paperLayer = uiPaperScope.projects[projectIndex].getItem({data: {id}});
    if (layerType === 'Text') {
      paperLayer = paperLayer.getItem({data: {id: 'textLines'}});
    }
    return paperLayer;
  }

  const setLayerStroke = useCallback(
    debounce(() => {
      const paperLayer = getStyleLayer();
      if (strokeEnabled) {
        const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
        const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
        const layerAbsPosition = layerPosition.add(artboardPosition);
        switch(strokeFillType) {
          case 'color':
            paperLayer.strokeColor = { hue: strokeColor.h, saturation: strokeColor.s, lightness: strokeColor.l, alpha: strokeColor.a } as paper.Color;
            break;
          case 'gradient':
            paperLayer.strokeColor  = {
              gradient: {
                stops: strokeGradientStops.reduce((result, current) => {
                  result = [
                    ...result,
                    new uiPaperScope.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)
                  ];
                  return result;
                }, []) as paper.GradientStop[],
                radial: strokeGradientType === 'radial'
              },
              origin: new uiPaperScope.Point((strokeGradientOrigin.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x, (strokeGradientOrigin.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y),
              destination: new uiPaperScope.Point((strokeGradientDestination.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x, (strokeGradientDestination.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y)
            } as any
            break;
        }
      } else {
        paperLayer.strokeColor = null;
      }
    }, 10),
    [
      strokeEnabled, strokeFillType, strokeColor, strokeGradientType, strokeGradientOrigin, strokeGradientDestination, strokeGradientStops,
      projectIndex, layerType, layerFrame, artboardFrame
    ]
  );

  const setLayerFill = useCallback(
    debounce(() => {
      const paperLayer = getStyleLayer();
      if (fillEnabled) {
        const layerPosition = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
        const artboardPosition = new uiPaperScope.Point(artboardFrame.x, artboardFrame.y);
        const layerAbsPosition = layerPosition.add(artboardPosition);
        switch(fillType) {
          case 'color':
            paperLayer.fillColor = { hue: fillColor.h, saturation: fillColor.s, lightness: fillColor.l, alpha: fillColor.a } as paper.Color;
            break;
          case 'gradient':
            paperLayer.fillColor  = {
              gradient: {
                stops: fillGradientStops.reduce((result, current) => {
                  result = [
                    ...result,
                    new uiPaperScope.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)
                  ];
                  return result;
                }, []) as paper.GradientStop[],
                radial: fillGradientType === 'radial'
              },
              origin: new uiPaperScope.Point((fillGradientOrigin.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x, (fillGradientOrigin.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y),
              destination: new uiPaperScope.Point((fillGradientDestination.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x, (fillGradientDestination.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y)
            } as any
            break;
        }
      } else {
        paperLayer.fillColor = null;
      }
    }, 10),
    [
      fillEnabled, fillType, fillColor, fillGradientType, fillGradientOrigin, fillGradientDestination, fillGradientStops,
      projectIndex, layerType, layerFrame, artboardFrame
    ]
  );

  const setLayerShadow = useCallback(
    debounce(() => {
      const paperLayer = getStyleLayer();
      if (shadowEnabled) {
        paperLayer.shadowColor = { hue: shadowColor.h, saturation: shadowColor.s, lightness: shadowColor.l, alpha: shadowColor.a } as paper.Color;
        paperLayer.shadowBlur = shadowBlur;
        paperLayer.shadowOffset = new uiPaperScope.Point(shadowOffset.x, shadowOffset.y);
      } else {
        paperLayer.shadowColor = null;
      }
    }, 10),
    [
      shadowEnabled, shadowFillType, shadowColor, shadowBlur, shadowOffset,
      projectIndex, layerType, layerFrame, artboardFrame
    ]
  );

  useEffect(() => {
    if (rendered) {
      setLayerFill();
    }
  }, [fillEnabled, fillType, fillColor, fillGradientType, fillGradientOrigin, fillGradientDestination, fillGradientStops, layerFrame]);

  useEffect(() => {
    if (rendered) {
      setLayerStroke();
    }
  }, [strokeEnabled, strokeFillType, strokeColor, strokeGradientType, strokeGradientOrigin, strokeGradientDestination, strokeGradientStops, layerFrame]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeWidth = strokeWidth;
    }
  }, [strokeWidth]);

  useEffect(() => {
    if (rendered) {
      setLayerShadow();
    }
  }, [shadowEnabled, shadowFillType, shadowColor, shadowBlur, shadowOffset]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeCap = strokeCap;
    }
  }, [strokeCap]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.strokeJoin = strokeJoin;
    }
  }, [strokeJoin]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.dashArray = strokeDashArray;
    }
  }, [strokeDashArray]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.dashOffset = strokeDashOffset;
    }
  }, [strokeDashOffset]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.opacity = opacity;
    }
  }, [opacity]);

  useEffect(() => {
    if (rendered) {
      const paperLayer = getStyleLayer();
      paperLayer.blendMode = blendMode;
    }
  }, [blendMode]);

  return (
    <></>
  );
}

export default CanvasLayerStyle;