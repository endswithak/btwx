import * as text from './textUtils';
import * as image from './imageUtils';
import * as symbol from './symbolUtils';
import * as shapeGroup from './shapeGroupUtils';
import * as shapePath from './shapePathUtils';

import * as fill from './fillUtils';

export const textUtils = text;
export const imageUtils = image;
export const symbolUtils = symbol;
export const shapeGroupUtils = shapeGroup;
export const shapePathUtils = shapePath;

export const fillUtils = fill;

export default {
  text,
  image,
  symbol,
  shapeGroup,
  shapePath,
  fillUtils
};