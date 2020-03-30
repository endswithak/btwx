import paper, { Layer, Color, Raster, Point, Size, SymbolDefinition, Group, GradientStop } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor, getFitSize, getFillSize } from './general';
import { getImage } from './imageUtils';
import { convertPointString } from './shapePathUtils';
import { drawText } from './textUtils';

interface RenderPatternFill {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  fill: FileFormat.Fill;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
  topPatternFill: boolean;
  override?: FileFormat.OverrideValue;
}

export const renderPatternFill = ({ shapePath, fill, images, container, topPatternFill, override }: RenderPatternFill): void => {
  const patternMask = shapePath.clone();
  patternMask.name = 'mask';
  patternMask.parent = container;
  patternMask.clipMask = true;
  const pattern = new Raster(getImage({
    ref: override && topPatternFill ? (override.value as FileFormat.ImageFileRef)._ref : fill.image._ref,
    images: images
  }));
  pattern.name = 'pattern';
  pattern.onLoad = (): void => {
    switch(fill.patternFillType) {
      // tile
      case 0: {
        const bitmapSymbol = new SymbolDefinition(pattern);
        const rows = Math.ceil(patternMask.bounds.height / pattern.height);
        const columns = Math.ceil(patternMask.bounds.width / pattern.width);
        for(let i = 0; i < rows; i++) {
          for(let j = 0; j < columns; j++) {
            const bitmapInstance = bitmapSymbol.place();
            bitmapInstance.parent = container;
            bitmapInstance.position.x = (patternMask.bounds.topLeft.x + pattern.width / 2) + (pattern.width * j);
            bitmapInstance.position.y = (patternMask.bounds.topLeft.y + pattern.height / 2) + (pattern.height * i);
          }
        }
        break;
      }
      // fill
      case 1: {
        const fillSize = getFillSize({
          layerWidth: pattern.width,
          layerHeight: pattern.height,
          containerWidth: patternMask.bounds.width,
          containerHeight: patternMask.bounds.height
        });
        pattern.parent = container;
        pattern.width = fillSize.width;
        pattern.height = fillSize.height;
        pattern.position = patternMask.bounds.center;
        break;
      }
      // stretch
      case 2:
        pattern.parent = container;
        pattern.width = patternMask.bounds.width;
        pattern.height = patternMask.bounds.height;
        pattern.position = patternMask.bounds.center;
        break;
      // fit
      case 3: {
        const fitSize = getFitSize({
          layerWidth: pattern.width,
          layerHeight: pattern.height,
          containerWidth: patternMask.bounds.width,
          containerHeight: patternMask.bounds.height
        });
        pattern.parent = container;
        pattern.width = fitSize.width;
        pattern.height = fitSize.height;
        pattern.position = patternMask.bounds.center;
        break;
      }
    }
  }
};

interface RenderGradientFill {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  fill: FileFormat.Fill;
  container: paper.Group;
}

export const renderGradientFill = ({ shapePath, fill, container }: RenderGradientFill): void => {
  const gradientFill = shapePath.clone();
  gradientFill.name = `gradient`;
  gradientFill.parent = container;
  const from = convertPointString({point: fill.gradient.from});
  const to = convertPointString({point: fill.gradient.to});
  const gradientStops = fill.gradient.stops.map((gradientStop) => {
    return new GradientStop(getPaperColor({color: gradientStop.color}), gradientStop.position);
  }) as paper.GradientStop[];
  gradientFill.fillColor = {
    gradient: {
      stops: gradientStops,
      radial: fill.gradient.gradientType === 1
    },
    origin: new Point(shapePath.bounds.width * from.x, shapePath.bounds.height * from.y),
    destination: new Point(shapePath.bounds.width * to.x, shapePath.bounds.height * to.y)
  };
};

interface RenderColorFill {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  fill: FileFormat.Fill;
  container: paper.Group;
}

export const renderColorFill = ({ shapePath, fill, container }: RenderColorFill): void => {
  const colorFill = shapePath.clone();
  colorFill.name = `color`;
  colorFill.parent = container;
  colorFill.fillColor = getPaperColor({color: fill.color});
};

interface RenderFill {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  fill: FileFormat.Fill;
  images: {
    [id: string]: string;
  };
  container: paper.Group;
  topPatternFill: boolean;
  override?: FileFormat.OverrideValue;
}

