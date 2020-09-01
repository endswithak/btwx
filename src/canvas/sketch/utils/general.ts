import FileFormat from '@sketch-hq/sketch-file-format-ts';
import tinyColor from 'tinycolor2';

export const convertPointString = (point: string): em.Point => {
  const str = point.replace(/\s/g, '');
  const commaPos = str.indexOf(',');
  const x = Number(str.substring(1, commaPos));
  const y = Number(str.substring(commaPos + 1, str.length - 1));
  return {x,y};
}

export const convertPosition = (layer: FileFormat.AnyLayer): em.Point => ({
  x: layer.frame.x + (layer.frame.width / 2),
  y: layer.frame.y + (layer.frame.height / 2)
});

export const convertColor = (sketchColor: FileFormat.Color): em.Color => {
  const color = tinyColor({r: sketchColor.red * 255, g: sketchColor.green * 255, b: sketchColor.blue * 255, a: sketchColor.alpha});
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  return {
    h: hsl.h,
    s: hsl.s,
    l: hsl.l,
    v: hsv.v,
    a: hsl.a
  }
};

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

export const convertGradientType = (sketchGradientType: FileFormat.GradientType): em.GradientType => {
  switch(sketchGradientType) {
    case 0:
      return 'linear';
    case 1:
      return 'radial';
  }
};

export const convertGradientOrigin = (sketchGradientOrigin: string): em.Point => {
  const point = convertPointString(sketchGradientOrigin);
  return {
    x: point.x - 0.5,
    y: point.y - 0.5
  }
};

export const convertGradientDestination = (sketchGradientDestination: string): em.Point => {
  const point = convertPointString(sketchGradientDestination);
  return {
    x: point.x - 0.5,
    y: point.y - 0.5
  }
};

export const convertGradientStops = (sketchGradientStops: FileFormat.GradientStop[]): em.GradientStop[] => {
  return sketchGradientStops.reduce((result, current) => {
    result = [...result, {
      position: current.position,
      color: convertColor(current.color)
    }];
    return result;
  }, []);
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

export const convertStroke = (layer: FileFormat.AnyLayer): em.Stroke => {
  const stroke = layer.style.borders.find(border => border.fillType === 0 || border.fillType === 1);
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

export const convertShadow = (layer: FileFormat.AnyLayer): em.Shadow => {
  const shadow = layer.style.shadows[0];
  if (shadow) {
    return {
      fillType: 'color',
      enabled: shadow.isEnabled,
      color: convertColor(shadow.color),
      offset: {
        x: shadow.offsetX,
        y: shadow.offsetY
      },
      blur: shadow.blurRadius
    }
  } else {
    return {} as em.Shadow;
  }
};

export const convertBlendMode = (layer: FileFormat.AnyLayer): em.BlendMode => {
  const blendMode = layer.style.contextSettings.blendMode;
  switch(blendMode) {
    case 0:
      return 'normal';
    case 1:
      return 'darken';
    case 2:
      return 'multiply';
    case 3:
      return 'color-burn';
    case 4:
      return 'lighten';
    case 5:
      return 'screen';
    case 6:
      return 'color-dodge';
    case 7:
      return 'overlay';
    case 8:
      return 'soft-light';
    case 9:
      return 'hard-light';
    case 10:
      return 'difference';
    case 11:
      return 'exclusion';
    case 12:
      return 'hue';
    case 13:
      return 'saturation';
    case 14:
      return 'color';
    case 15:
      return 'luminosity';
    case 16:
      return 'darker';
    case 17:
      return 'lighter';
  }
};