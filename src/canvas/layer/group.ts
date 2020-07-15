// import paper, { Group, Shape, Color, Path } from 'paper';
// import FileFormat from '@sketch-hq/sketch-file-format-ts';
// import renderLayers from '../layers';
// import { contextUtils, frameUtils } from './utils';

// interface RenderGroup {
//   layer: FileFormat.Group;
//   container: paper.Group;
//   symbols: FileFormat.SymbolMaster[] | null;
//   images: {
//     [id: string]: string;
//   };
//   dispatch: any;
//   path: string;
//   groupShadows?: FileFormat.Shadow[];
//   overrides?: FileFormat.OverrideValue[];
//   symbolPath?: string;
// }

// const renderGroup = ({ layer, container, symbols, images, dispatch, path, groupShadows, overrides, symbolPath }: RenderGroup): paper.Group => {
//   const groupContainer = new Group({
//     parent: container,
//     name: layer.name,
//     data: {
//       frame: {
//         width: layer.frame.width,
//         height: layer.frame.height,
//       },
//       sketch: {
//         name: layer.name,
//         id: layer.do_objectID,
//         type: 'group',
//         frame: layer.frame
//       },
//       path: path
//     },
//     locked: layer.isLocked,
//     visible: layer.isVisible,
//     clipMask: layer.hasClippingMask,
//     blendMode: contextUtils.getBlendMode({
//       blendMode: layer.style.contextSettings.blendMode
//     }),
//     opacity: layer.style.contextSettings.opacity,
//     applyMatrix: false
//   });
//   renderLayers({
//     layers: layer.layers,
//     container: groupContainer,
//     symbols: symbols,
//     images: images,
//     dispatch: dispatch,
//     path: path,
//     groupShadows: groupShadows,
//     overrides: overrides,
//     symbolPath: symbolPath
//   });
//   frameUtils.setFramePosition({
//     container: groupContainer,
//     x: layer.frame.x,
//     y: layer.frame.y
//   });
//   frameUtils.setFrameRotation({
//     container: groupContainer,
//     rotation: layer.rotation
//   });
//   frameUtils.setFrameScale({
//     container: groupContainer,
//     isFlippedVertical: layer.isFlippedVertical,
//     isFlippedHorizontal: layer.isFlippedHorizontal
//   });
//   return groupContainer;
// };

// export default renderGroup;