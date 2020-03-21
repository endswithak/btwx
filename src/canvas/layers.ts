import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayer from './layer';

interface RenderLayers {
  layers: FileFormat.AnyLayer[];
  container: paper.Group;
}

const renderLayers = async ({ layers, container }: RenderLayers): Promise<void> => {
  const layerPromises: Promise<any>[] = [];
  layers.forEach((layer) => {
    layerPromises.push(renderLayer({
      layer: layer,
      container: container
    }));
  });
  await Promise.all(layerPromises);
};

export default renderLayers;