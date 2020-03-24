import paper, { Layer, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetFillSizeOptions {
  layerWidth: number;
  layerHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export const getFillSize = ({ layerWidth, layerHeight, containerWidth, containerHeight }: GetFillSizeOptions): {width: number; height: number} => {
  const maxWidth: number = Math.max(containerWidth, layerWidth);
  const maxHeight: number = Math.max(containerHeight, layerHeight);
  const maxRatio: number = maxWidth / maxHeight;
  const layerRatio: number = layerWidth / layerHeight;
  if (maxRatio > layerRatio) {
    // height is the constraining dimension
    return {
      width: containerWidth,
      height: layerHeight * (containerWidth / layerWidth)
    }
  } else {
    // width is the constraining dimension
    return {
      width: layerWidth * (containerHeight / layerHeight),
      height: containerHeight
    }
  }
};

interface GetFitSizeOptions {
  layerWidth: number;
  layerHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export const getFitSize = ({ layerWidth, layerHeight, containerWidth, containerHeight }: GetFitSizeOptions): {width: number; height: number} => {
  const maxWidth: number = Math.max(containerWidth, layerWidth);
  const maxHeight: number = Math.max(containerHeight, layerHeight);
  const maxRatio: number = maxWidth / maxHeight;
  const layerRatio: number = layerWidth / layerHeight;
  if (maxRatio > layerRatio) {
    // height is the constraining dimension
    return {
      width: containerHeight * layerRatio,
      height: containerHeight
    }
  } else {
    // width is the constraining dimension
    return {
      width: containerWidth,
      height: containerWidth * layerRatio
    }
  }


  // if (maxRatio > layerRatio) {
  //   // height is the constraining dimension
  //   return maxHeight / layerHeight;
  // } else {
  //   // width is the constraining dimension
  //   return maxWidth / layerWidth;
  // }
};

interface PaperColor {
  color: FileFormat.Color;
}

export const getPaperColor = ({ color }: PaperColor): paper.Color => {
  return new Color(color.red, color.green, color.blue, color.alpha);
};