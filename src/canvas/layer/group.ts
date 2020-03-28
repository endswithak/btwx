import paper, { Group, Rectangle, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from '../layers';

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

const renderGroup = ({ layer, container, symbols, images, path, groupShadows, overrides, symbolPath }: RenderGroup): paper.Group => {
  const groupContainer = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container
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
  groupContainer.position.x += layer.frame.x;
  groupContainer.position.y += layer.frame.y;
  return groupContainer;
};

export default renderGroup;