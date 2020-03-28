import paper, { Layer, Color, Point, Group } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor } from './general';
import { drawText } from './textUtils';

interface GetGroupShadows {
  layer: FileFormat.AnyLayer;
  groupShadows: FileFormat.Shadow[];
}

export const getGroupShadows = ({ layer, groupShadows }: GetGroupShadows): FileFormat.Shadow[] => {
  if (layer._class === 'group') {
    return groupShadows ? [...groupShadows, ...layer.style.shadows] : layer.style.shadows;
  } else {
    return groupShadows;
  }
};

interface RenderShadow {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  shadow: FileFormat.Shadow;
  container: paper.Layer;
}

export const renderShadow = ({ shapePath, shadow, container }: RenderShadow): void => {
  const shadowLayer = shapePath.clone();
  shadowLayer.name = `shadow`;
  shadowLayer.parent = container;
  shadowLayer.fillColor = new Color(255, 255, 255);
  shadowLayer.shadowColor = getPaperColor({color: shadow.color});
  shadowLayer.shadowBlur = shadow.blurRadius;
  shadowLayer.shadowOffset = new Point(shadow.offsetX, shadow.offsetY);
};

interface RenderShadows {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  shadows: FileFormat.Shadow[];
  container: paper.Group;
}

export const renderShadows = ({ shapePath, shadows, container }: RenderShadows): void => {
  if (shadows.some((shadow) => shadow.isEnabled)) {
    const shadowsContainer = new Group({
      name: 'shadows',
      parent: container
    });
    shadows.forEach((shadow, shadowIndex) => {
      if (shadow.isEnabled) {
        const shadowLayer = new Layer({
          name: `shadow-${shadowIndex}`,
          parent: shadowsContainer
        });
        renderShadow({
          shapePath: shapePath,
          shadow: shadow,
          container: shadowLayer
        });
      }
    });
  }
};

interface RenderTextShadows {
  layer: FileFormat.Text;
  textAttrs: any;
  shadows: FileFormat.Shadow[];
  container: paper.Group;
}

export const renderTextShadows = ({ layer, textAttrs, shadows, container }: RenderTextShadows): void => {
  if (shadows.some((shadow) => shadow.isEnabled)) {
    const shadowsContainer = new Group({
      name: 'shadows',
      parent: container
    });
    shadows.forEach((shadow, shadowIndex) => {
      if (shadow.isEnabled) {
        drawText({
          layer: layer,
          textOptions: {
            ...textAttrs,
            fillColor: new Color(255,255,255),
            shadowColor: getPaperColor({color: shadow.color}),
            shadowBlur: shadow.blurRadius,
            shadowOffset: new Point(shadow.offsetX, shadow.offsetY)
          },
          layerOptions: {
            parent: shadowsContainer,
            name: `shadow-${shadowIndex}`
          }
        });
      }
    });
  }
};