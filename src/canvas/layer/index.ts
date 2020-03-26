import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderShapePath from './shapePath';
import renderShapeGroup from './shapeGroup';
import renderGroup from './group';
import renderSymbolInstance from './symbolInstance';
import renderText from './text';
import renderImage from './image';

interface RenderLayer {
  layer: FileFormat.AnyLayer;
  container: paper.Group;
  symbols: FileFormat.SymbolMaster[] | null;
  images: {
    [id: string]: string;
  };
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderLayer = ({ layer, container, symbols, images, overrides, symbolPath }: RenderLayer): void => {
  switch(layer._class) {
    case 'shapePath':
    case 'rectangle':
    case 'triangle':
    case 'star':
    case 'polygon':
    case 'oval':
      renderShapePath({
        layer: layer as FileFormat.ShapePath,
        container: container,
        images: images
      });
      break;
    case 'shapeGroup':
      renderShapeGroup({
        layer: layer as FileFormat.ShapeGroup,
        container: container
      });
      break;
    case 'group':
      renderGroup({
        layer: layer as FileFormat.Group,
        container: container,
        symbols: symbols,
        images: images,
        overrides: overrides,
        symbolPath: symbolPath
      });
      break;
    case 'symbolInstance':
      renderSymbolInstance({
        layer: layer,
        container: container,
        symbols: symbols,
        images: images,
        overrides: overrides,
        symbolPath: symbolPath
      });
      break;
    case 'text':
      renderText({
        layer: layer,
        container: container,
        overrides: overrides,
        symbolPath: symbolPath
      });
      break;
    case 'bitmap':
      renderImage({
        layer: layer,
        container: container,
        images: images,
        overrides: overrides,
        symbolPath: symbolPath
      });
      break;
    default:
      throw Error(`Unknown layer type ${layer._class}`);
  }
};

export default renderLayer;