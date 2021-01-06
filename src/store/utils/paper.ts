import paper from 'paper';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_RADIUS, DEFAULT_STAR_POINTS, DEFAULT_LINE_FROM, DEFAULT_LINE_TO } from '../../constants';
import { uiPaperScope } from '../../canvas';

export const getLayerPaperParent = (paperLayer: paper.Item, layerItem: Btwx.Layer): paper.Item => {
  const isArtboard = paperLayer.data.layerType === 'Artboard';
  const nextPaperLayer = isArtboard ? paperLayer.getItem({ data: { id: 'artboardLayers' } }) : paperLayer;
  const parentChildren = nextPaperLayer.children;
  const hasChildren = parentChildren.length > 0;
  const lastChildPaperLayer = hasChildren ? nextPaperLayer.lastChild : null;
  const isLastChildMask = lastChildPaperLayer && (lastChildPaperLayer.data.id as string).endsWith('maskGroup');
  const underlyingMask = lastChildPaperLayer ? isLastChildMask ? lastChildPaperLayer : lastChildPaperLayer.parent : null;
  if (underlyingMask && !(layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask) {
    return underlyingMask;
  } else {
    return nextPaperLayer;
  }
}

export const getLayerAbsPosition = (layerFrame: Btwx.Frame, artboardFrame: Btwx.Frame): paper.Point => {
  let position = new uiPaperScope.Point(layerFrame.x, layerFrame.y);
  if (artboardFrame) {
    position = position.add(new uiPaperScope.Point(artboardFrame.x, artboardFrame.y))
  }
  return position;
}

export const getPaperFillColor = (fill: Btwx.Fill, frame: Btwx.Frame): any => {
  return fill.fillType === 'color' ? { hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a } : {
    gradient: {
      stops: fill.gradient.stops.reduce((result, current) => {
        result = [...result, new paper.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)];
        return result;
      }, []),
      radial: fill.gradient.gradientType === 'radial'
    },
    origin: new paper.Point((fill.gradient.origin.x * frame.innerWidth) + frame.x, (fill.gradient.origin.y * frame.innerHeight) + frame.y),
    destination: new paper.Point((fill.gradient.destination.x * frame.innerWidth) + frame.x, (fill.gradient.destination.y * frame.innerHeight) + frame.y)
  }
};

export const getPaperStrokeColor = (stroke: Btwx.Stroke, frame: Btwx.Frame): any => {
  return stroke.fillType === 'color' ? { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } : {
    gradient: {
      stops: stroke.gradient.stops.reduce((result, current) => {
        result = [...result, new paper.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)];
        return result;
      }, []),
      radial: stroke.gradient.gradientType === 'radial'
    },
    origin: new paper.Point((stroke.gradient.origin.x * frame.innerWidth) + frame.x, (stroke.gradient.origin.y * frame.innerHeight) + frame.y),
    destination: new paper.Point((stroke.gradient.destination.x * frame.innerWidth) + frame.x, (stroke.gradient.destination.y * frame.innerHeight) + frame.y)
  }
};

export const getPaperShadowColor = (shadow: Btwx.Shadow): any => {
  return { hue: shadow.color.h, saturation: shadow.color.s, lightness: shadow.color.l, alpha: shadow.color.a };
};

export const getPaperShapePathData = (shapeType: Btwx.ShapeType, width?: number, height?: number, x?: number, y?: number, shapeOpts?: { radius?: number; sides?: number; points?: number }): any => {
  let shape;
  x = x ? x : paper.view.center.x;
  y = y ? y : paper.view.center.y;
  width = width ? width : 200;
  height = height ? height : 200;
  const topLeft = new paper.Point(x - (width / 2), y - (height / 2));
  const bottomRight = new paper.Point(x + (width / 2), y + (height / 2));
  const maxDim = Math.max(width, height);
  const centerPoint = new paper.Point(x, y);
  const lineFrom = new paper.Point((DEFAULT_LINE_FROM.x * width) + x, (DEFAULT_LINE_FROM.y * width) + y);
  const lineTo = new paper.Point((DEFAULT_LINE_TO.x * width) + x, (DEFAULT_LINE_TO.y * width) + y);
  switch(shapeType) {
    case 'Rectangle':
      shape = new paper.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        insert: false
      });
      break;
    case 'Ellipse':
      shape = new paper.Path.Ellipse({
        from: topLeft,
        to: bottomRight,
        insert: false
      });
      break;
    case 'Rounded':
      shape = new paper.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        insert: false,
        radius: (maxDim / 2) * (shapeOpts.radius ? shapeOpts.radius : DEFAULT_ROUNDED_RADIUS)
      });
      break;
    case 'Polygon': {
      shape = new paper.Path.RegularPolygon({
        center: centerPoint,
        radius: maxDim / 2,
        sides: shapeOpts.sides ? shapeOpts.sides : DEFAULT_POLYGON_SIDES,
        insert: false
      });
      shape.bounds.width = width;
      shape.bounds.height = height;
      shape.position = centerPoint;
      break;
    }
    case 'Star': {
      shape = new paper.Path.Star({
        center: centerPoint,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * (shapeOpts.radius ? shapeOpts.radius : DEFAULT_STAR_RADIUS),
        points: shapeOpts.points ? shapeOpts.points : DEFAULT_STAR_POINTS,
        insert: false
      });
      shape.bounds.width = width;
      shape.bounds.height = height;
      shape.position = centerPoint;
      break;
    }
    case 'Line': {
      shape = new paper.Path.Line({
        from: lineFrom,
        to: lineTo
      });
      shape.position = centerPoint;
      break;
    }
  }
  return shape.pathData;
};