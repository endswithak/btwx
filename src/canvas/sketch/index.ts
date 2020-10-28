/* eslint-disable @typescript-eslint/no-use-before-define */
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import sharp from 'sharp';
import { paperMain } from '../';
import store from '../../store';
import { addLayers, selectLayers } from '../../store/actions/layer';
import { addDocumentImage } from '../../store/actions/documentSettings';
import { drawShapePath } from './utils/shapePath';
import { renderShapeGroupLayers } from './utils/shapeGroup';
import { convertPosition, convertBlendMode, convertWindingRule, getLayerPath } from './utils/general';
import { convertFill } from './utils/fill';
import { convertStroke, convertStrokeOptions } from './utils/stroke';
import { getImage, getImageId } from './utils/image';
import { convertShadow } from './utils/shadow';
import { getSymbolMaster, getSymbolPath, getCompiledOverrides } from './utils/symbol';
import * as textUtils from './utils/text';
import { bufferToBase64 } from '../../utils';

interface ConvertLayers {
  sketchLayers: FileFormat.AnyLayer[];
  parentId: string;
  parentFrame: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  images: {
    [ref: string]: Buffer;
  };
  symbolMasters: FileFormat.SymbolMaster[];
  path?: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const convertLayers = ({ sketchLayers, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayers): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    let layers: Btwx.Layer[] = [];
    const promises: Promise<em.Layer[]>[] = [];
    sketchLayers.forEach((sketchLayer) => {
      promises.push(convertLayer({sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath}));
    });
    Promise.all(promises).then((result) => {
      result.forEach((promise) => {
        layers = [...layers, ...promise];
      });
      resolve(layers);
    });
  });
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
  images: {
    [ref: string]: Buffer;
  };
  symbolMasters: FileFormat.SymbolMaster[];
  path: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const convertArtboard = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const viewCenter = paperMain.view.center;
    convertLayers({
      sketchLayers: sketchLayer.layers,
      parentId: sketchLayer.do_objectID,
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: viewCenter.x + (parentFrame.x - (parentFrame.width / 2)),
        y: viewCenter.y + (parentFrame.y - (parentFrame.height / 2)),
      },
      images,
      symbolMasters,
      path,
      overrides,
      symbolPath
    }).then((layers) => {
      resolve(
        [
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
          ...layers
        ] as Btwx.Layer[]
      );
    });
  });
}

export const convertShapePath = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    let shape = drawShapePath({
      layer: sketchLayer as FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval,
      opts: {
        closed: sketchLayer.isClosed,
        windingRule: convertWindingRule(sketchLayer.style.windingRule),
        insert: false
      }
    });
    const isRectangle = shape.toShape(false);
    const hasRounded = sketchLayer.points.every(point => point.cornerRadius > 0 && point.cornerRadius === sketchLayer.points[0].cornerRadius);
    const isRounded = isRectangle && hasRounded;
    const isLine = (shape as paper.Path).segments.length === 2 && !shape.closed;
    const fromPoint = isLine ? (shape as paper.Path).segments[0].point : null;
    const toPoint = isLine ? (shape as paper.Path).segments[1].point : null;
    const vector = isLine ? toPoint.subtract(fromPoint) : null;
    let radius: {};
    if (isRounded) {
      const roundedReplacement = new paperMain.Path.Rectangle({
        from: shape.bounds.topLeft,
        to: shape.bounds.bottomRight,
        radius: sketchLayer.points[0].cornerRadius,
        insert: false
      });
      const roundedPercentage = sketchLayer.points[0].cornerRadius / (Math.max(roundedReplacement.bounds.width, roundedReplacement.bounds.height) / 2);
      shape = roundedReplacement;
      radius = { radius: roundedPercentage };
    }
    shape.rotation = sketchLayer.rotation * -1;
    shape.scale(sketchLayer.isFlippedHorizontal ? -1 : 1, sketchLayer.isFlippedVertical ? -1 : 1);
    resolve(
      [
        {
          id: sketchLayer.do_objectID,
          type: 'Shape',
          shapeType: isLine ? 'Line' : isRounded ? 'Rounded' : 'Custom',
          name: sketchLayer.name,
          parent: parentId,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: shape.bounds.width,
            height: shape.bounds.height,
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
          },
          transform: {
            rotation: isLine ? vector.angle : sketchLayer.rotation * -1,
            verticalFlip: sketchLayer.isFlippedVertical,
            horizontalFlip: sketchLayer.isFlippedHorizontal
          },
          ...radius
        } as Btwx.Shape
      ]
    );
  });
}

