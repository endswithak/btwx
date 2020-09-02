import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { convertColor, convertGradientDestination, convertGradientOrigin, convertGradientType, convertGradientStops } from './general';

export const convertFillType = (sketchFillType: FileFormat.FillType): em.FillType => {
  switch(sketchFillType) {
    case 0:
      return 'color';
    case 1:
      return 'gradient';
    // case 4:
    //   return 'pattern';
  }
};

export const convertFill = (layer: FileFormat.AnyLayer): em.Fill => {
  const fill = layer.style.fills.find(fill => fill.fillType === 0 || fill.fillType === 1);
  return {
    enabled: fill.isEnabled,
    color: convertColor(fill.color),
    fillType: convertFillType(fill.fillType),
    gradient: {
      activeStopIndex: 0,
      gradientType: convertGradientType(fill.gradient.gradientType),
      origin: convertGradientOrigin(fill.gradient.from),
      destination: convertGradientDestination(fill.gradient.to),
      stops: convertGradientStops(fill.gradient.stops)
    }
  }
};