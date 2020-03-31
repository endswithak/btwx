import paper, { Layer, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import {
  shapePathUtils,
  fillUtils,
  borderUtils,
  imageUtils,
  shadowUtils,
  innerShadowUtils,
  contextUtils,
  frameUtils
} from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  path: string;
  groupShadows?: FileFormat.Shadow[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderShapePath = ({ layer, images, container, path, groupShadows, overrides, symbolPath }: RenderShapePath): paper.Layer => {
  const shapePathContainer = new Layer({
    name: layer.do_objectID,
    data: {
      name: layer.name,
      type: 'shapePath',
      path: path
    },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container,
    blendMode: contextUtils.getBlendMode({
      blendMode: layer.style.contextSettings.blendMode
    }),
    opacity: layer.style.contextSettings.opacity
  });
  const override = imageUtils.getOverrideImage({
    overrides: overrides,
    symbolPath: symbolPath
  });
  const shapePath = shapePathUtils.drawShapePath({
    layer: layer,
    opts: {
      insert: false,
      closed: layer.isClosed,
      windingRule: shapePathUtils.getWindingRule({windingRule: layer.style.windingRule})
    }
  });
  shadowUtils.renderShadows({
    shapePath: shapePath,
    shadows: groupShadows ? [...groupShadows, ...layer.style.shadows] : layer.style.shadows,
    container: shapePathContainer
  });
  fillUtils.renderFills({
    shapePath: shapePath,
    fills: layer.style.fills,
    images: images,
    override: override,
    container: shapePathContainer
  });
  innerShadowUtils.renderInnerShadows({
    shapePath: shapePath,
    innerShadows: layer.style.innerShadows,
    container: shapePathContainer
  });
  borderUtils.renderBorders({
    shapePath: shapePath,
    borders: layer.style.borders,
    borderOptions: layer.style.borderOptions,
    container: shapePathContainer
  });
  frameUtils.setFramePosition({
    container: shapePathContainer,
    x: layer.frame.x,
    y: layer.frame.y
  });
  frameUtils.setFrameRotation({
    container: shapePathContainer,
    rotation: layer.rotation
  });
  frameUtils.setFrameScale({
    container: shapePathContainer,
    isFlippedVertical: layer.isFlippedVertical,
    isFlippedHorizontal: layer.isFlippedHorizontal
  });
  return shapePathContainer;
};

export default renderShapePath;