import paper, { Layer, Color, Point, Group, Path } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor } from './general';
import { getBlendMode } from './contextUtils';

interface RenderInnerShadow {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  innerShadow: FileFormat.InnerShadow;
  container: paper.Layer;
}

export const renderInnerShadow = ({ shapePath, innerShadow, container }: RenderInnerShadow): void => {
  const mask = shapePath.clone();
  mask.name = 'mask';
  mask.parent = container;
  mask.clipMask = true;
  const shapeBoundsSpreadX = innerShadow.offsetX < 0 ? innerShadow.offsetX * -1 : innerShadow.offsetX;
  const shapeBoundsSpreadY = innerShadow.offsetY < 0 ? innerShadow.offsetY * -1 : innerShadow.offsetY;
  const shapeBounds = new Path.Rectangle({
    point: [(innerShadow.blurRadius + shapeBoundsSpreadX) * -1, (innerShadow.blurRadius + shapeBoundsSpreadY) * -1],
    size: [shapePath.bounds.width + (innerShadow.blurRadius * 2 + shapeBoundsSpreadX * 2), shapePath.bounds.height + (innerShadow.blurRadius * 2 + shapeBoundsSpreadY * 2)],
    insert: false
  });
  const shapeInverse = shapeBounds.subtract(shapePath as paper.Path | paper.CompoundPath) as paper.Path | paper.CompoundPath;
  const innerShadowLayer = shapeInverse.clone();
  innerShadowLayer.name = `inner-shadow`;
  innerShadowLayer.parent = container;
  innerShadowLayer.fillColor = new Color(255,255,255);
  innerShadowLayer.shadowColor = getPaperColor({color: innerShadow.color});
  innerShadowLayer.shadowBlur = innerShadow.blurRadius;
  innerShadowLayer.shadowOffset = new Point(innerShadow.offsetX, innerShadow.offsetY);
};

interface RenderInnerShadows {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  innerShadows: FileFormat.InnerShadow[];
  container: paper.Group;
}

export const renderInnerShadows = ({ shapePath, innerShadows, container }: RenderInnerShadows): void => {
  if (innerShadows.some((innerShadow) => innerShadow.isEnabled)) {
    const innerShadowsContainer = new Group({
      name: 'inner-shadows',
      parent: container
    });
    innerShadows.forEach((innerShadow, innerShadowIndex) => {
      if (innerShadow.isEnabled) {
        const innerShadowLayer = new Layer({
          name: `inner-shadow-${innerShadowIndex}`,
          parent: innerShadowsContainer,
          blendMode: getBlendMode({
            blendMode: innerShadow.contextSettings.blendMode
          })
        });
        renderInnerShadow({
          shapePath: shapePath,
          innerShadow: innerShadow,
          container: innerShadowLayer
        });
      }
    });
  }
};