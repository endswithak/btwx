/* eslint-disable @typescript-eslint/no-use-before-define */
import paper from 'paper';
import tinyColor from 'tinycolor2';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_RADIUS, DEFAULT_STAR_POINTS, DEFAULT_LINE_FROM, DEFAULT_LINE_TO } from '../../constants';
import { paperMain, paperPreview } from '../../canvas';

export const getShapeIcon = (pathData): string => {
  const layerIcon = new paperMain.CompoundPath({
    pathData: pathData,
    insert: false
  });
  layerIcon.fitBounds(new paperMain.Rectangle({
    point: new paperMain.Point(0,0),
    size: new paperMain.Size(24,24)
  }));
  return layerIcon.pathData;
}

interface GetScaleReset {
  scale: number;
}

export const getScaleReset = ({ scale }: GetScaleReset): number => {
  let resetScale = Number((2 - scale).toFixed(2));
  return resetScale;
}

interface HasPointChange {
  layerItem: Btwx.Text;
}

export const pointChanged = ({ layerItem }: HasPointChange): boolean => {
  const hasFixedResize = layerItem.textStyle.textResize === 'fixed';
  const hasVerticalAlignment = layerItem.textStyle.verticalAlignment !== 'top';
  return hasFixedResize && hasVerticalAlignment;
}

interface GetTextLines {
  paperLayer: paper.PointText;
  leading: number;
  // paragraph: number;
  artboardPosition: any;
  paragraphs: any;
}

export const getTextLines = ({ paperLayer, leading, artboardPosition, paragraphs }: GetTextLines): Btwx.TextLine[] => {
  const newLines = [];
  let lineCount = 0;
  const absAnchor = paperLayer.point;
  paragraphs.forEach((lines: string[], pIndex: number) => {
    lines.forEach((line) => {
      const verticalOffset = lineCount * leading;
      const newLine = new paperMain.PointText({
        point: new paperMain.Point(absAnchor.x, absAnchor.y + verticalOffset),
        content: line,
        style: paperLayer.style,
        insert: false
      });
      newLines.push({
        text: line,
        ...measureTextLine({
          paperLayer: newLine,
          artboardPosition
        })
      });
      lineCount++;
    });
  });
  return newLines;
}

interface PositionTextContent {
  paperLayer: paper.Group;
  justification: Btwx.Jusftification;
  verticalAlignment: Btwx.VerticalAlignment;
  textResize: Btwx.TextResize;
}

export const positionTextContent = ({paperLayer, justification, verticalAlignment, textResize}: PositionTextContent) => {
  const textContent = paperLayer.getItem({ data: { id: 'textContent' }}) as paper.PointText;
  const textBackground = paperLayer.getItem({ data: { id: 'textBackground' }});
  switch(textResize) {
    case 'autoWidth':
      break;
    case 'autoHeight':
      textContent.bounds.top = textBackground.bounds.top;
      (textContent.bounds[justification] as any) = textBackground.bounds[justification];
      break;
    case 'fixed': {
      (textContent.bounds[justification] as any) = textBackground.bounds[justification];
      switch(verticalAlignment) {
        case 'top':
          textContent.bounds.top = textBackground.bounds.top;
          break;
        case 'middle':
          textContent.bounds.center.y = textBackground.bounds.center.y;
          break;
        case 'bottom':
          textContent.bounds.bottom = textBackground.bounds.bottom;
          break;
      }
      break;
    }
  }
}

interface ClearLayerTransforms {
  layerType?: Btwx.LayerType;
  paperLayer: paper.Item;
  transform?: Btwx.Transform;
  variable?: boolean;
  width?: number;
  height?: number;
}

export const clearLayerTransforms = ({ layerType, paperLayer, transform, variable, width, height }: ClearLayerTransforms): paper.Item => {
  let decomposeLayer: paper.Item;
  switch(layerType) {
    case 'Shape':
      decomposeLayer = paperLayer;
      break;
    case 'Text':
      decomposeLayer = paperLayer.getItem({data:{id:'textContent'}});
      break;
    case 'Image':
      decomposeLayer = paperLayer.getItem({data:{id:'imageRaster'}});
      break;
    default:
      decomposeLayer = paperLayer;
  }
  if (variable) {
    // paperLayer.scale(
    //   (transform.horizontalFlip as any) < 0 ? -1 : 1,
    //   (transform.verticalFlip as any) < 0 ? -1 : 1
    // );
    // paperLayer.scale(
    //   width / paperLayer.bounds.width,
    //   height / paperLayer.bounds.height
    // );
    // paperLayer.rotation = -transform.rotation;
    if (layerType !== 'Shape') {
      paperLayer.scale(
        decomposeLayer.matrix.scaling.x < 0 ? -1 : 1,
        decomposeLayer.matrix.scaling.y < 0 ? -1 : 1
      );
    } else {
      paperLayer.scale(
        (transform.horizontalFlip as any) < 0 ? -1 : 1,
        (transform.verticalFlip as any) < 0 ? -1 : 1
      );
    }
    paperLayer.scale(
      width / paperLayer.bounds.width,
      height / paperLayer.bounds.height
    );
    if (layerType !== 'Shape') {
      paperLayer.rotation = -decomposeLayer.matrix.rotation;
    } else {
      paperLayer.rotation = -transform.rotation;
    }
  } else {
    // paperLayer.scale(
    //   transform.horizontalFlip ? -1 : 1,
    //   transform.verticalFlip ? -1 : 1
    // );
    // paperLayer.rotation = -transform.rotation;
    if (layerType !== 'Shape') {
      paperLayer.scale(
        decomposeLayer.matrix.scaling.x < 0 ? -1 : 1,
        decomposeLayer.matrix.scaling.y < 0 ? -1 : 1
      );
      paperLayer.rotation = -decomposeLayer.matrix.rotation;
    } else {
      paperLayer.scale(
        transform.horizontalFlip ? -1 : 1,
        transform.verticalFlip ? -1 : 1
      );
      paperLayer.rotation = -transform.rotation;
    }
  }
  return paperLayer;
}

