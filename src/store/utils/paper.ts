import { paperMain } from '../../canvas';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_RADIUS, DEFAULT_STAR_POINTS } from '../../constants';

export const getPaperLayer = (id: string): paper.Item => {
  return paperMain.project.getItem({ data: { id } });
};

export const getPaperFillColor = (fill: em.Fill, frame: em.Frame): any => {
  return fill.fillType === 'color' ? { hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a } : {
    gradient: {
      stops: fill.gradient.stops.reduce((result, current) => {
        result = [...result, new paperMain.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)];
        return result;
      }, []),
      radial: fill.gradient.gradientType === 'radial'
    },
    origin: new paperMain.Point((fill.gradient.origin.x * frame.innerWidth) + frame.x, (fill.gradient.origin.y * frame.innerHeight) + frame.y),
    destination: new paperMain.Point((fill.gradient.destination.x * frame.innerWidth) + frame.x, (fill.gradient.destination.y * frame.innerHeight) + frame.y)
  }
};

export const getPaperStrokeColor = (stroke: em.Stroke, frame: em.Frame): any => {
  return stroke.fillType === 'color' ? { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } : {
    gradient: {
      stops: stroke.gradient.stops.reduce((result, current) => {
        result = [...result, new paperMain.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)];
        return result;
      }, []),
      radial: stroke.gradient.gradientType === 'radial'
    },
    origin: new paperMain.Point((stroke.gradient.origin.x * frame.innerWidth) + frame.x, (stroke.gradient.origin.y * frame.innerHeight) + frame.y),
    destination: new paperMain.Point((stroke.gradient.destination.x * frame.innerWidth) + frame.x, (stroke.gradient.destination.y * frame.innerHeight) + frame.y)
  }
};

export const getPaperShadowColor = (shadow: em.Shadow): any => {
  return { hue: shadow.color.h, saturation: shadow.color.s, lightness: shadow.color.l, alpha: shadow.color.a };
};

export const getPaperShapePathData = (shapeType: em.ShapeType, width?: number, height?: number, x?: number, y?: number, shapeOpts?: { radius?: number; sides?: number; points?: number }): any => {
  let shape;
  x = x ? x : paperMain.view.center.x;
  y = y ? y : paperMain.view.center.y;
  width = width ? width : 200;
  height = height ? height : 200;
  const topLeft = new paperMain.Point(x - (width / 2), y - (height / 2));
  const bottomRight = new paperMain.Point(x + (width / 2), y + (height / 2));
  const maxDim = Math.max(width, height);
  const centerPoint = new paperMain.Point(x, y);
  switch(shapeType) {
    case 'Rectangle':
      shape = new paperMain.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        insert: false
      });
      break;
    case 'Ellipse':
      shape = new paperMain.Path.Ellipse({
        from: topLeft,
        to: bottomRight,
        insert: false
      });
      break;
    case 'Rounded':
      shape = new paperMain.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        insert: false,
        radius: (maxDim / 2) * (shapeOpts.radius ? shapeOpts.radius : DEFAULT_ROUNDED_RADIUS)
      });
      break;
    case 'Polygon': {
      shape = new paperMain.Path.RegularPolygon({
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
      shape = new paperMain.Path.Star({
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
  }
  return shape.pathData;
};