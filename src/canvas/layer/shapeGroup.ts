import paper, { Layer, Rectangle, Point, Group, CompoundPath, Path, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { shapePathUtils, shapeGroupUtils, fillUtils, borderUtils } from './utils';

interface RenderShapeGroupLayer {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon;
  container: paper.Layer;
}

const renderShapeGroupLayer = ({ layer, container }: RenderShapeGroupLayer): void => {
  const layerPath = shapePathUtils.drawShapePath({
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
    const boolResult = shapeGroupUtils.applyBooleanOperation({
      a: shapeGroupUtils.getNestedPathItem({layer: prevBoolResult as paper.Layer}) as paper.PathItem,
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
    const boolResult = shapeGroupUtils.applyBooleanOperation({
      a: shapeGroupUtils.getNestedPathItem({layer: container.children[container.children.length - 2] as paper.PathItem}) as paper.PathItem,
      b: shapeGroupUtils.getNestedPathItem({layer: shape as paper.Layer}) as paper.PathItem,
      operation: layer.booleanOperation
    });
    boolResult.parent = container;
  }
  return shape;
};

interface RenderShape {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  path: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderShape = ({ layer, container, images, path }: RenderShape): paper.Layer => {
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
  const shapePath = shape.lastChild as paper.Path | paper.CompoundPath;
  fillUtils.renderFills({
    shapePath: shapePath,
    fills: layer.style.fills,
    images: images,
    container: shape
  });
  borderUtils.renderBorders({
    shapePath: shapePath,
    borders: layer.style.borders,
    borderOptions: layer.style.borderOptions,
    container: shape
  });
  shape.position.x += layer.frame.x;
  shape.position.y += layer.frame.y;
  return shape;
};

export default renderShape;