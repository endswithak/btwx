/* eslint-disable @typescript-eslint/no-use-before-define */
import { paperMain } from './canvas';
import tinyColor from 'tinycolor2';
import mexp from 'math-expression-evaluator';
import { DEFAULT_TWEEN_EVENTS_TYPES } from './constants';
import { gsap } from 'gsap';

export type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export type ReplaceProps<Inner extends React.ElementType, P> = Omit<React.ComponentPropsWithRef<Inner>, P> & P;

export interface AsProp<As extends React.ElementType = React.ElementType> {
  as?: As;
}

export type PropWithChildren<As extends React.ElementType = React.ElementType> = React.PropsWithChildren<AsProp<As>>;

export interface RefForwardingComponent<TInitial extends React.ElementType, P = unknown> {
  <As extends React.ElementType = TInitial>(props: React.PropsWithChildren<ReplaceProps<As, AsProp<As> & P>>): React.ReactElement | null;
}

export const getShapeIconPathData = (pathData: string): string => {
  const layerIcon = new paperMain.CompoundPath({
    insert: false,
    pathData: pathData
  });
  layerIcon.fitBounds(new paperMain.Rectangle({
    point: new paperMain.Point(0,0),
    size: new paperMain.Size(24,24)
  }));
  return layerIcon.pathData;
}

export const evaluateExp = (expression: any): any => {
  if (expression === 'multi') {
    return expression;
  } else {
    try {
      const value = mexp.eval(`${expression}`);
      return value;
    } catch(error) {
      return null;
    }
  }
}

export const removePaperLayerEventListeners = (paperLayer) => {
  DEFAULT_TWEEN_EVENTS_TYPES.forEach((eventListener) => {
    paperLayer.off((eventListener === 'rightclick' ? 'click' : eventListener) as any);
  });
}

interface AddPaperLayerEventListener {
  eventItem: Btwx.Event;
  eventTimeline: GSAPTimeline;
  eventListener: Btwx.EventType;
  paperLayer: paper.Item;
}

export const addPaperLayerEventListener = ({eventItem, eventTimeline, eventListener, paperLayer}: AddPaperLayerEventListener): any => {
  const handleEmptyTimeline = () => {
    if (eventItem.tweens.allIds.length === 0) {
      eventTimeline.eventCallback('onComplete')();
    } else {
      eventTimeline.play();
    }
  }
  const callback = (e: paper.MouseEvent | paper.KeyEvent): void => {
    if (eventListener === 'rightclick') {
      if ((e as any).event.which === 3) {
        handleEmptyTimeline();
      }
    } else {
      handleEmptyTimeline();
    }
  };
  paperLayer.on(eventListener === 'rightclick' ? 'click' : eventListener, callback);
}

interface GetEventTimelineLayerPaperLayers {
  paperLayer: paper.Item;
  layerItem: Btwx.Layer;
}

export const getEventTimelinePaperLayers = ({ paperLayer, layerItem }: GetEventTimelineLayerPaperLayers) => ({
  paperLayer: paperLayer,
  artboardBackground: layerItem.type === 'Artboard'
    ? paperLayer.getItem({ data: { id: 'artboardBackground' } }) as paper.Path.Rectangle
    : null,
  imageRaster: layerItem.type === 'Image'
    ? paperLayer.getItem({ data: { id: 'imageRaster' } }) as paper.Raster
    : null,
  textContent: layerItem.type === 'Text'
    ? paperLayer.getItem({ data: { id: 'textContent' } }) as paper.PointText
    : null,
  textMask: layerItem.type === 'Text'
    ? paperLayer.getItem({ data: { id: 'textMask' } }) as paper.Path.Rectangle
    : null,
  textBackground: layerItem.type === 'Text'
    ? paperLayer.getItem({ data: { id: 'textBackground' } }) as paper.Path.Rectangle
    : null,
  shapeMask: layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask
    ? paperLayer.parent.getItem({ data: { id: 'mask' } }) as paper.CompoundPath
    : null,
  fillRef: (() => {
    switch(layerItem.type) {
      case 'Artboard':
        return paperLayer.getItem({ data: { id: 'artboardBackground' } });
      case 'Text':
        return paperLayer.getItem({ data: { id: 'textContent' } }) as paper.PointText;
      case 'Image':
        return paperLayer.getItem({ data: { id: 'imageRaster' } }) as paper.Raster;
      default:
        return paperLayer;
    }
  })()
});

