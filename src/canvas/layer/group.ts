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
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderGroup = ({ layer, container, symbols, images, path, overrides, symbolPath }: RenderGroup): paper.Group => {
  const groupLayer = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container
  });
  renderLayers({
    layers: layer.layers,
    container: groupLayer,
    symbols: symbols,
    images: images,
    path: path,
    overrides: overrides,
    symbolPath: symbolPath
  });
  groupLayer.position.x += layer.frame.x;
  groupLayer.position.y += layer.frame.y;
  return groupLayer;
};

export default renderGroup;