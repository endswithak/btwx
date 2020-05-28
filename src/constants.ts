export const DEFAULT_FILL_STYLE: em.Fill = {
  enabled: true,
  color: '#cccccc'
}

export const DEFAULT_STROKE_STYLE: em.Stroke = {
  enabled: true,
  color: '#999999',
  width: 1
}

export const DEFAULT_STROKE_OPTIONS_STYLE: em.StrokeOptions = {
  cap: 'butt',
  join: 'miter',
  dashArray: [0,0],
  miterLimit: 10
}

export const DEFAULT_SHADOW_STYLE: em.Shadow = {
  enabled: false,
  color: '#000000',
  blur: 10,
  offset: {
    x: 0,
    y: 0,
  }
}

export const DEFAULT_STYLE: em.Style = {
  fill: DEFAULT_FILL_STYLE,
  stroke: DEFAULT_STROKE_STYLE,
  strokeOptions: DEFAULT_STROKE_OPTIONS_STYLE,
  opacity: 1,
  rotation: 0,
  horizontalFlip: false,
  verticalFlip: false,
  shadow: DEFAULT_SHADOW_STYLE
}

export const DEFAULT_TEXT_VALUE = 'Type Something';

export const DEFAULT_TEXT_STYLE: em.TextStyle = {
  fontSize: 12,
  fillColor: '#000000',
  leading: 16,
  fontWeight: 'normal',
  fontFamily: 'Helvetica',
  justification: 'left'
}