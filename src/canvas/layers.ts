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
  path?: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderLayers = ({ layers, container, symbols, images, path, overrides, symbolPath }: RenderLayers): void => {
  layers.forEach((layer) => {
    renderLayer({
      layer: layer,
      container: container,
      symbols: symbols,
      images: images,
      path: path,
      overrides: overrides,
      symbolPath: symbolPath
    });
  });
};

export default renderLayers;