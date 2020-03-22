import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayer from './layer';

interface RenderLayers {
  layers: FileFormat.AnyLayer[];
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[] | null;
  overrides?: FileFormat.OverrideValue[];
}

const renderLayers = ({ layers, container, symbols, overrides }: RenderLayers): void => {
  layers.forEach((layer) => {
    renderLayer({
      layer: layer,
      container: container,
      symbols: symbols,
      overrides: overrides
    });
  });
};

export default renderLayers;