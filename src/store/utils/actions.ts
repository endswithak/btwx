import { paperMain } from '../../canvas';
import { getPaperShapePathData } from './paper';
import { getCurvePoints } from '../selectors/layer';

import {
  DEFAULT_TRANSFORM, DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DEFAULT_TEXT_STYLE,
  DEFAULT_SHADOW_STYLE, DEFAULT_BLEND_MODE, DEFAULT_OPACITY, DEFAULT_SHAPE_WIDTH,
  DEFAULT_SHAPE_HEIGHT, DEFAULT_STAR_POINTS, DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS,
  DEFAULT_POLYGON_SIDES, DEFAULT_STROKE_OPTIONS_STYLE
} from '../../constants';

export const getLayerFillStyle = (payload: any, overrides = {}): em.Fill => {
  const fill = payload.layer.style && payload.layer.style.fill ? { ...DEFAULT_FILL_STYLE, ...payload.layer.style.fill, ...overrides } : DEFAULT_FILL_STYLE;
  return fill;
};

export const getLayerStrokeOptionsStyle = (payload: any, overrides = {}): em.StrokeOptions => {
  const strokeOptions = payload.layer.style && payload.layer.style.strokeOptions ? { ...DEFAULT_STROKE_OPTIONS_STYLE, ...payload.layer.style.strokeOptions, ...overrides } : DEFAULT_STROKE_OPTIONS_STYLE;
  return strokeOptions;
};

export const getLayerStrokeStyle = (payload: any, overrides = {}): em.Stroke => {
  const stroke = payload.layer.style && payload.layer.style.stroke ? { ...DEFAULT_STROKE_STYLE, ...payload.layer.style.stroke, ...overrides } : DEFAULT_STROKE_STYLE;
  return stroke;
};

export const getLayerShadowStyle = (payload: any, overrides = {}): em.Shadow => {
  const shadow = payload.layer.style && payload.layer.style.shadow ? { ...DEFAULT_SHADOW_STYLE, ...payload.layer.style.shadow, ...overrides } : DEFAULT_SHADOW_STYLE;
  return shadow;
};

export const getLayerTransform = (payload: any, overrides = {}): em.Transform => {
  const transform = payload.layer.transform ? { ...DEFAULT_TRANSFORM, ...payload.layer.transform, ...overrides } : DEFAULT_TRANSFORM;
  return transform;
}

export const getLayerStyle = (payload: any, styleOverrides = {}, overrides = { fill: {}, stroke: {}, strokeOptions: {}, shadow: {} }): em.Style => {
  const fill = getLayerFillStyle(payload, overrides.fill);
  const stroke = getLayerStrokeStyle(payload, overrides.stroke);
  const strokeOptions = getLayerStrokeOptionsStyle(payload, overrides.strokeOptions);
  const shadow = getLayerShadowStyle(payload, overrides.shadow);
  const opacity = payload.layer.style && payload.layer.style.opacity ? payload.layer.style.opacity : DEFAULT_OPACITY;
  const blendMode = payload.layer.style && payload.layer.style.blendMode ? payload.layer.style.blendMode : DEFAULT_BLEND_MODE;
  return { fill, stroke, strokeOptions, shadow, opacity, blendMode, ...styleOverrides };
}

export const getLayerTextStyle = (payload: any, overrides = {}): em.TextStyle => {
  const textStyle = payload.layer.textStyle ? { ...DEFAULT_TEXT_STYLE, ...payload.layer.textStyle, ...overrides } : DEFAULT_TEXT_STYLE;
  return textStyle;
}

export const getLayerShapeOpts = (payload: any): { radius?: number; points?: number; sides?: number } => {
  const hasRadius = payload.layer.shapeType === 'Rounded' || payload.layer.shapeType === 'Star';
  const radius = hasRadius ? (payload.layer as em.Star | em.Rounded).radius ? (payload.layer as em.Star | em.Rounded).radius : payload.layer.shapeType === 'Rounded' ? DEFAULT_ROUNDED_RADIUS : DEFAULT_STAR_RADIUS : null;
  const points = payload.layer.shapeType === 'Star' ? (payload.layer as em.Star).points ? (payload.layer as em.Star).points : DEFAULT_STAR_POINTS : null;
  const sides = payload.layer.shapeType === 'Polygon' ? (payload.layer as em.Polygon).sides ? (payload.layer as em.Polygon).sides : DEFAULT_POLYGON_SIDES : null;
  switch(payload.layer.shapeType) {
    case 'Ellipse':
    case 'Rectangle':
      return {};
    case 'Rounded':
      return {
        radius
      };
    case 'Star':
      return {
        points,
        radius
      }
    case 'Polygon':
      return {
        sides
      }
    default:
      return {};
  }
}

export const getLayerFrame = (payload: any, overrides = {}): em.Frame => {
  const x = payload.layer.frame && payload.layer.frame.x ? payload.layer.frame.x : paperMain.view.center.x;
  const y = payload.layer.frame && payload.layer.frame.y ? payload.layer.frame.y : paperMain.view.center.y;
  const width = payload.layer.frame && payload.layer.frame.width ? payload.layer.frame.width : DEFAULT_SHAPE_WIDTH;
  const height = payload.layer.frame && payload.layer.frame.width ? payload.layer.frame.height : DEFAULT_SHAPE_HEIGHT;
  const innerWidth = payload.layer.frame && payload.layer.frame.innerWidth ? payload.layer.frame.innerWidth : DEFAULT_SHAPE_WIDTH;
  const innerHeight = payload.layer.frame && payload.layer.frame.innerHeight ? payload.layer.frame.innerHeight : DEFAULT_SHAPE_HEIGHT;
  return { x, y, width, height, innerWidth, innerHeight, ...overrides };
}

export const getLayerShapePath = (payload: any): { data: string; closed: boolean; points: em.CurvePoint[] } => {
  const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
  const frame = getLayerFrame(payload);
  const shapeOpts = getLayerShapeOpts(payload);
  const pathData = payload.layer.path && payload.layer.path.data ? payload.layer.path.data : getPaperShapePathData(shapeType, frame.innerWidth, frame.innerHeight, frame.x, frame.y, shapeOpts);
  const closed = payload.layer.path && (payload.layer.path.closed !== null || payload.layer.path.closed !== undefined) ? payload.layer.path.closed : true;
  return { data: pathData, closed: closed, points: getCurvePoints(new paperMain.Path({pathData, insert: false})) };
}