export const killTimeline = (eventId) => {
  if (gsap.getById(eventId)) {
    gsap.getById(eventId).pause(0, false).kill();
  }
}

interface HasEventTweensProps {
  layerItem: Btwx.Layer;
  eventItem: Btwx.Event;
}

const hasEventTweens = ({layerItem, eventItem}: HasEventTweensProps): boolean =>
  eventItem.tweens.allIds.some(id => layerItem.tweens.asOrigin.includes(id));

interface ApplyLayerTimelinesProps {
  paperLayer: paper.Item;
  layerItem: Btwx.Layer;
  eventTimelines: {
    [id: string]: GSAPTimeline;
  };
  eventsById: {
    [id: string]: Btwx.Event;
  };
}

export const applyLayerTimelines = ({layerItem, paperLayer, eventTimelines, eventsById}: ApplyLayerTimelinesProps): {
  [id: string]: GSAPTimeline;
} => {
  const eventTimelinePaperLayers = getEventTimelinePaperLayers({
    paperLayer,
    layerItem
  });
  removePaperLayerEventListeners(paperLayer);
  return Object.keys(eventTimelines).reduce((result, current) => {
    const eventItem = eventsById[current];
    const eventTimeline = eventTimelines[current];
    if (hasEventTweens({layerItem, eventItem})) {
      // create layer timeline for event
      const timeline = gsap.timeline({
        id: `${current}-${layerItem.id}`,
        data: {
          ...eventTimelinePaperLayers,
          props: {},
          prevProps: {}
        }
      });
      // add layer timeline
      eventTimeline.add(timeline, 0);
      // update layer timelines
      result = {
        ...result,
        [current]: timeline
      }
    }
    // add event listener if event layer
    if (eventItem.layer === layerItem.id) {
      addPaperLayerEventListener({
        eventItem,
        eventTimeline,
        paperLayer,
        eventListener: eventItem.listener
      });
    }
    return result;
  }, {});
}

export const getPrettyAccelerator = (str: string) => {
  if (str) {
    return str.split('+').join('').replace('Cmd', '⌘').replace('Alt', '⌥').replace('Shift', '⇧').replace('Ctrl', '⌃');
  } else {
    return '';
  }
}

export const getTransformedText = (str: string, textTransform: Btwx.TextTransform): string => {
  switch(textTransform) {
    case 'lowercase':
      return str.toLowerCase();
    case 'uppercase':
      return str.toUpperCase();
    case 'none':
      return str;
  }
}

export const evaluateAccelerator = (str: string): boolean => {
  // github.com/brrd/electron-is-accelerator
  const modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;
  const keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;
  const parts = str.split("+");
  let keyFound = false;
  return parts.every((val, index) => {
    const isKey = keyCodes.test(val);
    const isModifier = modifiers.test(val);
    if (isKey) {
      if (keyFound) {
        return false;
      }
      keyFound = true;
    }
    if (index === parts.length - 1 && !keyFound) {
      return false;
    }
    return isKey || isModifier;
  });
}

export const evaluateHex = (hex: string): string => {
  if (hex === 'multi') {
    return hex;
  } else {
    return tinyColor(hex).toHex();
  }
}

