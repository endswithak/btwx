import paper, { Point, Path, Segment } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface ConvertPointString {
  point: string;
}

export const convertPointString = ({ point }: ConvertPointString): {x: number; y: number} => {
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

interface GetRelPoint {
  point: FileFormat.CurvePoint;
  frame: FileFormat.Rect;
}

export const getRelPoint = ({point, frame}: GetRelPoint): any => {
  const absPoint = getAbsPoint({point, frame});
  const p = absPoint.point;
  const cf = absPoint.curveFrom;
  const ct = absPoint.curveTo;
  const cfxDiff = cf.x - p.x;
  const cfyDiff = cf.y - p.y;
  const ctxDiff = ct.x - p.x;
  const ctyDiff = ct.y - p.y;
  return {
    ...absPoint,
    curveFrom: {
      ...cf,
      x: cfxDiff,
      y: cfyDiff
    },
    curveTo: {
      ...ct,
      x: ctxDiff,
      y: ctyDiff
    }
  }
};

interface DrawShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval;
  opts: any;
}

export const drawShapePath = ({ layer, opts }: DrawShapePath): paper.Path => {
  const path = new Path(opts);
  const segments: paper.Segment[] = [];
  layer.points.forEach((point) => {
    const relPoint = getRelPoint({point: point, frame: layer.frame});
    const segmentPoint = new Point(relPoint.point.x, relPoint.point.y);
    const segmentHandleIn = new Point(relPoint.curveTo.x, relPoint.curveTo.y);
    const segmentHandleOut = new Point(relPoint.curveFrom.x, relPoint.curveFrom.y);
    const segment = new Segment({
      point: segmentPoint,
      handleIn: point.hasCurveTo ? segmentHandleIn : null,
      handleOut: point.hasCurveFrom ? segmentHandleOut : null
    });
    segments.push(segment);
  });
  path.addSegments(segments);
  return path;
};