/* eslint-disable @typescript-eslint/no-use-before-define */
import { paperMain } from '../../';

interface ApplyBooleanOperation {
  operation: any;
  a: paper.PathItem;
  b: paper.PathItem;
  insert?: boolean;
}

export const applyBooleanOperation = ({ a, b, operation }: ApplyBooleanOperation): paper.PathItem => {
  switch(operation) {
    case 'normal':
      return b;
    case 'unite':
      return a.unite(b);
    case 'subtract':
      return a.subtract(b);
    case 'intersect':
      return a.intersect(b);
    case 'exclude':
      return a.exclude(b);
  }
};

export const getNestedPath = (layer: any): paper.PathItem => {
  if (layer) {
    switch(layer.className) {
      case 'Path':
      case 'CompoundPath':
        return layer as paper.PathItem;
      case 'Layer': {
        if (layer.children.length > 0) {
          let lastChild = layer.lastChild;
          while(lastChild.className === 'Layer') {
            lastChild = lastChild.lastChild;
          }
          return lastChild as paper.PathItem;
        } else {
          return null;
        }
      }
    }
  } else {
    return null;
  }
};

export const renderShapeGroup = (layer: any): any => {
  const shapeContainer = new paperMain.Layer({insert: false});
  const boolResult = layer.layers.reduce((result: any, current: any) => {
    let nextBoolLayer;
    switch(current.type) {
      case 'Shape':
        nextBoolLayer = getNestedPath(renderShapeGroup(current));
        break;
      case 'ShapePath':
        nextBoolLayer = new paperMain.CompoundPath({
          pathData: current.pathData,
          fillColor: 'red',
          closed: current.closed,
          windingRule: 'evenodd',
          insert: false
        });
        break;
    }
    if (result === null) {
      if (nextBoolLayer) {
        result = nextBoolLayer;
      }
    } else {
      if (nextBoolLayer) {
        result = applyBooleanOperation({
          a: result,
          b: nextBoolLayer,
          operation: current.booleanOperation,
        });
      }
    }
    return result;
  }, null);
  if (boolResult) {
    boolResult.parent = shapeContainer;
  }
  shapeContainer.position.x += layer.frame.x;
  shapeContainer.position.y += layer.frame.y;
  shapeContainer.rotation = layer.transform.rotation;
  shapeContainer.scale(layer.transform.flippedHorizontally ? -1 : 1, layer.transform.flippedVertically ? -1 : 1);
  return shapeContainer;
};

// interface GetNestedPathItem {
//   layer: paper.PathItem | paper.Layer;
// }

// export const getNestedPathItem = ({ layer }: GetNestedPathItem): paper.PathItem => {
//   switch(layer.className) {
//     case 'Path':
//     case 'CompoundPath':
//       return layer as paper.PathItem;
//     case 'Layer': {
//       let lastChild = layer.lastChild;
//       while(lastChild.className === 'Layer') {
//         lastChild = lastChild.lastChild;
//       }
//       return lastChild as paper.PathItem;
//     }
//   }
// };

// interface RenderShapeGroupLayer {
//   layer: any;
//   container: paper.Layer | paper.Group;
// }

// const renderShapeGroupLayer = ({ layer, container }: RenderShapeGroupLayer): void => {
//   const layerPath = new paperMain.CompoundPath({
//     pathData: layer.pathData,
//     parent: container,
//     fillColor: 'red',
//     closed: layer.closed,
//     windingRule: 'evenodd'
//   });
//   // layerPath.position.x += layer.frame.x;
//   // layerPath.position.y += layer.frame.y;
//   // layerPath.rotation = layer.transform.rotation * -1;
//   // layerPath.scale(layer.transform.flippedHorizontally ? -1 : 1, layer.transform.flippedVertically ? -1 : 1);
//   if (container.children.length > 1) {
//     const prevBoolResult = container.children[container.children.length - 2];
//     const boolResult = applyBooleanOperation({
//       a: getNestedPathItem({layer: prevBoolResult as paper.Layer}) as paper.PathItem,
//       b: layerPath,
//       operation: layer.booleanOperation,
//     });
//     if (prevBoolResult.className === 'Layer') {
//       boolResult.parent = container;
//     }
//   }
// };

// interface RenderShapeGroupLayers {
//   layer: any;
//   container: paper.Layer | paper.Group;
// }

// export const renderShapeGroupLayers = ({ layer, container }: RenderShapeGroupLayers): void => {
//   layer.layers.forEach((shapeGroupLayer) => {
//     switch(shapeGroupLayer.type) {
//       case 'Shape':
//         renderShapeGroup({
//           layer: shapeGroupLayer,
//           container: container
//         });
//         break;
//       case 'ShapePath':
//         renderShapeGroupLayer({
//           layer: shapeGroupLayer,
//           container: container,
//         });
//         break;
//       default:
//         throw new Error('Unknown layer type');
//     }
//   });
// };

// interface RenderShapeGroup {
//   layer: any;
//   container: paper.Group;
// }

// const renderShapeGroup = ({ layer, container }: RenderShapeGroup): paper.Layer => {
//   const shape = new paperMain.Layer({
//     parent: container,
//   });
//   renderShapeGroupLayers({
//     layer: layer,
//     container: shape
//   });
//   // shape.position.x += layer.frame.x;
//   // shape.position.y += layer.frame.y;
//   shape.rotation = layer.transform.rotation * -1;
//   shape.scale(layer.transform.flippedHorizontally ? -1 : 1, layer.transform.flippedVertically ? -1 : 1);
//   if (container.children.length > 1) {
//     const boolResult = applyBooleanOperation({
//       a: getNestedPathItem({layer: container.children[container.children.length - 2] as paper.PathItem}) as paper.PathItem,
//       b: getNestedPathItem({layer: shape as paper.Layer}) as paper.PathItem,
//       operation: layer.name
//     });
//     boolResult.parent = container;
//   }
//   return shape;
// };