import paper, { Group, Layer } from 'paper';
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
  groupShadows?: FileFormat.Shadow[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderSymbolInstance = ({ layer, container, symbols, images, path, groupShadows, overrides, symbolPath }: RenderSymbolInstance): paper.Layer => {
  const symbolContainer = new Layer({
    name: layer.do_objectID,
    data: {
      name: layer.name,
      path: path
    },
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
      container: symbolContainer,
      symbols: symbols,
      images: images,
      path: path,
      groupShadows: groupShadows,
      overrides: overrides,
      symbolPath: symbolPath,
    });
  }
  symbolContainer.position.x += layer.frame.x;
  symbolContainer.position.y += layer.frame.y;
  return symbolContainer;
};

export default renderSymbolInstance;