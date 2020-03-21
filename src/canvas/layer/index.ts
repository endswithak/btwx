import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderShapePath from './shapePath';
import renderShapeGroup from './shapeGroup';

interface RenderLayer {
  layer: FileFormat.AnyLayer;
  container: paper.Group;
}

const renderLayer = async ({ layer, container }: RenderLayer): Promise<paper.Layer> => {
  switch(layer._class) {
    case 'shapePath':
    case 'rectangle':
    case 'triangle':
    case 'star':
    case 'polygon':
    case 'oval':
      await renderShapePath({
        layer: layer as FileFormat.ShapePath,
        container: container
      });
      break;
    case 'shapeGroup':
      await renderShapeGroup({
        layer: layer as FileFormat.ShapeGroup,
        container: container
      });
      break;
    case 'symbolInstance':
      return;
  }
};

export default renderLayer;