interface ApplyLayerTransforms {
  paperLayer: paper.Item;
  transform: Btwx.Transform;
  variable?: boolean;
}

export const applyLayerTransforms = ({ paperLayer, transform, variable }: ApplyLayerTransforms): paper.Item => {
  if (variable) {
    paperLayer.rotation = transform.rotation;
    paperLayer.scale(
      Math.abs(transform.horizontalFlip as any),
      Math.abs(transform.verticalFlip as any)
    );
    paperLayer.scale(
      (transform.horizontalFlip as any) < 0 ? -1 : 1,
      (transform.verticalFlip as any) < 0 ? -1 : 1
    );
  } else {
    paperLayer.rotation = transform.rotation;
    paperLayer.scale(
      transform.horizontalFlip ? -1 : 1,
      transform.verticalFlip ? -1 : 1
    );
  }
  return paperLayer;
}

interface ClearTextOblique {
  paperLayer: paper.AreaText;
  oblique: number;
  leading: number;
  fontSize: number;
}

export const clearTextOblique = ({ paperLayer, oblique, leading, fontSize }: ClearTextOblique): paper.AreaText => {
  paperLayer.leading = fontSize;
  paperLayer.skew(new paperMain.Point(oblique, 0));
  paperLayer.leading = leading;
  return paperLayer;
}

interface ApplyTextOblique {
  paperLayer: paper.AreaText;
  oblique: number;
  leading: number;
  fontSize: number;
}

export const applyTextOblique = ({ paperLayer, oblique, leading, fontSize }: ApplyTextOblique): paper.AreaText => {
  paperLayer.leading = fontSize;
  paperLayer.skew(new paperMain.Point(-oblique, 0));
  paperLayer.leading = leading;
  return paperLayer;
}

interface MeasureTextLine {
  paperLayer: paper.PointText;
  artboardPosition: any;
}

interface MeasureTextLineReturn {
  frame: {
    width: number;
    height: number;
    x: number;
    y: number
  };
  anchor: Btwx.Point;
}

export const measureTextLine = ({ paperLayer, artboardPosition }: MeasureTextLine): MeasureTextLineReturn => {
  const linePosition = paperLayer.position;
  const relativePos = linePosition.subtract(artboardPosition);
  const anchor = paperLayer.point.subtract(artboardPosition);
  return {
    frame: {
      x: relativePos.x,
      y: relativePos.y,
      width: paperLayer.bounds.width,
      height: paperLayer.bounds.height
    },
    anchor: {
      x: anchor.x,
      y: anchor.y
    }
  }
}

interface GetTextInnerBounds {
  paperLayer: paper.Group;
  frame: Btwx.Frame;
  textResize: Btwx.TextResize;
  artboardPosition: paper.Point;
}

export const getTextInnerBounds = ({ paperLayer, frame, textResize, artboardPosition }: GetTextInnerBounds): { x: number; y: number; innerWidth: number; innerHeight: number } => {
  const textContent = paperLayer.getItem({data:{id:'textContent'}});
  let innerWidth;
  let innerHeight;
  let x;
  let y;
  switch(textResize) {
    case 'autoWidth':
      innerWidth = textContent.bounds.width;
      innerHeight = textContent.bounds.height;
      x = textContent.position.x - artboardPosition.x;
      y = textContent.position.y - artboardPosition.y;
      break;
    case 'autoHeight':
      innerWidth = frame.innerWidth;
      innerHeight = textContent.bounds.height;
      x = frame.x;
      y = textContent.position.y - artboardPosition.y;
      break;
    case 'fixed':
      innerWidth = frame.innerWidth;
      innerHeight = frame.innerHeight;
      x = frame.x;
      y = frame.y;
      break;
  }
  return {
    x,
    y,
    innerWidth,
    innerHeight
  }
}

interface ResizeTextBoundingBox {
  paperLayer: paper.Group;
  innerBounds: { x: number; y: number; innerWidth: number; innerHeight: number };
  artboardPosition: paper.Point;
}

export const resizeTextBoundingBox = ({paperLayer, innerBounds, artboardPosition}: ResizeTextBoundingBox): void => {
  const textBackground = paperLayer.getItem({data:{id:'textBackground'}});
  const textMask = paperLayer.getItem({data:{id:'textMask'}});
  const topLeft = new paperMain.Point(innerBounds.x - (innerBounds.innerWidth / 2), innerBounds.y - (innerBounds.innerHeight / 2)).add(artboardPosition).round();
  const bottomRight = new paperMain.Point(innerBounds.x + (innerBounds.innerWidth / 2), innerBounds.y + (innerBounds.innerHeight / 2)).add(artboardPosition).round();
  const newBounds = new paperMain.Rectangle({from: topLeft, to: bottomRight});
  textBackground.bounds = newBounds;
  textMask.bounds = newBounds;
}

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

export const getLayerTextContent = (text: string, textTransform: Btwx.TextTransform): string => {
  switch(textTransform) {
    case 'none':
      return text;
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
  }
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
    blur: style.blur.enabled ? style.blur.radius : null,
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
          letterSpacing: textStyle.letterSpacing,
          fontStyle: textStyle.fontStyle,
          textTransform: textStyle.textTransform,
          verticalAlignment: textStyle.verticalAlignment,
          textResize: textStyle.textResize
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
    tinyColor('#fff').setAlpha(0).toRgbString() as any;
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