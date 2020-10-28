import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { convertColor } from './general';
import { DEFAULT_SHADOW_STYLE } from '../../../constants';

export const convertShadow = (layer: FileFormat.AnyLayer): Btwx.Shadow => {
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
    if (layer._class === 'text') {
      return {
        ...DEFAULT_SHADOW_STYLE,
        enabled: false
      }
    } else {
      return DEFAULT_SHADOW_STYLE;
    }
  }
};