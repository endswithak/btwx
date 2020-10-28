import FileFormat from '@sketch-hq/sketch-file-format-ts';
import tinyColor from 'tinycolor2';

export const convertWindingRule = (windingRule: number): string => {
  switch(windingRule) {
    case 0:
      return 'nonzero';
    case 1:
      return 'evenodd';
  }
};

export const convertBooleanOperation = (operation: FileFormat.BooleanOperation): string | null => {
  switch(operation) {
    case -1:
      return 'exclude';
    case 0:
      return 'unite';
    case 1:
      return 'subtract';
    case 2:
      return 'intersect';
    case 3:
      return 'exclude';
  }
};

export const convertPointString = (point: string): Btwx.Point => {
  const str = point.replace(/\s/g, '');
  const commaPos = str.indexOf(',');
  const x = Number(str.substring(1, commaPos));
  const y = Number(str.substring(commaPos + 1, str.length - 1));
  return {x,y};
}

export const convertPosition = (layer: FileFormat.AnyLayer): Btwx.Point => ({
  x: layer.frame.x + (layer.frame.width / 2),
  y: layer.frame.y + (layer.frame.height / 2)
});

export const convertColor = (sketchColor: FileFormat.Color): Btwx.Color => {
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

export const convertGradientType = (sketchGradientType: FileFormat.GradientType): Btwx.GradientType => {
  switch(sketchGradientType) {
    case 0:
      return 'linear';
    case 1:
      return 'radial';
  }
};

export const convertGradientOrigin = (sketchGradientOrigin: string): Btwx.Point => {
  const point = convertPointString(sketchGradientOrigin);
  return {
    x: point.x - 0.5,
    y: point.y - 0.5
  }
};

export const convertGradientDestination = (sketchGradientDestination: string): Btwx.Point => {
  const point = convertPointString(sketchGradientDestination);
  return {
    x: point.x - 0.5,
    y: point.y - 0.5
  }
};

export const convertGradientStops = (sketchGradientStops: FileFormat.GradientStop[]): Btwx.GradientStop[] => {
  return sketchGradientStops.reduce((result, current) => {
    result = [...result, {
      position: current.position,
      color: convertColor(current.color)
    }];
    return result;
  }, []);
};

export const convertBlendMode = (layer: FileFormat.AnyLayer): Btwx.BlendMode => {
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

interface GetLayerPath {
  path: string;
  layer: FileFormat.AnyLayer;
}

export const getLayerPath = ({ path, layer }: GetLayerPath): string => {
  return path ? `${path}/${layer.do_objectID}` : layer.do_objectID;
};