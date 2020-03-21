import paper, { Group, Point, Path, Segment, Rectangle } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface ConvertPointString {
  point: string;
}

const convertPointString = ({ point }: ConvertPointString): {x: number; y: number} => {
  const str = point.replace(/\s/g, '');
  const commaPos = str.indexOf(',');
  const x = Number(str.substring(1, commaPos));
  const y = Number(str.substring(commaPos + 1, str.length - 1));
  return {x,y};
}

interface GetAbsPoint {
  point: FileFormat.CurvePoint;
  frame: FileFormat.Rect;
}

export const getAbsPoint = ({point, frame}: GetAbsPoint): any => {
  const p = convertPointString({point: point.point});
  const cf = convertPointString({point: point.curveFrom});
  const ct = convertPointString({point: point.curveTo});
  return {
    ...point,
    point: {
      ...p,
      x: p.x * frame.width,
      y: p.y * frame.height
    },
    curveFrom: {
      ...cf,
      x: cf.x * frame.width,
      y: cf.y * frame.height
    },
    curveTo: {
      ...ct,
      x: ct.x * frame.width,
      y: ct.y * frame.height
    }
  }
};

interface DrawLayerPath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval;
}

export const drawLayerPath = ({ layer }: DrawLayerPath): paper.Path => {
  const path = new Path({insert: false});
  const segments: paper.Segment[] = [];
  layer.points.forEach((point) => {
    const absPoint = getAbsPoint({point: point, frame: layer.frame});
    const segmentPoint = new Point(absPoint.point.x, absPoint.point.y);
    const segmentHandleIn = new Point(segmentPoint.x - absPoint.curveFrom.x, segmentPoint.y - absPoint.curveFrom.y);
    const segmentHandleOut = new Point(segmentPoint.x - absPoint.curveTo.x, segmentPoint.y - absPoint.curveTo.y);
    const segment = new Segment({
      point: segmentPoint,
      handleOut: point.hasCurveFrom ? segmentHandleOut : null,
      handleIn: point.hasCurveTo ? segmentHandleIn : null
    });
    segments.push(segment);
  });
  path.addSegments(segments);
  return path;
};

interface GetBooleanOperation {
  operation: FileFormat.BooleanOperation;
}

export const getBooleanOperation = ({ operation }: GetBooleanOperation): paper.Style.booleanOperation | null => {
  switch(operation) {
    case 0:
      return 'unite';
    case 1:
      return 'subtract';
    case 2:
      return 'intersect';
    case 3:
      return 'exclude';
    default:
      return null;
  }
};

interface ApplyBooleanOperation {
  operation: FileFormat.BooleanOperation;
  a: paper.Path;
  b: paper.Path;
}

export const applyBooleanOperation = ({ a, b, operation }: ApplyBooleanOperation): void => {
  const booleanOperation = getBooleanOperation({operation});
  if (booleanOperation) {
    return a[booleanOperation](b);
  }
};