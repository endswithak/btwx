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
  path: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderSymbolInstance = ({ layer, container, symbols, images, path, overrides, symbolPath }: RenderSymbolInstance): paper.Group => {
  const symbol = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const master = symbolUtils.getSymbolMaster({
    symbolId: layer.symbolID,
    symbols: symbols,
    overrides: overrides,
    symbolPath: symbolPath
  });
  if (master) {
    renderLayers({
      layers: master.layers,
      container: symbol,
      symbols: symbols,
      images: images,
      path: path,
      overrides: overrides,
      symbolPath: symbolPath
    });
  }
  symbol.position.x += layer.frame.x;
  symbol.position.y += layer.frame.y;
  return symbol;
};

export default renderSymbolInstance;