export const convertShapeGroup = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    const shapeContainer = new paperMain.Group({ insert: false });
    renderShapeGroupLayers({layer: sketchLayer, container: shapeContainer});
    const shapePath = shapeContainer.lastChild as paper.Path | paper.CompoundPath;
    shapePath.rotation = sketchLayer.rotation * -1;
    shapePath.scale(sketchLayer.isFlippedHorizontal ? -1 : 1, sketchLayer.isFlippedVertical ? -1 : 1);
    const pathData = shapePath.pathData;
    shapeContainer.remove();
    resolve(
      [
        {
          id: sketchLayer.do_objectID,
          type: 'Shape',
          shapeType: 'Custom',
          name: sketchLayer.name,
          parent: parentId,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: shapePath.bounds.width,
            height: shapePath.bounds.height,
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
          },
          transform: {
            rotation: sketchLayer.rotation * -1,
            verticalFlip: sketchLayer.isFlippedVertical,
            horizontalFlip: sketchLayer.isFlippedHorizontal
          }
        } as Btwx.Shape
      ]
    );
  });
}

export const convertGroup = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    convertLayers({
      sketchLayers: sketchLayer.layers,
      parentId: sketchLayer.do_objectID,
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: position.x + (parentFrame.x - (parentFrame.width / 2)),
        y: position.y + (parentFrame.y - (parentFrame.height / 2))
      },
      images,
      symbolMasters,
      path,
      overrides,
      symbolPath
    }).then((layers) => {
      resolve(
        [
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
          ...layers
        ] as Btwx.Layer[]
      );
    });
  });
}

export const convertSymbolInstance = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    const master = getSymbolMaster({
      symbolId: sketchLayer.symbolID,
      symbols: symbolMasters,
      overrides: overrides,
      symbolPath: symbolPath
    });
    if (master) {
      convertLayers({
        sketchLayers: master.layers,
        parentId: sketchLayer.do_objectID,
        parentFrame: {
          width: sketchLayer.frame.width,
          height: sketchLayer.frame.height,
          x: position.x + (parentFrame.x - (parentFrame.width / 2)),
          y: position.y + (parentFrame.y - (parentFrame.height / 2))
        },
        images,
        symbolMasters,
        path,
        overrides,
        symbolPath
      }).then((layers) => {
        resolve(
          [
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
            ...layers
          ] as Btwx.Layer[]
        );
      });
    } else {
      resolve([] as Btwx.Layer[]);
    }
  });
}

export const convertText = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    const textContainer = new paperMain.Group({insert: false});
    const fontAttrs = textUtils.getFontAttributes({
      textStyle: sketchLayer.style.textStyle
    });
    const override = textUtils.getOverrideString({
      overrides: overrides,
      symbolPath: symbolPath
    });
    const textContent = textUtils.getTextTransformString({
      str: override ? override.value as string : sketchLayer.attributedString.string,
      textTransform: fontAttrs.textTransform
    });
    const textAttrs = {
      point: textUtils.getTextPoint({
        justfication: fontAttrs.alignment,
        width: sketchLayer.frame.width
      }),
      content: textContent,
      parent: textContainer,
      fillColor: fontAttrs.color,
      fontWeight: `${fontAttrs.fontStyle} ${fontAttrs.fontWeight}`,
      fontStretch: fontAttrs.fontStretch,
      fontFamily: fontAttrs.fontFamily,
      justification: fontAttrs.alignment,
      fontSize: fontAttrs.fontSize,
      leading: fontAttrs.lineHeight,
      letterSpacing: fontAttrs.letterSpacing
    }
    textUtils.drawText({
      layer: sketchLayer,
      textOptions: textAttrs,
      layerOptions: {
        parent: textContainer
      }
    });
    const paperLayer = textContainer.getItem({ class: 'PointText' }) || textContainer.getItem({ class: 'AreaText' }) as paper.TextItem;
    resolve(
      [
        {
          type: 'Text',
          id: sketchLayer.do_objectID,
          name: sketchLayer.name,
          parent: parentId,
          text: textContent,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height,
            innerWidth: paperLayer.bounds.width,
            innerHeight: paperLayer.bounds.height
          },
          style: {
            fill: convertFill(sketchLayer),
            stroke: convertStroke(sketchLayer),
            strokeOptions: convertStrokeOptions(sketchLayer),
            shadow: convertShadow(sketchLayer),
            blendMode: convertBlendMode(sketchLayer),
            opacity: sketchLayer.style.contextSettings.opacity
          },
          textStyle: {
            fontSize: textAttrs.fontSize,
            lineHeight: textAttrs.leading,
            fontWeight: textAttrs.fontWeight,
            fontFamily: textAttrs.fontFamily,
            justfication: textAttrs.justification
          },
          transform: {
            rotation: sketchLayer.rotation * -1,
            verticalFlip: sketchLayer.isFlippedVertical,
            horizontalFlip: sketchLayer.isFlippedHorizontal
          },
          paperLayer
        }
      ]
    );
  });
}

