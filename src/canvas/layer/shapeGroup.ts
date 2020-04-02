import paper, { Layer, Group } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import {
  shapeGroupUtils,
  fillUtils,
  borderUtils,
  shadowUtils,
  innerShadowUtils,
  contextUtils,
  frameUtils
} from './utils';

interface RenderShape {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  dispatch: any;
  path: string;
  groupShadows?: FileFormat.Shadow[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderShape = ({ layer, container, images, dispatch, path, groupShadows }: RenderShape): paper.Layer => {
  const shapeContainer = new Layer({
    parent: container,
    name: layer.do_objectID,
    data: {
      name: layer.name,
      type: 'shapeGroup',
      path: path,
      frame: layer.frame
    },
    visible: layer.isVisible,
    locked: layer.isLocked,
    blendMode: contextUtils.getBlendMode({
      blendMode: layer.style.contextSettings.blendMode
    }),
    opacity: layer.style.contextSettings.opacity,
    applyMatrix: false
  });
  const shapeLayers = new Group({
    name: 'layers',
    container: shapeContainer
  });
  shapeGroupUtils.renderShapeGroupLayers({
    layer: layer,
    container: shapeLayers
  });
  const shapePath = shapeLayers.lastChild as paper.Path | paper.CompoundPath;
  shadowUtils.renderShadows({
    shapePath: shapePath,
    shadows: groupShadows ? [...groupShadows, ...layer.style.shadows] : layer.style.shadows,
    container: shapeContainer
  });
  fillUtils.renderFills({
    shapePath: shapePath,
    fills: layer.style.fills,
    images: images,
    container: shapeContainer
  });
  innerShadowUtils.renderInnerShadows({
    shapePath: shapePath,
    innerShadows: layer.style.innerShadows,
    container: shapeContainer
  });
  borderUtils.renderBorders({
    shapePath: shapePath,
    borders: layer.style.borders,
    borderOptions: layer.style.borderOptions,
    container: shapeContainer
  });
  frameUtils.setFramePosition({
    container: shapeContainer,
    x: layer.frame.x,
    y: layer.frame.y
  });
  frameUtils.setFrameRotation({
    container: shapeContainer,
    rotation: layer.rotation
  });
  frameUtils.setFrameScale({
    container: shapeContainer,
    isFlippedVertical: layer.isFlippedVertical,
    isFlippedHorizontal: layer.isFlippedHorizontal
  });
  return shapeContainer;
};

export default renderShape;