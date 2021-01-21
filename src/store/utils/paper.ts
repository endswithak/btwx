/* eslint-disable @typescript-eslint/no-use-before-define */
import paper from 'paper';
import tinyColor from 'tinycolor2';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_RADIUS, DEFAULT_STAR_POINTS, DEFAULT_LINE_FROM, DEFAULT_LINE_TO } from '../../constants';
import { paperMain, paperPreview } from '../../canvas';

interface GetPaperParent {
  paperScope: Btwx.PaperScope;
  projectIndex: number;
  parent: string;
  isParentArtboard: boolean;
  masked: boolean;
  underlyingMask: string;
}

export const getPaperParent = ({ paperScope, projectIndex, parent, isParentArtboard, masked, underlyingMask }: GetPaperParent): paper.Item => {
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  let paperParent = paperProject.getItem({data: {id: parent}});
  if (isParentArtboard) {
    paperParent = paperParent.getItem({data:{id:'artboardLayers'}});
  }
  if (masked) {
    paperParent = paperProject.getItem({data: {id: underlyingMask}}).parent;
  }
  return paperParent;
}

export const getLayerAbsPosition = (layerFrame: Btwx.Frame, artboardFrame: Btwx.Frame): paper.Point => {
  let position = new paper.Point(layerFrame.x, layerFrame.y);
  if (artboardFrame) {
    position = position.add(new paper.Point(artboardFrame.x, artboardFrame.y))
  }
  return position;
}

interface GetPaperStyle {
  style: Btwx.Style;
  textStyle?: Btwx.TextStyle;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
  isLine: boolean;
}

export const getPaperStyle = ({ style, textStyle, layerFrame, artboardFrame, isLine }: GetPaperStyle): any => {
  return {
    fillColor: getPaperFillColor({
      fill: style.fill,
      isLine: isLine,
      layerFrame: layerFrame,
      artboardFrame: artboardFrame
    }),
    strokeColor: getPaperStrokeColor({
      stroke: style.stroke,
      isLine: isLine,
      layerFrame: layerFrame,
      artboardFrame: artboardFrame
    }),
    strokeWidth: style.stroke.width,
    shadowColor: getPaperShadowColor(style.shadow),
    shadowOffset: getPaperShadowOffset(style.shadow),
    shadowBlur: getPaperShadowBlur(style.shadow),
    blendMode: style.blendMode,
    opacity: style.opacity,
    dashArray: style.strokeOptions.dashArray,
    dashOffset: style.strokeOptions.dashOffset,
    strokeCap: style.strokeOptions.cap,
    strokeJoin: style.strokeOptions.join,
    ...(() => {
      if (textStyle) {
        return {
          fontSize: textStyle.fontSize,
          leading: textStyle.leading,
          fontWeight: textStyle.fontWeight,
          fontFamily: textStyle.fontFamily,
          justification: textStyle.justification,
          letterSpacing: textStyle.letterSpacing
        }
      } else {
        return {};
      }
    })()
  };
}

export const getPaperLayerIndex = (layerItem: Btwx.Layer, parentItem: Btwx.Artboard | Btwx.Group): number => {
  const layerIndex = parentItem.children.indexOf(layerItem.id);
  const underlyingMaskIndex = (layerItem as Btwx.Text).underlyingMask ? parentItem.children.indexOf((layerItem as Btwx.Text).underlyingMask) : null;
  return (layerItem as Btwx.Text).masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
}

export const getLayerAbsBounds = (layerFrame: Btwx.Frame, artboardFrame: Btwx.Frame): paper.Rectangle => {
  const absPosition = getLayerAbsPosition(layerFrame, artboardFrame);
  return new paper.Rectangle({
    from: new paper.Point(absPosition.x - (layerFrame.innerWidth / 2), absPosition.y - (layerFrame.innerHeight / 2)),
    to: new paper.Point(absPosition.x + (layerFrame.innerWidth / 2), absPosition.y + (layerFrame.innerHeight / 2))
  });
}

export const getTextAbsPoint = (textPoint: Btwx.Point, artboardFrame: Btwx.Frame): paper.Point => {
  const point = new paper.Point(textPoint.x, textPoint.y);
  const artboardPosition = new paper.Point(artboardFrame.x, artboardFrame.y);
  return point.add(artboardPosition);
}

interface GetPaperFSColor {
  styleProp: 'fill' | 'stroke';
  style: Btwx.Fill | Btwx.Stroke;
  isLine: boolean;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
}

export const getPaperFSColor = ({ style, isLine, layerFrame, artboardFrame }: GetPaperFSColor): any => {
  const layerAbsPosition = getLayerAbsPosition(layerFrame, artboardFrame ? artboardFrame : null);
  const gradient = style.gradient;
  if (style.enabled) {
    switch(style.fillType) {
      case 'color':
        return {
          hue: style.color.h,
          saturation: style.color.s,
          lightness: style.color.l,
          alpha: style.color.a
        } as paper.Color;
      case 'gradient':
        return {
          gradient: {
            stops: gradient.stops.reduce((result, current) => {
              result = [
                ...result,
                new paper.GradientStop({
                  hue: current.color.h,
                  saturation: current.color.s,
                  lightness: current.color.l,
                  alpha: current.color.a
                } as paper.Color, current.position)
              ];
              return result;
            }, []) as paper.GradientStop[],
            radial: gradient.gradientType === 'radial'
          },
          origin: new paper.Point(
            (gradient.origin.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
            (gradient.origin.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
          ),
          destination: new paper.Point(
            (gradient.destination.x * (isLine ? layerFrame.width : layerFrame.innerWidth)) + layerAbsPosition.x,
            (gradient.destination.y * (isLine ? layerFrame.height : layerFrame.innerHeight)) + layerAbsPosition.y
          )
        } as Btwx.PaperGradientFill;
    }
  } else {
    tinyColor('#fff').setAlpha(0).toHslString() as any;
  }
};

interface GetPaperFillColor {
  fill: Btwx.Fill;
  isLine: boolean;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
}

export const getPaperFillColor = ({ fill, isLine, layerFrame, artboardFrame }: GetPaperFillColor): any => {
  return getPaperFSColor({
    styleProp: 'fill',
    style: fill,
    isLine,
    layerFrame,
    artboardFrame
  });
};

interface GetPaperStrokeColor {
  stroke: Btwx.Stroke;
  isLine: boolean;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
}

export const getPaperStrokeColor = ({ stroke, isLine, layerFrame, artboardFrame }: GetPaperStrokeColor): any => {
  return getPaperFSColor({
    styleProp: 'stroke',
    style: stroke,
    isLine,
    layerFrame,
    artboardFrame
  });
};

export const getPaperShadowColor = (shadow: Btwx.Shadow): any => {
  return shadow.enabled ? { hue: shadow.color.h, saturation: shadow.color.s, lightness: shadow.color.l, alpha: shadow.color.a } : null;
};

export const getPaperShadowOffset = (shadow: Btwx.Shadow): any => {
  return shadow.enabled ? new paper.Point(shadow.offset.x, shadow.offset.y) : null;
};

export const getPaperShadowBlur = (shadow: Btwx.Shadow): any => {
  return shadow.enabled ? shadow.blur : null;
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