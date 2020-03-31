import * as text from './textUtils';
import * as image from './imageUtils';
import * as symbol from './symbolUtils';
import * as shapeGroup from './shapeGroupUtils';
import * as shapePath from './shapePathUtils';
import * as general from './general';

import * as frame from './frameUtils';
import * as context from './contextUtils';
import * as shadow from './shadowUtils';
import * as fill from './fillUtils';
import * as border from './borderUtils';
import * as innerShadow from './innerShadowUtils';

export const textUtils = text;
export const imageUtils = image;
export const symbolUtils = symbol;
export const shapeGroupUtils = shapeGroup;
export const shapePathUtils = shapePath;
export const generalUtils = general;

export const frameUtils = frame;
export const contextUtils = context;
export const shadowUtils = shadow;
export const fillUtils = fill;
export const borderUtils = border;
export const innerShadowUtils = innerShadow;

export default {
  text,
  image,
  symbol,
  shapeGroup,
  shapePath,
  frameUtils,
  contextUtils,
  shadowUtils,
  fillUtils,
  borderUtils,
  innerShadowUtils,
  generalUtils
};