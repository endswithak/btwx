import paper, { Layer, Shape, Color, Path } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from '../layers';
import { contextUtils, frameUtils } from './utils';

interface RenderGroup {
  layer: FileFormat.Group;
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[] | null;
  images: {
    [id: string]: string;
  };
  path: string;
  groupShadows?: FileFormat.Shadow[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderGroup = ({ layer, container, symbols, images, path, groupShadows, overrides, symbolPath }: RenderGroup): paper.Layer => {
  const groupContainer = new Layer({
    name: layer.do_objectID,
    data: {
      name: layer.name,
      type: 'group',
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
  renderLayers({
    layers: layer.layers,
    container: groupContainer,
    symbols: symbols,
    images: images,
    path: path,
    groupShadows: groupShadows,
    overrides: overrides,
    symbolPath: symbolPath
  });
  frameUtils.renderSelectionFrame({
    shapePath: new Path.Rectangle({
      size: [layer.frame.width, layer.frame.height],
      fillColor: new Color(255,255,255,0)
    }),
    container: groupContainer
  });
  frameUtils.setFramePosition({
    container: groupContainer,
    x: layer.frame.x,
    y: layer.frame.y
  });
  frameUtils.setFrameRotation({
    container: groupContainer,
    rotation: layer.rotation
  });
  frameUtils.setFrameScale({
    container: groupContainer,
    isFlippedVertical: layer.isFlippedVertical,
    isFlippedHorizontal: layer.isFlippedHorizontal
  });
  return groupContainer;
};

export default renderGroup;