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

interface DrawLayerPath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle | FileFormat.Star | FileFormat.Polygon | FileFormat.Oval;
  opts: any;
}

export const drawLayerPath = ({ layer, opts }: DrawLayerPath): paper.Path => {
  const path = new Path(opts);
  const segments: paper.Segment[] = [];
  layer.points.forEach((point) => {
    const absPoint = getRelPoint({point: point, frame: layer.frame});
    const segmentPoint = new Point(absPoint.point.x, absPoint.point.y);
    const segmentHandleIn = new Point(absPoint.curveTo.x, absPoint.curveTo.y);
    const segmentHandleOut = new Point(absPoint.curveFrom.x, absPoint.curveFrom.y);
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

interface GetBooleanOperation {
  operation: FileFormat.BooleanOperation;
}

export const getBooleanOperation = ({ operation }: GetBooleanOperation): string | null => {
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
  a: paper.PathItem;
  b: paper.PathItem;
}

export const applyBooleanOperation = ({ a, b, operation }: ApplyBooleanOperation): paper.PathItem => {
  const booleanOperation = getBooleanOperation({operation});
  if (booleanOperation) {
    switch(booleanOperation) {
      case 'unite':
        return a.unite(b);
      case 'subtract':
        return a.subtract(b);
      case 'intersect':
        return a.intersect(b);
      case 'exclude':
        return a.exclude(b);
    }
  } else {
    return b;
  }
};

interface GetSymbolMaster {
  instanceId: string;
  symbolId: string;
  symbols: FileFormat.SymbolMaster[];
  overrides?: FileFormat.OverrideValue[];
}

export const getSymbolMaster = ({ instanceId, symbolId, symbols, overrides }: GetSymbolMaster): FileFormat.SymbolMaster => {
  const originalSymbol = symbols.find((symbolMaster) => {
    return symbolMaster.symbolID === symbolId;
  });
  const overrideSymbol = overrides ? overrides.find((override) => {
    return override.overrideName.includes(`${instanceId}_symbolID`);
  }) : null;
  if (overrideSymbol) {
    return symbols.find((symbolMaster) => {
      return symbolMaster.symbolID === overrideSymbol.value;
    });
  } else {
    return originalSymbol;
  }
};

interface GetOverrideString {
  textId: string;
  overrides?: FileFormat.OverrideValue[];
}

export const getOverrideString = ({ textId, overrides }: GetOverrideString): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    return override.overrideName.includes(`${textId}_stringValue`);
  }) : null;
  return overrideString;
};