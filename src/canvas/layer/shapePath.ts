import paper, { Layer, Rectangle, Point } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { drawLayerPath } from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
}

const renderShapePath = async ({ layer, container }: RenderShapePath): Promise<paper.Layer> => {
  const shapePath = new Layer();
  const layerPath = await drawLayerPath({layer});
  shapePath.visible = layer.isVisible;
  shapePath.locked = layer.isLocked;
  layerPath.closed = layer.isClosed;
  layerPath.fillColor = '#000000';
  shapePath.addChild(layerPath);
  container.addChild(shapePath);
  shapePath.position.x += layer.frame.x;
  shapePath.position.y += layer.frame.y;
  return shapePath;
};

// const renderShapePath = async ({ layer, container }: RenderShapePath): Promise<paper.Layer> => {
//   const shapePath = await drawLayerPath({layer});
//   shapePath.visible = layer.isVisible;
//   shapePath.locked = layer.isLocked;
//   shapePath.position.x += layer.frame.x;
//   shapePath.position.y += layer.frame.y;
//   shapePath.closed = layer.isClosed;
//   shapePath.fillColor = '#000000';
//   //container.addChild(shapePath);
//   return shapePath;
// };

export default renderShapePath;