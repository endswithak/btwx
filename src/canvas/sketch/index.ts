/* eslint-disable @typescript-eslint/no-use-before-define */
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { paperMain } from '../';
import store from '../../store';
import { addLayers } from '../../store/actions/layer';
import { convertPoints, drawShapePath } from './utils/shapePath';
import { getCurvePoints } from '../../store/selectors/layer';
import { renderShapeGroupLayers } from './utils/shapeGroup';
import { convertPosition, convertFill, convertStroke, convertShadow, convertStrokeOptions, convertBlendMode, convertWindingRule } from './utils/general';

interface ConvertLayers {
  sketchLayers: FileFormat.AnyLayer[];
  parentId: string;
  parentFrame: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  images: Buffer[];
  symbolMasters: FileFormat.SymbolMaster[];
}

export const convertLayers = ({ sketchLayers, parentId, parentFrame, images, symbolMasters }: ConvertLayers) => {
  let layers: em.Layer[] = [];
  sketchLayers.forEach((sketchLayer) => {
    layers = [...layers, ...convertLayer({sketchLayer, parentId, parentFrame, images, symbolMasters}) as em.Layer[]];
  });
  return layers;
}

interface ConvertLayer {
  sketchLayer: FileFormat.AnyLayer;
  parentId: string;
  parentFrame: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  images: Buffer[];
  symbolMasters: FileFormat.SymbolMaster[];
}

export const convertLayer = ({ sketchLayer, parentId, parentFrame, images, symbolMasters }: ConvertLayer): em.Layer | em.Layer[] => {
  const position = convertPosition(sketchLayer);
  const viewCenter = paperMain.view.center;
  switch(sketchLayer._class) {
    case 'artboard': {
      return [
        {
          id: sketchLayer.do_objectID,
          type: 'Artboard',
          name: sketchLayer.name,
          parent: parentId,
          frame: {
            x: viewCenter.x + (parentFrame.x - (parentFrame.width / 2)),
            y: viewCenter.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          }
        },
        ...convertLayers({
          sketchLayers: sketchLayer.layers,
          parentId: sketchLayer.do_objectID,
          parentFrame: {
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            x: viewCenter.x + (parentFrame.x - (parentFrame.width / 2)),
            y: viewCenter.y + (parentFrame.y - (parentFrame.height / 2)),
          },
          images,
          symbolMasters
        })
      ] as em.Layer[];
    }
    case 'shapePath':
    case 'rectangle':
    case 'triangle':
    case 'star':
    case 'polygon':
    case 'oval': {
      const shape = drawShapePath({
        layer: sketchLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval,
        opts: {
          closed: sketchLayer.isClosed,
          windingRule: convertWindingRule(sketchLayer.style.windingRule),
          insert: false
        }
      });
      return [
        {
          id: sketchLayer.do_objectID,
          type: 'Shape',
          shapeType: 'Custom',
          name: sketchLayer.name,
          parent: parentId,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          path: {
            points: null,
            closed: sketchLayer.isClosed,
            data: shape.pathData
          },
          style: {
            fill: convertFill(sketchLayer),
            stroke: convertStroke(sketchLayer),
            strokeOptions: convertStrokeOptions(sketchLayer),
            shadow: convertShadow(sketchLayer),
            blendMode: convertBlendMode(sketchLayer),
            opacity: sketchLayer.style.contextSettings.opacity
          }
        } as em.Shape
      ];
    }
    case 'shapeGroup': {
      const shapeContainer = new paperMain.Group({ insert: false });
      renderShapeGroupLayers({layer: sketchLayer, container: shapeContainer});
      const shapePath = shapeContainer.lastChild as paper.Path | paper.CompoundPath;
      const pathData = shapePath.pathData;
      shapeContainer.remove();
      return [
        {
          id: sketchLayer.do_objectID,
          type: 'Shape',
          shapeType: 'Custom',
          name: sketchLayer.name,
          parent: parentId,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          path: {
            points: null,
            closed: shapePath.closed,
            data: pathData
          },
          style: {
            fill: convertFill(sketchLayer),
            stroke: convertStroke(sketchLayer),
            strokeOptions: convertStrokeOptions(sketchLayer),
            shadow: convertShadow(sketchLayer),
            blendMode: convertBlendMode(sketchLayer),
            opacity: sketchLayer.style.contextSettings.opacity
          }
        } as em.Shape
      ]
    }
    case 'group': {
      return [
        {
          type: 'Group',
          name: sketchLayer.name,
          parent: parentId,
          id: sketchLayer.do_objectID,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          }
        },
        ...convertLayers({
          sketchLayers: sketchLayer.layers,
          parentId: sketchLayer.do_objectID,
          parentFrame: {
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2))
          },
          images,
          symbolMasters
        })
      ] as em.Layer[];
    }
    case 'symbolInstance':

      break;
    case 'text':

      break;
    case 'bitmap':

      break;
    default:
      throw Error(`Unknown layer type ${sketchLayer._class}`);
  }
}

interface ImportSketchArtboards {
  document: FileFormat.Document;
  meta: FileFormat.Meta;
  artboards: FileFormat.Artboard[];
  images: Buffer[];
  symbolMasters: FileFormat.SymbolMaster[];
}

const importSketchArtboards = (data: ImportSketchArtboards) => {
  const { document, meta, artboards, images, symbolMasters } = data;
  const layers = convertLayers({
    sketchLayers: artboards,
    parentId: 'page',
    parentFrame: {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    },
    images,
    symbolMasters,
  });
  store.dispatch(addLayers({layers}));
  // const viewCenter = paperMain.view.center;
  // let artboardX = paperMain.view.center.x;
  // data.artboards.forEach((artboard) => {
  //   store.dispatch(addArtboard({
  //     parent: 'page',
  //     id: artboard.do_objectID,
  //     frame: {
  //       x: artboardX,
  //       y: viewCenter.y,
  //       width: artboard.frame.width,
  //       height: artboard.frame.height,
  //       innerWidth: artboard.frame.width,
  //       innerHeight: artboard.frame.height
  //     }
  //   }));

  //   artboardX += (artboard.frame.width + 44);
  // });
}

export default importSketchArtboards;