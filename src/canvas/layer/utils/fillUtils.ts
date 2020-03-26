import paper, { Layer, Color, Raster, Point, Size, SymbolDefinition, Group, GradientStop } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor, getFitSize, getFillSize } from './general';
import { getImage } from './imageUtils';
import { convertPointString } from './shapePathUtils';

interface RenderPatternFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  fillIndex: number;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderPatternFill = ({ shapePath, fill, fillIndex, images, container }: RenderPatternFill): void => {
  const patternFillContainer = new Layer({
    name: `fill-${fillIndex}`,
    parent: container
  });
  const patternFillShape = shapePath.clone();
  patternFillShape.parent = patternFillContainer;
  patternFillShape.clipMask = true;
  patternFillShape.name = 'fill-shape';
  const bitmap = new Raster(getImage({
    ref: fill.image._ref,
    images: images
  }));
  bitmap.name = 'fill-pattern';
  bitmap.onLoad = (): void => {
    switch(fill.patternFillType) {
      // tile
      case 0: {
        const bitmapSymbol = new SymbolDefinition(bitmap);
        const rows = Math.ceil(patternFillShape.bounds.height / bitmap.height);
        const columns = Math.ceil(patternFillShape.bounds.width / bitmap.width);
        for(let i = 0; i < rows; i++) {
          for(let j = 0; j < columns; j++) {
            const bitmapInstance = bitmapSymbol.place();
            bitmapInstance.parent = patternFillContainer;
            bitmapInstance.position.x = (patternFillShape.bounds.topLeft.x + bitmap.width / 2) + (bitmap.width * i);
            bitmapInstance.position.y = (patternFillShape.bounds.topLeft.y + bitmap.height / 2) + (bitmap.height * j);
          }
        }
        break;
      }
      // fill
      case 1: {
        const fillSize = getFillSize({
          layerWidth: bitmap.width,
          layerHeight: bitmap.height,
          containerWidth: patternFillShape.bounds.width,
          containerHeight: patternFillShape.bounds.height
        });
        bitmap.parent = patternFillContainer;
        bitmap.width = fillSize.width;
        bitmap.height = fillSize.height;
        bitmap.position = patternFillShape.bounds.center;
        break;
      }
      // stretch
      case 2:
        bitmap.parent = patternFillContainer;
        bitmap.width = patternFillShape.bounds.width;
        bitmap.height = patternFillShape.bounds.height;
        bitmap.position = patternFillShape.bounds.center;
        break;
      // fit
      case 3: {
        const fitSize = getFitSize({
          layerWidth: bitmap.width,
          layerHeight: bitmap.height,
          containerWidth: patternFillShape.bounds.width,
          containerHeight: patternFillShape.bounds.height
        });
        bitmap.parent = patternFillContainer;
        bitmap.width = fitSize.width;
        bitmap.height = fitSize.height;
        bitmap.position = patternFillShape.bounds.center;
        break;
      }
    }
  }
};

interface RenderGradientFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  fillIndex: number;
  container: paper.Group;
}

export const renderGradientFill = ({ shapePath, fill, fillIndex, container }: RenderGradientFill): void => {
  const linearGradientFill = shapePath.clone();
  linearGradientFill.parent = container;
  const from = convertPointString({point: fill.gradient.from});
  const to = convertPointString({point: fill.gradient.to});
  const gradientStops = fill.gradient.stops.map((gradientStop) => {
    return new GradientStop(new Color(gradientStop.color), gradientStop.position);
  }) as paper.GradientStop[];
  linearGradientFill.name = `fill-${fillIndex}`;
  linearGradientFill.fillColor = {
    gradient: {
      stops: gradientStops,
      radial: fill.gradient.gradientType === 1
    },
    origin: new Point(shapePath.bounds.width * from.x, shapePath.bounds.height * from.y),
    destination: new Point(shapePath.bounds.width * to.x, shapePath.bounds.height * to.y)
  };
};

interface RenderColorFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  fillIndex: number;
  container: paper.Group;
}

export const renderColorFill = ({ shapePath, fill, fillIndex, container }: RenderColorFill): void => {
  const colorFill = shapePath.clone();
  colorFill.name = `fill-${fillIndex}`;
  colorFill.parent = container;
  colorFill.fillColor = getPaperColor({color: fill.color});
};

interface RenderFill {
  shapePath: paper.Path | paper.CompoundPath;
  fill: FileFormat.Fill;
  fillIndex: number;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderFill = ({ shapePath, fill, fillIndex, images, container }: RenderFill): void => {
  switch(fill.fillType) {
    case 0:
      renderColorFill({shapePath, fill, fillIndex, container});
      break;
    case 1:
      renderGradientFill({shapePath, fill, fillIndex, container});
      break;
    case 4:
      renderPatternFill({shapePath, fill, fillIndex, images, container});
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
  if (fills.some((fill) => fill.isEnabled)) {
    const fillsContainer = new Group({
      name: 'fills',
      parent: container
    });
    fills.forEach((fill, fillIndex) => {
      if (fill.isEnabled) {
        renderFill({
          shapePath: shapePath,
          fill: fill,
          fillIndex: fillIndex,
          container: fillsContainer,
          images: images
        });
      }
    });
  }
};