export const convertImage = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer);
    const buffer = getImage({ref: sketchLayer.image._ref, images});
    const base64 = bufferToBase64(buffer);
    const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
    paperLayer.onLoad = (): void => {
      resolve(
        [
          {
            type: 'Image',
            id: sketchLayer.do_objectID,
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
            transform: {
              rotation: sketchLayer.rotation * -1,
              verticalFlip: sketchLayer.isFlippedVertical,
              horizontalFlip: sketchLayer.isFlippedHorizontal
            },
            style: {
              shadow: convertShadow(sketchLayer),
              blendMode: convertBlendMode(sketchLayer),
              opacity: sketchLayer.style.contextSettings.opacity
            },
            imageId: getImageId(sketchLayer.image._ref),
            paperLayer: paperLayer
          }
        ]
      );
    }
  });
}

export const convertLayer = ({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }: ConvertLayer): Promise<em.Layer[]> => {
  path = getLayerPath({layer: sketchLayer, path});
  overrides = getCompiledOverrides({layer: sketchLayer, overrides});
  symbolPath = getSymbolPath({layer: sketchLayer, symbolPath});
  return new Promise((resolve, reject) => {
    if (sketchLayer.isVisible) {
      switch(sketchLayer._class) {
        case 'artboard': {
          convertArtboard({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        case 'shapePath':
        case 'rectangle':
        case 'triangle':
        case 'star':
        case 'polygon':
        case 'oval': {
          convertShapePath({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        case 'shapeGroup': {
          convertShapeGroup({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        case 'group': {
          convertGroup({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        case 'symbolInstance': {
          convertSymbolInstance({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        case 'text': {
          convertText({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
        }
          break;
        case 'bitmap': {
          convertImage({ sketchLayer, parentId, parentFrame, images, symbolMasters, path, overrides, symbolPath }).then((layers) => {
            resolve(layers);
          });
          break;
        }
        default:
          throw Error(`Unknown layer type ${sketchLayer._class}`);
      }
    } else {
      resolve([]);
    }
  });
}

const addSketchImage = (sketchRef: string, sketchBuffer: Buffer): Promise<{[id: string]: Buffer}> => {
  return new Promise((resolve) => {
    const state = store.getState();
    const di = state.documentSettings.images;
    const buffer = Buffer.from(sketchBuffer.data);
    const exists = di.allIds.length > 0 && di.allIds.find((id) => Buffer.from(di.byId[id].buffer).equals(buffer));
    if (!exists) {
      sharp(buffer).metadata().then(({ width }) => {
        sharp(buffer).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer().then((data) => {
          const newBuffer = Buffer.from(data);
          store.dispatch(addDocumentImage({id: sketchRef, buffer: newBuffer}));
          resolve({ [sketchRef]: newBuffer });
        });
      });
    } else {
      resolve({});
    }
  });
}

const addSketchImages = (images: { [ref: string]: Buffer }): Promise<{[id: string]: Buffer}> => {
  return new Promise((resolve) => {
    const promises: Promise<{[id: string]: Buffer}>[] = [];
    Object.keys(images).forEach((key) => {
      promises.push(addSketchImage(key, images[key]));
    });
    Promise.all(promises).then((images) => {
      const convertedImages = images.reduce((result, current) => {
        result = { ...result, ...current };
        return result;
      }, {});
      resolve(convertedImages);
    });
  });
}

interface ImportSketchArtboards {
  document: FileFormat.Document;
  meta: FileFormat.Meta;
  artboards: FileFormat.Artboard[];
  images: {
    [ref: string]: Buffer;
  };
  symbolMasters: FileFormat.SymbolMaster[];
}

const importSketchArtboards = (data: ImportSketchArtboards): void => {
  const { document, meta, artboards, images, symbolMasters } = data;
  const artboardIds = artboards.reduce((result, current) => {
    result = [...result, current.do_objectID];
    return result;
  }, []);
  addSketchImages(images).then((convertedImages) => {
    convertLayers({
      sketchLayers: artboards,
      parentId: 'page',
      parentFrame: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      },
      images: convertedImages,
      symbolMasters,
    }).then((layers) => {
      store.dispatch(addLayers({layers}));
      store.dispatch(selectLayers({layers: artboardIds, newSelection: true}));
    });
  });
}

export default importSketchArtboards;