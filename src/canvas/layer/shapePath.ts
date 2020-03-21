import paper, { Layer, Rectangle, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { drawLayerPath } from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
}

const renderShapePath = async ({ layer, container }: RenderShapePath): Promise<paper.Layer> => {
  const shapePath = new Layer();
  shapePath.name = layer.do_objectID;
  shapePath.data.name = layer.name;
  shapePath.visible = layer.isVisible;
  shapePath.locked = layer.isLocked;
  shapePath.parent = container;
  const layerPath = drawLayerPath({layer});
  layerPath.parent = shapePath;
  layerPath.closed = layer.isClosed;
  layerPath.fillColor = Color.random();
  layerPath.parent = shapePath;
  shapePath.position.x += layer.frame.x;
  shapePath.position.y += layer.frame.y;
  return shapePath;
};

export default renderShapePath;