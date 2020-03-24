import paper, { Layer, Color, Raster, Point, Size, SymbolDefinition } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor, getFitSize, getFillSize } from './general';
import { getImage } from './imageUtils';

interface RenderPatternFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderPatternFill = ({ shapePath, fill, images, container }: RenderPatternFill): void => {
  const patternFill = shapePath.clone();
  patternFill.parent = container;
  patternFill.clipMask = true;
  const bitmap = new Raster(getImage({
    ref: fill.image._ref,
    images: images
  }));
  bitmap.onLoad = (): void => {
    switch(fill.patternFillType) {
      // tile
      case 0: {
        const bitmapSymbol = new SymbolDefinition(bitmap);
        const rows = Math.ceil(patternFill.bounds.height / bitmap.height);
        const columns = Math.ceil(patternFill.bounds.width / bitmap.width);
        for(let i = 0; i < rows; i++) {
          for(let j = 0; j < columns; j++) {
            const bitmapInstance = bitmapSymbol.place();
            bitmapInstance.parent = container;
            bitmapInstance.position.x = (patternFill.bounds.topLeft.x + bitmap.width / 2) + (bitmap.width * i);
            bitmapInstance.position.y = (patternFill.bounds.topLeft.y + bitmap.height / 2) + (bitmap.height * j);
          }
        }
        break;
      }
      // fill
      case 1: {
        const fillSize = getFillSize({
          layerWidth: bitmap.width,
          layerHeight: bitmap.height,
          containerWidth: patternFill.bounds.width,
          containerHeight: patternFill.bounds.height
        });
        bitmap.parent = container;
        bitmap.width = fillSize.width;
        bitmap.height = fillSize.height;
        bitmap.position = patternFill.bounds.center;
        break;
      }
      // stretch
      case 2:
        bitmap.parent = container;
        bitmap.width = patternFill.bounds.width;
        bitmap.height = patternFill.bounds.height;
        bitmap.position = patternFill.bounds.center;
        break;
      // fit
      case 3: {
        const fitSize = getFitSize({
          layerWidth: bitmap.width,
          layerHeight: bitmap.height,
          containerWidth: patternFill.bounds.width,
          containerHeight: patternFill.bounds.height
        });
        bitmap.parent = container;
        bitmap.width = fitSize.width;
        bitmap.height = fitSize.height;
        bitmap.position = patternFill.bounds.center;
        break;
      }
    }
  }
};

interface RenderColorFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  container: paper.Group;
}

export const renderColorFill = ({ shapePath, fill, container }: RenderColorFill): void => {
  const colorFill = shapePath.clone();
  colorFill.parent = container;
  colorFill.fillColor = getPaperColor({color: fill.color});
};

interface RenderFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderFill = ({ shapePath, fill, images, container }: RenderFill): void => {
  switch(fill.fillType) {
    case 0:
      renderColorFill({shapePath, fill, container});
      break;
    case 4:
      renderPatternFill({shapePath, fill, images, container});
      break;
  }
};

interface RenderFills {
  shapePath: paper.Path | paper.CompoundPath;
  fills: FileFormat.Fill[];
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderFills = ({ shapePath, fills, images, container }: RenderFills): void => {
  fills.forEach((fill) => {
    if (fill.isEnabled) {
      renderFill({
        shapePath: shapePath,
        fill: fill,
        container: container,
        images: images
      });
    }
  });
};