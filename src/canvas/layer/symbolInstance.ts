import paper, { Group, Layer, Rectangle, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getSymbolMaster } from './utils';
import renderLayers from '../layers';

interface RenderSymbolInstance {
  layer: FileFormat.SymbolInstance;
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[];
  overrides?: FileFormat.OverrideValue[];
}

const renderSymbolInstance = ({ layer, container, symbols, overrides }: RenderSymbolInstance): paper.Group => {
  const symbol = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const symboleOverrides = overrides ? [...overrides, ...layer.overrideValues] : layer.overrideValues;
  const master = getSymbolMaster({
    instanceId: layer.do_objectID,
    symbolId: layer.symbolID,
    symbols: symbols,
    overrides: symboleOverrides
  });
  if (master) {
    renderLayers({
      layers: master.layers,
      container: symbol,
      symbols: symbols,
      overrides: symboleOverrides
    });
  }
  symbol.position.x += layer.frame.x;
  symbol.position.y += layer.frame.y;
  return symbol;
};

export default renderSymbolInstance;