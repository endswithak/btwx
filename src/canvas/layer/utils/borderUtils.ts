import paper, { Layer, Color, Raster, Path, Rectangle, Point, Size, SymbolDefinition, Group, GradientStop } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getPaperColor } from './general';
import { convertPointString } from './shapePathUtils';

interface GetBorderLineCap {
  borderOptions: FileFormat.BorderOptions;
}

export const getBorderLineCap = ({ borderOptions }: GetBorderLineCap): string => {
  switch(borderOptions.lineCapStyle) {
    case 0:
      return 'butt';
    case 1:
      return 'round';
    case 2:
      return 'square';
  }
};

interface GetBorderLineJoin {
  borderOptions: FileFormat.BorderOptions;
}

export const getBorderLineJoin = ({ borderOptions }: GetBorderLineJoin): string => {
  switch(borderOptions.lineJoinStyle) {
    case 0:
      return 'miter';
    case 1:
      return 'round';
    case 2:
      return 'bevel';
  }
};

interface GetBorderThickness {
  border: FileFormat.Border;
}

export const getBorderThickness = ({ border }: GetBorderThickness): number => {
  switch(border.position) {
    case 0:
      return border.thickness;
    case 1:
    case 2:
      return border.thickness * 2;
  }
};

interface RenderBorderMask {
  shapePath: paper.Path | paper.CompoundPath;
  border: FileFormat.Border;
  container: paper.Group;
}

export const renderBorderMask = ({ shapePath, border, container }: RenderBorderMask): null => {
  switch(border.position) {
    case 0:
      return null;
    case 1: {
      const mask = shapePath.clone() as paper.Path | paper.CompoundPath;
      mask.parent = container;
      mask.name = 'mask';
      mask.clipMask = true;
      break;
    }
    case 2: {
      const shapeBounds = new Path.Rectangle({
        point: [border.thickness * -1, border.thickness * -1],
        size: [shapePath.bounds.width + (border.thickness * 2), shapePath.bounds.height + (border.thickness * 2)],
        insert: false
      });
      const shapeInverse = shapeBounds.subtract(shapePath as paper.Path | paper.CompoundPath) as paper.Path | paper.CompoundPath;
      const mask = shapeInverse.clone();
      mask.name = 'mask';
      mask.parent = container;
      mask.clipMask = true;
      break;
    }
  }
};


interface RenderGradientBorder {
  shapePath: paper.Path | paper.CompoundPath;
  border: FileFormat.Border;
  borderOptions: FileFormat.BorderOptions;
  container: paper.Group;
}

export const renderGradientBorder = ({ shapePath, border, borderOptions, container }: RenderGradientBorder): void => {
  renderBorderMask({border, shapePath, container});
  const gradientBorder = shapePath.clone();
  gradientBorder.name = 'gradient';
  gradientBorder.parent = container;
  const from = convertPointString({point: border.gradient.from});
  const to = convertPointString({point: border.gradient.to});
  const gradientStops = border.gradient.stops.map((gradientStop) => {
    return new GradientStop(new Color(gradientStop.color), gradientStop.position);
  }) as paper.GradientStop[];
  gradientBorder.dashArray = borderOptions.dashPattern;
  gradientBorder.strokeWidth = getBorderThickness({border});
  gradientBorder.strokeJoin = getBorderLineJoin({borderOptions});
  gradientBorder.strokeCap = getBorderLineCap({borderOptions});
  gradientBorder.strokeColor = {
    gradient: {
      stops: gradientStops,
      radial: border.gradient.gradientType === 1
    },
    origin: new Point(shapePath.bounds.width * from.x, shapePath.bounds.height * from.y),
    destination: new Point(shapePath.bounds.width * to.x, shapePath.bounds.height * to.y)
  };
};

interface RenderColorBorder {
  shapePath: paper.Path | paper.CompoundPath;
  border: FileFormat.Border;
  borderOptions: FileFormat.BorderOptions;
  container: paper.Group;
}

export const renderColorBorder = ({ shapePath, border, borderOptions, container }: RenderColorBorder): void => {
  renderBorderMask({border, shapePath, container});
  const colorBorder = shapePath.clone();
  colorBorder.name = 'color';
  colorBorder.parent = container;
  colorBorder.dashArray = borderOptions.dashPattern;
  colorBorder.strokeWidth = getBorderThickness({border});
  colorBorder.strokeJoin = getBorderLineJoin({borderOptions});
  colorBorder.strokeCap = getBorderLineCap({borderOptions});
  colorBorder.strokeColor = getPaperColor({color: border.color});
};

interface RenderBorder {
  shapePath: paper.Path | paper.CompoundPath;
  border: FileFormat.Border;
  borderOptions: FileFormat.BorderOptions;
  container: paper.Group;
}

export const renderBorder = ({ shapePath, border, borderOptions, container }: RenderBorder): void => {
  switch(border.fillType) {
    case 0:
      renderColorBorder({shapePath, border, borderOptions, container});
      break;
    case 1:
      renderGradientBorder({shapePath, border, borderOptions, container});
      break;
  }
};

interface RenderBorders {
  shapePath: paper.Path | paper.CompoundPath;
  borders: FileFormat.Border[];
  borderOptions: FileFormat.BorderOptions;
  container: paper.Group;
}

export const renderBorders = ({ shapePath, borders, borderOptions, container }: RenderBorders): void => {
  if (borders.some((border) => border.isEnabled)) {
    const bordersContainer = new Group({
      name: 'borders',
      parent: container
    });
    borders.forEach((border, borderIndex) => {
      if (border.isEnabled) {
        const borderLayer = new Layer({
          name: `border-${borderIndex}`,
          parent: bordersContainer
        });
        renderBorder({
          shapePath: shapePath,
          border: border,
          borderOptions: borderOptions,
          container: borderLayer
        });
      }
    });
  }
};