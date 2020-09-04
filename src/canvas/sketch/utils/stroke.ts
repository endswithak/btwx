import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { convertColor, convertGradientDestination, convertGradientOrigin, convertGradientType, convertGradientStops } from './general';
import { convertFillType } from './fill';
import { DEFAULT_STROKE_STYLE, DEFAULT_STROKE_OPTIONS_STYLE } from '../../../constants';

export const convertStroke = (layer: FileFormat.AnyLayer): em.Stroke => {
  const stroke = layer.style.borders.find(border => border.fillType === 0 || border.fillType === 1);
  if (!stroke) {
    return {
      ...DEFAULT_STROKE_STYLE,
      enabled: false
    }
  } else {
    return {
      enabled: stroke.isEnabled,
      width: stroke.thickness,
      color: convertColor(stroke.color),
      fillType: convertFillType(stroke.fillType),
      gradient: {
        activeStopIndex: 0,
        gradientType: convertGradientType(stroke.gradient.gradientType),
        origin: convertGradientOrigin(stroke.gradient.from),
        destination: convertGradientDestination(stroke.gradient.to),
        stops: convertGradientStops(stroke.gradient.stops)
      }
    }
  }
};

export const convertStrokeCap = (sketchStrokeCap: FileFormat.LineCapStyle): string => {
  switch(sketchStrokeCap) {
    case 0:
      return 'butt';
    case 1:
      return 'round';
    case 2:
      return 'square';
  }
};

export const convertStrokeJoin = (sketchStrokeJoin: FileFormat.LineJoinStyle): string => {
  switch(sketchStrokeJoin) {
    case 0:
      return 'miter';
    case 1:
      return 'round';
    case 2:
      return 'bevel';
  }
};

export const convertStrokeDashArray = (sketchStrokeJoin: number[]): number[] => {
  const width = sketchStrokeJoin[0] ? sketchStrokeJoin[0] : 0;
  const gap = sketchStrokeJoin[1] ? sketchStrokeJoin[1] : 0;
  return [width, gap];
};

export const convertStrokeOptions = (layer: FileFormat.AnyLayer): em.StrokeOptions => ({
  cap: convertStrokeCap(layer.style.borderOptions.lineCapStyle),
  join: convertStrokeJoin(layer.style.borderOptions.lineJoinStyle),
  dashArray: convertStrokeDashArray(layer.style.borderOptions.dashPattern),
  dashOffset: 0
});