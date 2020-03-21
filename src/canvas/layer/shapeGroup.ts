import paper, { Layer, Rectangle, Point, Group, CompoundPath, Path, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { applyBooleanOperation, drawLayerPath } from './utils';

interface RenderShapeGroupLayer {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon;
  container: paper.Layer;
  offset: {x: number; y: number};
}

const renderShapeGroupLayer = ({ layer, container, offset }: RenderShapeGroupLayer): void => {
  const layerPath = drawLayerPath({layer});
  layerPath.visible = layer.isVisible;
  layerPath.locked = layer.isLocked;
  layerPath.parent = container;
  layerPath.position.x += (layer.frame.x + offset.x);
  layerPath.position.y += (layer.frame.y + offset.y);
  layerPath.closed = layer.isClosed;
  if (container.children.length > 1) {
    applyBooleanOperation({a: container.children[container.children.length - 2], b: layerPath, operation: layer.booleanOperation});
  }
};

interface RenderShapeGroupLayers {
  layer: FileFormat.ShapeGroup;
  container: paper.Layer;
  offset: {x: number; y: number};
}

const renderShapeGroupLayers = ({ layer, container, offset }: RenderShapeGroupLayers): void => {
  layer.layers.forEach((shapeGroupLayer) => {
    if (shapeGroupLayer._class === 'shapeGroup') {
      renderShapeGroupLayers({
        layer: shapeGroupLayer,
        container: container,
        offset: {x: offset.x + shapeGroupLayer.frame.x, y: offset.y + shapeGroupLayer.frame.y},
      });
    } else {
      renderShapeGroupLayer({
        layer: shapeGroupLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon,
        container: container,
        offset: offset,
      });
    }
  });
};

interface RenderShapeGroup {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
}

const renderShapeGroup = async ({ layer, container }: RenderShapeGroup): Promise<paper.Layer> => {
  const shape = new Layer();
  renderShapeGroupLayers({layer: layer, container: shape, offset: {x: layer.frame.x, y: layer.frame.y}});
  shape.lastChild.fillColor = 'red';
  console.log(shape);
  container.addChild(shape);
  return shape;
};

export default renderShapeGroup;