export const renderFill = ({ shapePath, fill, images, container, topPatternFill, override }: RenderFill): void => {
  switch(fill.fillType) {
    case 0:
      renderColorFill({shapePath, fill, container});
      break;
    case 1:
      renderGradientFill({shapePath, fill, container});
      break;
    case 4:
      renderPatternFill({shapePath, fill, images, container, topPatternFill, override});
      break;
  }
};

interface RenderFills {
  shapePath: paper.Path | paper.CompoundPath | paper.PointText | paper.AreaText;
  fills: FileFormat.Fill[];
  images: {
    [id: string]: string;
  };
  container: paper.Group;
  override?: FileFormat.OverrideValue;
}

export const renderFills = ({ shapePath, fills, images, container, override }: RenderFills): void => {
  if (fills.some((fill) => fill.isEnabled)) {
    const fillsContainer = new Group({
      name: 'fills',
      parent: container
    });
    const topPatternFillIndex = fills.reduce((topIndex, fill, fillIndex) => {
      return fill.fillType === 4 && fill.isEnabled ? fillIndex : topIndex;
    }, null);
    fills.forEach((fill, fillIndex) => {
      if (fill.isEnabled) {
        const fillLayer = new Layer({
          name: `fill-${fillIndex}`,
          parent: fillsContainer
        });
        renderFill({
          shapePath: shapePath,
          fill: fill,
          container: fillLayer,
          images: images,
          override: override,
          topPatternFill: topPatternFillIndex === fillIndex
        });
      }
    });
  }
};

interface RenderTextGradientFill {
  layer: FileFormat.Text;
  textOptions: any;
  layerOptions: any;
  fill: FileFormat.Fill;
}

export const renderTextGradientFill = ({ layer, textOptions, layerOptions, fill }: RenderTextGradientFill): void => {
  const from = convertPointString({point: fill.gradient.from});
  const to = convertPointString({point: fill.gradient.to});
  const gradientStops = fill.gradient.stops.map((gradientStop) => {
    return new GradientStop(getPaperColor({color: gradientStop.color}), gradientStop.position);
  }) as paper.GradientStop[];
  drawText({
    layer: layer,
    textOptions: {
      ...textOptions,
      fillColor: {
        gradient: {
          stops: gradientStops,
          radial: fill.gradient.gradientType === 1
        },
        origin: new Point(layer.frame.width * from.x, layer.frame.height * from.y),
        destination: new Point(layer.frame.width * to.x, layer.frame.height * to.y)
      }
    },
    layerOptions: layerOptions
  });
};

interface RenderTextColorFill {
  layer: FileFormat.Text;
  textOptions: any;
  layerOptions: any;
  fill: FileFormat.Fill;
}

export const renderTextColorFill = ({ layer, textOptions, layerOptions, fill }: RenderTextColorFill): void => {
  drawText({
    layer: layer,
    textOptions: {
      ...textOptions,
      fillColor: getPaperColor({color: fill.color})
    },
    layerOptions: layerOptions
  });
};

interface RenderTextFill {
  layer: FileFormat.Text;
  textOptions: any;
  layerOptions: any;
  images: {
    [id: string]: string;
  };
  topPatternFill: boolean;
  fill: FileFormat.Fill;
  override?: FileFormat.OverrideValue;
}

export const renderTextFill = ({ layer, textOptions, layerOptions, topPatternFill, images, fill, override }: RenderTextFill): void => {
  switch(fill.fillType) {
    case 0:
      renderTextColorFill({layer, textOptions, layerOptions, fill});
      break;
    case 1:
      renderTextGradientFill({layer, textOptions, layerOptions, fill});
      break;
  }
};

interface RenderTextFills {
  layer: FileFormat.Text;
  textAttrs: any;
  fills: FileFormat.Fill[];
  images: {
    [id: string]: string;
  };
  container: paper.Group;
}

export const renderTextFills = ({ layer, fills, textAttrs, images, container }: RenderTextFills): void => {
  if (fills.some((fill) => fill.isEnabled)) {
    const fillsContainer = new Group({
      name: 'fills',
      parent: container
    });
    const topPatternFillIndex = fills.reduce((topIndex, fill, fillIndex) => {
      return fill.fillType === 4 && fill.isEnabled ? fillIndex : topIndex;
    }, null);
    fills.forEach((fill, fillIndex) => {
      if (fill.isEnabled) {
        renderTextFill({
          layer: layer,
          textOptions: textAttrs,
          images: images,
          layerOptions: {
            parent: fillsContainer,
            name: `fill-${fillIndex}`
          },
          fill: fill,
          topPatternFill: topPatternFillIndex === fillIndex
        });
      }
    });
  }
};