export const evaluatePathData = (pathData: string): string => {
  if (pathData === 'multi') {
    return pathData;
  } else {
    try {
      const shape = new paperMain.CompoundPath({
        pathData: pathData,
        fillColor: '#000',
        insert: false
      });
      if (shape.isEmpty()) {
        return null;
      } else {
        return pathData;
      }
    } catch(error) {
      return null;
    }
  }
}

export const titleCase = (str: string): string => {
  const reg = str.replace( /([A-Z])/g, " $1" );
  return reg.charAt(0).toUpperCase() + reg.slice(1);
}

export const gradientStopsMatch = (gradient1Stops: Btwx.GradientStop[], gradient2Stops: Btwx.GradientStop[]): boolean => {
  const g1SortedStops = [...gradient1Stops].sort((a,b) => { return a.position - b.position });
  const g2SortedStops = [...gradient2Stops].sort((a,b) => { return a.position - b.position });
  const stopsLengthMatch = g1SortedStops.length === g2SortedStops.length;
  let stopsMatch = false;
  if (stopsLengthMatch) {
    stopsMatch = g1SortedStops.every((id, index) => {
      const g1Stop = g1SortedStops[index];
      const g2Stop = g2SortedStops[index];
      const stopColorsMatch = colorsMatch(g1Stop.color, g2Stop.color);
      const stopPositionsMatch = g1Stop.position === g2Stop.position;
      return stopColorsMatch && stopPositionsMatch;
    });
  }
  return stopsMatch;
};

export const gradientsMatch = (gradient1: Btwx.Gradient, gradient2: Btwx.Gradient): boolean => {
  const gradientTypesMatch = gradient1.gradientType === gradient2.gradientType;
  const originsMatch = gradient1.origin.x === gradient2.origin.x && gradient1.origin.y === gradient2.origin.y;
  const destinationsMatch = gradient1.destination.x === gradient2.destination.x && gradient1.destination.y === gradient2.destination.y;
  const stopsMatch = gradientStopsMatch(gradient1.stops, gradient2.stops);
  return gradientTypesMatch && originsMatch && destinationsMatch && stopsMatch;
};

export const colorsMatch = (color1: Btwx.Color, color2: Btwx.Color): boolean => {
  return Object.keys(color1).every((prop: 'h' | 's' | 'l' | 'a') => color1[prop] === color2[prop]);
};

