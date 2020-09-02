import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { convertColor } from './general';

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