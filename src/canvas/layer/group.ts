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
  overrides?: FileFormat.OverrideValue[];
}

const renderGroup = ({ layer, container, symbols, images, overrides }: RenderGroup): paper.Group => {
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
    overrides: overrides
  });
  groupLayer.position.x += layer.frame.x;
  groupLayer.position.y += layer.frame.y;
  return groupLayer;
};

export default renderGroup;