export const base64ToBuffer = (base64String: string): ArrayBuffer => {
  const binaryString = window.atob(base64String);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for(let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const bufferToBase64 = (buffer: Buffer | ArrayBuffer) => {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
};

export const isBetween = (x: number, min: number, max: number): boolean => {
  if (min && max) {
    return x >= min && x <= max;
  } else {
    if (min) {
      return x >= min;
    }
    if (max) {
      return x <= max;
    }
    return true;
  }
};

export const rawRectangleToPaperRectangle = (rect: number[]): paper.Rectangle =>
  new paperMain.Rectangle(rect[0], rect[1], rect[2], rect[3]);

export const paperRectangleToRawRectangle = (rect: paper.Rectangle): number[] =>
  [rect.x, rect.y, rect.width, rect.height];

export const paperRectangleToRelativeRawRectangle = ({
  rect,
  point
}:{
  rect: paper.Rectangle;
  point: number[];
}): number[] =>
  [rect.x - point[0], rect.y - point[1], rect.width, rect.height];

export const rawPointToPaperPoint = (point: number[]): paper.Point =>
  new paperMain.Point(point[0], point[1]);

export const paperPointToRawPoint = (point: paper.Point): number[] =>
  [point.x, point.y];

export const rawSegmentToPaperSegment = (seg: number[][]): paper.Segment =>
  new paperMain.Segment({
    point: seg[0],
    handleIn: seg[1] ? seg[1] : null,
    handleOut: seg[2] ? seg[2] : null
  });

export const paperSegmentToRawSegment = (segment): number[][] =>
  [
    paperPointToRawPoint(segment.point),
    ...(segment.handleIn ? [paperPointToRawPoint(segment.handleIn)] : []),
    ...(segment.handleOut ? [paperPointToRawPoint(segment.handleOut)] : [])
  ];

export const paperSegmentToRelativeRawSegment = ({
  segment,
  point
}:{
  segment: paper.Segment;
  point: number[];
}): number[][] =>
  paperSegmentToRawSegment(segment).map((segmentPoint, index) =>
    index === 0 ? [segmentPoint[0] - point[0], segmentPoint[1] - point[1]] : segmentPoint
  )

export const paperSegmentsToRelativeRawSegments = ({
  segments,
  point
}:{
  segments: paper.Segment[];
  point: number[];
}): number[][][] =>
  segments.map((segment) =>
    paperSegmentToRelativeRawSegment({segment, point})
  )

export const relativeRawSegmentToAbsoluteRawSegment = ({
  segment,
  point
}:{
  segment: number[][];
  point: number[];
}): number[][] =>
  [
    [segment[0][0] + point[0], segment[0][1] + point[1]],
    ...(segment[1] ? [segment[1]] : []),
    ...(segment[2] ? [segment[2]] : []),
  ]

export const relativeRawSegmentsToAbsoluteRawSegments = ({
  segments,
  point
}:{
  segments: number[][][];
  point?: number[];
}): number[][][] =>
  segments.map((segment) =>
    relativeRawSegmentToAbsoluteRawSegment({segment, point})
  )

export const relativeRawSegmentToAbsolutePaperSegment = ({
  segment,
  point
}:{
  segment: number[][];
  point: number[];
}): paper.Segment =>
  rawSegmentToPaperSegment(relativeRawSegmentToAbsoluteRawSegment({segment, point}));

export const relativeRawSegmentsToAbsolutePaperSegments = ({
  segments,
  point
}:{
  segments: number[][][];
  point: number[];
}): paper.Segment[] =>
  segments.map((segment) =>
    relativeRawSegmentToAbsolutePaperSegment({segment, point})
  )

export const rawCurveToPaperCurve = (curve: number[][][]): paper.Curve =>
  new paperMain.Curve(rawSegmentToPaperSegment(curve[0]), rawSegmentToPaperSegment(curve[1]));

export const paperCurveToRawCurve = (seg: paper.Curve): number[][][] =>
  [paperSegmentToRawSegment(seg.segment1),paperSegmentToRawSegment(seg.segment2)];

export const rawCurveLocToPaperCurveLoc = (curveLoc: (number[][][]|number[]|number)[]): paper.CurveLocation =>
  new paperMain.CurveLocation(
    rawCurveToPaperCurve(curveLoc[0] as number[][][]),
    curveLoc[1] as number,
    curveLoc[2] ? rawPointToPaperPoint(curveLoc[2] as number[]) : null
  );

export const paperCurveLocToRawCurveLoc = (curveLoc: paper.CurveLocation): (number[][][]|number[]|number)[] =>
  [
    paperCurveToRawCurve(curveLoc.curve),
    curveLoc.time,
    curveLoc.point ? paperPointToRawPoint(curveLoc.point) : null
  ];

export const getCompoundPathPaths = (compoundPath: paper.CompoundPath): paper.Path[] => {
  const paths: paper.Path[] = [];
  const compoundPaths: paper.PathItem[] = [compoundPath];
  let i = 0;
  while(i < compoundPaths.length) {
    const layer = compoundPaths[i];
    layer.children.forEach((child) => {
      if (child.hasChildren()) {
        compoundPaths.push(child as paper.PathItem);
      } else {
        paths.push(child as paper.Path);
      }
    });
    i++;
  }
  return paths;
}

export const getPathItemSegments = (pathItem: paper.PathItem): paper.Segment[] => {
  if (pathItem.className === 'CompoundPath') {
    return getCompoundPathPaths(pathItem as paper.CompoundPath).reduce((result, current) => {
      return [...result, ...current.segments];
    }, []);
  } else {
    return (pathItem as paper.Path).segments;
  }
}

export const getRawPathItemSegments = (pathItem: paper.PathItem): number[][][] =>
  getPathItemSegments(pathItem).map((seg) => paperSegmentToRawSegment(seg));

export const getShapePath = (shape: paper.Group): paper.Path => {
  const maskGroup = shape.getItem({
    data: { id: 'maskGroup' },
    recursive: false
  }) as paper.Group;
  return maskGroup
    ? maskGroup.getItem({
        data: { id: 'shapePath' },
        recursive: false
      }) as paper.Path
    : shape && shape.getItem({
        data: { id: 'shapePath' },
        recursive: false
      }) as paper.Path;
}

export const getCompoundShapePath = (compoundShape: paper.Group): paper.CompoundPath => {
  const maskGroup = compoundShape.getItem({
    data: { id: 'maskGroup' },
    recursive: false
  }) as paper.Group;
  return maskGroup
    ? maskGroup.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path
    : compoundShape && compoundShape.getItem({
        data: { id: 'compoundShapePath' },
        recursive: false
      }) as paper.Path;
}

export const getShapeItemPathItem = (shapeItem: paper.Group): paper.PathItem => {
  switch(shapeItem.data.layerType) {
    case 'CompoundShape':
      return getCompoundShapePath(shapeItem);
    case 'Shape':
      return getShapePath(shapeItem);
  }
}

export const getShapeItemMaskPathItem = (shapeItem: paper.Group): paper.PathItem => {
  const maskGroup = shapeItem.getItem({
    data: { id: 'maskGroup' },
    recursive: false
  }) as paper.Group;
  return maskGroup
    ? maskGroup.getItem({
        data: { id: 'mask' },
        recursive: false
      }) as paper.Path
    : null;
}

export const getShapeItemRelativeRawSegments = ({
  id,
  layersById
}:{
  id: string;
  layersById: {
    [id: string]: Btwx.Layer;
  };
}): number[][][] => {
  const layerItem = layersById[id] as Btwx.Shape;
  const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
  const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}}) as paper.Group;
  const pathItem = getShapePath(paperLayer);
  return paperSegmentsToRelativeRawSegments({
    segments: pathItem.segments,
    point: [artboardItem.frame.x, artboardItem.frame.y]
  });
};

