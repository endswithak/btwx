import paper, { Layer, Rectangle, Point, Group, CompoundPath, Path, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { applyBooleanOperation, drawLayerPath, getNestedPathItem } from './utils';

interface RenderShapeGroupLayer {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon;
  container: paper.Layer;
}

const renderShapeGroupLayer = ({ layer, container }: RenderShapeGroupLayer): void => {
  const layerPath = drawLayerPath({
    layer: layer,
    opts: {
      name: layer.do_objectID,
      data: { name: layer.name },
      visible: layer.isVisible,
      locked: layer.isLocked,
      closed: layer.isClosed,
      parent: container
    }
  });
  layerPath.position.x += layer.frame.x;
  layerPath.position.y += layer.frame.y;
  if (container.children.length > 1) {
    const prevBoolResult = container.children[container.children.length - 2];
    const boolResult = applyBooleanOperation({
      a: getNestedPathItem({layer: prevBoolResult as paper.Layer}) as paper.PathItem,
      b: layerPath,
      operation: layer.booleanOperation
    });
    if (prevBoolResult.className === 'Layer') {
      boolResult.parent = container;
    }
  }
};

interface RenderShapeGroupLayers {
  layer: FileFormat.ShapeGroup;
  container: paper.Layer;
}

const renderShapeGroupLayers = ({ layer, container }: RenderShapeGroupLayers): void => {
  layer.layers.forEach((shapeGroupLayer) => {
    switch(shapeGroupLayer._class) {
      case 'shapeGroup':
        renderShapeGroup({
          layer: shapeGroupLayer,
          container: container
        });
        break;
      case 'shapePath':
      case 'rectangle':
      case 'triangle':
      case 'star':
      case 'polygon':
      case 'oval':
        renderShapeGroupLayer({
          layer: shapeGroupLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon,
          container: container,
        });
        break;
      default:
        throw new Error('Unknown layer type');
    }
  });
};

interface RenderShapeGroup {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
}

const renderShapeGroup = ({ layer, container }: RenderShapeGroup): paper.Layer => {
  const shape = new Layer({
    parent: container,
    name: layer.do_objectID,
    data: { name: layer.name },
    visible: layer.isVisible,
    locked: layer.isLocked
  });
  renderShapeGroupLayers({
    layer: layer,
    container: shape
  });
  shape.position.x += layer.frame.x;
  shape.position.y += layer.frame.y;
  if (container.children.length > 1) {
    const boolResult = applyBooleanOperation({
      a: getNestedPathItem({layer: container.children[container.children.length - 2] as paper.PathItem}) as paper.PathItem,
      b: getNestedPathItem({layer: shape as paper.Layer}) as paper.PathItem,
      operation: layer.booleanOperation
    });
    boolResult.parent = container;
  }
  return shape;
};

interface RenderShape {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
}

const renderShape = ({ layer, container }: RenderShape): paper.Layer => {
  const shape = new Layer({
    parent: container,
    name: layer.do_objectID,
    data: { name: layer.name },
    visible: layer.isVisible,
    locked: layer.isLocked
  });
  renderShapeGroupLayers({
    layer: layer,
    container: shape
  });
  shape.position.x += layer.frame.x;
  shape.position.y += layer.frame.y;
  shape.lastChild.fillColor = Color.random();
  shape.lastChild.strokeWidth = 2;
  shape.lastChild.strokeColor = Color.random();
  return shape;
};

export default renderShape;