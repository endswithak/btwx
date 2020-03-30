import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayer from './layer';

interface RenderLayers {
  layers: FileFormat.AnyLayer[];
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[] | null;
  images: {
    [id: string]: string;
  };
  groupShadows?: FileFormat.Shadow[];
  path?: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderLayers = ({ layers, container, symbols, images, groupShadows, path, overrides, symbolPath }: RenderLayers): void => {
  layers.forEach((layer) => {
    renderLayer({
      layer: layer,
      container: container,
      symbols: symbols,
      images: images,
      groupShadows: groupShadows,
      path: path,
      overrides: overrides,
      symbolPath: symbolPath,
    });
  });
};

export default renderLayers;