/* eslint-disable @typescript-eslint/no-use-before-define */
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { paperMain } from '../../';
import { convertPointString } from './general';

interface DrawShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval;
  opts: any;
}

export const drawShapePath = ({ layer, opts }: DrawShapePath): paper.Path => {
  const path = new paperMain.Path(opts);
  const segments: paper.Segment[] = [];
  layer.points.forEach((point) => {
    const relPoint = getRelPoint({point: point, frame: layer.frame});
    const segmentPoint = new paperMain.Point(relPoint.point.x, relPoint.point.y);
    const segmentHandleIn = new paperMain.Point(relPoint.curveTo.x, relPoint.curveTo.y);
    const segmentHandleOut = new paperMain.Point(relPoint.curveFrom.x, relPoint.curveFrom.y);
    const segment = new paperMain.Segment({
      point: segmentPoint,
      handleIn: point.hasCurveTo ? segmentHandleIn : null,
      handleOut: point.hasCurveFrom ? segmentHandleOut : null
    });
    segments.push(segment);
  });
  path.addSegments(segments);
  return path;
};

interface GetAbsPoint {
  point: FileFormat.CurvePoint;
  frame: FileFormat.Rect;
}

export const getAbsPoint = ({point, frame}: GetAbsPoint): any => {
  const p = convertPointString(point.point);
  const cf = convertPointString(point.curveFrom);
  const ct = convertPointString(point.curveTo);
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

interface ConvertPoints {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval;
}

export const convertPoints = ({ layer }: ConvertPoints): em.CurvePoint[] => {
  const curvePoints: em.CurvePoint[] = [];
  const newPoint = (sketchPoint: any) => {
    curvePoints.push({
      point: {
        x: sketchPoint.point.x,
        y: sketchPoint.point.y
      },
      handleIn: sketchPoint.hasCurveTo ? {
        x: sketchPoint.curveTo.x,
        y: sketchPoint.curveTo.y
      } : null,
      handleOut: sketchPoint.hasCurveFrom ? {
        x: sketchPoint.curveFrom.x,
        y: sketchPoint.curveFrom.y
      } : null
    });
  }
  layer.points.forEach((point) => {
    const relPoint = getRelPoint({point: point, frame: layer.frame});
    newPoint(relPoint);
  });
  return curvePoints;
};

interface GetWindingRule {
  windingRule: number;
}

export const getWindingRule = ({ windingRule }: GetWindingRule): string => {
  switch(windingRule) {
    case 0:
      return 'nonzero';
    case 1:
      return 'evenodd';
  }
};