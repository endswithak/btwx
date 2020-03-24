import paper, { Group } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from '../layers';
import { symbolUtils } from './utils';

interface RenderSymbolInstance {
  layer: FileFormat.SymbolInstance;
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[];
  images: {
    [id: string]: string;
  };
  overrides?: FileFormat.OverrideValue[];
}

const renderSymbolInstance = ({ layer, container, symbols, images, overrides }: RenderSymbolInstance): paper.Group => {
  const symbol = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const symboleOverrides = overrides ? [...overrides, ...layer.overrideValues] : layer.overrideValues;
  const master = symbolUtils.getSymbolMaster({
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
      images: images,
      overrides: symboleOverrides
    });
  }
  symbol.position.x += layer.frame.x;
  symbol.position.y += layer.frame.y;
  return symbol;
};

export default renderSymbolInstance;