export const getTopCompoundShape = (id: string, layersById: any): string => {
  const layerItem = layersById[id];
  let currentCompountShape = null;
  for (let i = 0; i < layerItem.scope.length; i++) {
    const scopeId = layerItem.scope[i];
    const scopeItem = layersById[scopeId];
    if (scopeItem.type === 'CompoundShape') {
      currentCompountShape = scopeId;
      break;
    }
  }
  return currentCompountShape;
}

export const getCompoundShapeBoolPath = ({
  id,
  layersById,
  useExistingPaths = false
} : {
  id: string;
  layersById: {
    [id: string]: Btwx.Layer
  };
  useExistingPaths?: boolean;
}): paper.CompoundPath => {
  const handleCompoundShape = ({
    id,
    layersById,
    useExistingPaths = false
  } : {
    id: string;
    layersById: {
      [id: string]: Btwx.Layer;
    };
    useExistingPaths?: boolean;
  }) => {
    const layerItem = layersById[id] as Btwx.CompoundShape;
    const composite = new paperMain.CompoundPath({
      fillColor: 'black',
      insert: false,
      closed: layerItem.closed,
      fillRule: layerItem.fillRule
    });
    for (let i = 0; i < layerItem.children.length; i++) {
      const childItem = layersById[layerItem.children[i]] as Btwx.CompoundShape | Btwx.Shape;
      const artboardItem = layersById[childItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id: layerItem.children[i]}});
      if (childItem.type !== 'CompoundShape') {
        const pathLayer = useExistingPaths ? getShapeItemPathItem(paperLayer as paper.Group).clone({insert: false}) : new paperMain.Path({
          fillColor: 'black',
          segments: relativeRawSegmentsToAbsolutePaperSegments({
            segments: childItem.segments,
            point: [artboardItem.frame.x, artboardItem.frame.y]
          }),
          closed: (childItem as Btwx.Shape).closed,
          insert: false,
          fillRule: childItem.fillRule
        });
        if (childItem.bool === 'none' || i === 0) {
          composite.addChild(pathLayer);
        } else {
          const boolWith = composite.children[composite.children.length - 1];
          const newBool = boolWith[childItem.bool](pathLayer);
          boolWith.replaceWith(newBool);
        }
      } else {
        const newComposite = handleCompoundShape({
          id: layerItem.children[i],
          layersById,
          useExistingPaths
        });
        if (childItem.bool === 'none' || i === 0) {
          composite.addChild(newComposite);
        } else {
          const boolWith = composite.children[composite.children.length - 1];
          const newBool = boolWith[childItem.bool](newComposite);
          boolWith.replaceWith(newBool);
        }
      }
    }
    return composite;
  }
  return handleCompoundShape({
    id,
    layersById,
    useExistingPaths
  });
}

