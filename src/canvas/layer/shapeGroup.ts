import paper, { Layer, Rectangle, Point, Group, CompoundPath, Path, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { applyBooleanOperation, drawLayerPath } from './utils';

interface RenderShapeGroupLayer {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon;
  container: paper.Layer;
  shape: {
    name: string | null;
    id: string | null;
    offset: {x: number; y: number};
  };
  path: paper.PathItem | null;
}

const renderShapeGroupLayer = ({ layer, container, shape, path }: RenderShapeGroupLayer): paper.PathItem => {
  const layerPath = drawLayerPath({layer});
  layerPath.name = layer.do_objectID;
  layerPath.data.name = layer.name;
  layerPath.visible = layer.isVisible;
  layerPath.locked = layer.isLocked;
  layerPath.parent = container;
  layerPath.position.x += (layer.frame.x + shape.offset.x);
  layerPath.position.y += (layer.frame.y + shape.offset.y);
  layerPath.closed = layer.isClosed;
  if (path) {
    const boolResult = applyBooleanOperation({a: path, b: layerPath, operation: layer.booleanOperation});
    if (shape.name) {
      boolResult.name = shape.id;
      boolResult.data.name = shape.name;
    }
    return boolResult;
  } else {
    return layerPath;
  }
};

interface RenderShapeGroupLayers {
  layer: FileFormat.ShapeGroup;
  container: paper.Layer;
  shape: {
    name: string | null;
    id: string | null;
    offset: {x: number; y: number};
  };
  path?: paper.PathItem | null;
}

const renderShapeGroupLayers = ({ layer, container, shape, path }: RenderShapeGroupLayers): paper.PathItem => {
  layer.layers.forEach((shapeGroupLayer) => {
    if (shapeGroupLayer._class === 'shapeGroup') {
      path = renderShapeGroupLayers({
        layer: shapeGroupLayer,
        container: container,
        shape: {
          name: shapeGroupLayer.name,
          id: shapeGroupLayer.do_objectID,
          offset: {x: shape.offset.x + shapeGroupLayer.frame.x, y: shape.offset.y + shapeGroupLayer.frame.y}
        },
        path: path
      });
    } else {
      path = renderShapeGroupLayer({
        layer: shapeGroupLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon,
        container: container,
        shape: shape,
        path: path
      });
    }
  });
  return path;
};

interface RenderShapeGroup {
  layer: FileFormat.ShapeGroup;
  container: paper.Group;
}

const renderShapeGroup = async ({ layer, container }: RenderShapeGroup): Promise<paper.Layer> => {
  const shape = new Layer();
  shape.name = layer.do_objectID;
  shape.data.name = layer.name;
  const compoundShapePath = renderShapeGroupLayers({
    layer: layer,
    container: shape,
    shape: {
      name: null,
      id: null,
      offset: {
        x: layer.frame.x,
        y: layer.frame.y
      }
    }
  });
  //shape.addChild(compoundShapePath);
  shape.lastChild.fillColor = Color.random();
  //shapePath.fillColor = 'black';
  console.log(shape);
  container.addChild(shape);
  return shape;
};

// interface RenderShapeGroupLayer {
//   layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon;
//   container: paper.Layer;
//   offset: {x: number; y: number};
// }

// const renderShapeGroupLayer = ({ layer, container, offset }: RenderShapeGroupLayer): void => {
//   const layerPath = drawLayerPath({layer});
//   layerPath.visible = layer.isVisible;
//   layerPath.locked = layer.isLocked;
//   layerPath.parent = container;
//   layerPath.position.x += (layer.frame.x + offset.x);
//   layerPath.position.y += (layer.frame.y + offset.y);
//   layerPath.closed = layer.isClosed;
//   if (container.children.length > 1) {
//     applyBooleanOperation({a: container.children[container.children.length - 2], b: layerPath, operation: layer.booleanOperation});
//   }
// };

// interface RenderShapeGroupLayers {
//   layer: FileFormat.ShapeGroup;
//   container: paper.Layer;
//   offset: {x: number; y: number};
// }

// const renderShapeGroupLayers = ({ layer, container, offset }: RenderShapeGroupLayers): void => {
//   layer.layers.forEach((shapeGroupLayer) => {
//     if (shapeGroupLayer._class === 'shapeGroup') {
//       renderShapeGroupLayers({
//         layer: shapeGroupLayer,
//         container: container,
//         offset: {x: offset.x + shapeGroupLayer.frame.x, y: offset.y + shapeGroupLayer.frame.y},
//       });
//     } else {
//       renderShapeGroupLayer({
//         layer: shapeGroupLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon,
//         container: container,
//         offset: offset,
//       });
//     }
//   });
// };

// interface RenderShapeGroup {
//   layer: FileFormat.ShapeGroup;
//   container: paper.Group;
// }

// const renderShapeGroup = async ({ layer, container }: RenderShapeGroup): Promise<paper.Layer> => {
//   const shape = new Layer();
//   renderShapeGroupLayers({layer: layer, container: shape, offset: {x: layer.frame.x, y: layer.frame.y}});
//   shape.lastChild.fillColor = 'black';
//   console.log(shape);
//   container.addChild(shape);
//   return shape;
// };

export default renderShapeGroup;