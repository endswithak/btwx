import paper, { Group, Rectangle, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from '../layers';

interface RenderGroup {
  layer: FileFormat.Group;
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[] | null;
  overrides?: FileFormat.OverrideValue[];
}

const renderGroup = ({ layer, container, symbols, overrides }: RenderGroup): paper.Group => {
  const groupLayer = new Group();
  groupLayer.name = layer.do_objectID;
  groupLayer.data.name = layer.name;
  groupLayer.visible = layer.isVisible;
  groupLayer.locked = layer.isLocked;
  groupLayer.parent = container;
  renderLayers({
    layers: layer.layers,
    container: groupLayer,
    symbols: symbols,
    overrides: overrides
  });
  groupLayer.position.x += layer.frame.x;
  groupLayer.position.y += layer.frame.y;
  return groupLayer;
};

export default renderGroup;