export const getShapeItemPathData = ({
  id,
  layersById,
  icon = false,
  useExistingPaths = false
}:{
  id: string;
  layersById: {
    [id: string]: Btwx.Layer;
  };
  icon?: boolean;
  useExistingPaths?: boolean;
}) => {
  const layerItem = layersById[id] as Btwx.Shape | Btwx.CompoundShape;
  const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
  const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
  let pathData;
  switch(layerItem.type) {
    case 'Shape': {
      if (useExistingPaths) {
        pathData = getShapeItemPathItem(paperLayer as paper.Group).pathData;
      } else {
        pathData = new paperMain.Path({
          fillColor: 'black',
          segments: relativeRawSegmentsToAbsolutePaperSegments({
            segments: layerItem.segments,
            point: [artboardItem.frame.x, artboardItem.frame.y]
          }),
          closed: (layerItem as Btwx.Shape).closed,
          insert: false,
          fillRule: layerItem.fillRule
        }).pathData;
      }
      break;
    }
    case 'CompoundShape': {
      pathData = getCompoundShapeBoolPath({
        id,
        layersById,
        useExistingPaths
      }).pathData;
      break;
    }
  }
  if (icon) {
    const layerIcon = new paperMain.CompoundPath({
      insert: false,
      pathData: pathData
    });
    layerIcon.fitBounds(new paperMain.Rectangle({
      point: new paperMain.Point(0,0),
      size: new paperMain.Size(24,24)
    }));
    return layerIcon.pathData;
  } else {
    return pathData;
  }
}

export const getCompoundShapeBounds = ({
  id,
  layersById,
  useExistingPaths = false
} : {
  id: string;
  layersById: {
    [id: string]: Btwx.Layer
  };
  useExistingPaths?: boolean;
}): Btwx.Frame => {
  const layerItem = layersById[id];
  const artboardItem = layersById[layerItem.artboard];
  const compoundShapeBoolPath = getCompoundShapeBoolPath({
    id,
    layersById,
    useExistingPaths
  });
  const clone = compoundShapeBoolPath.clone({insert: false});
  const x = clone.position.x - artboardItem.frame.x;
  const y = clone.position.y - artboardItem.frame.y;
  const width = clone.bounds.width;
  const height = clone.bounds.height;
  clone.scale(
    layerItem.transform.horizontalFlip ? -1 : 1,
    layerItem.transform.verticalFlip ? -1 : 1
  );
  clone.rotation = -layerItem.transform.rotation;
  const innerWidth = clone.bounds.width;
  const innerHeight = clone.bounds.height;
  return {
    x,
    y,
    width,
    height,
    innerWidth,
    innerHeight
  }
}