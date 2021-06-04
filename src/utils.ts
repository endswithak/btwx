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
  eventTimeline: GSAPTimeline;
  eventListener: Btwx.EventType;
  paperLayer: paper.Item;
}

export const addPaperLayerEventListener = ({eventTimeline, eventListener, paperLayer}: AddPaperLayerEventListener): any => {
  const callback = (e: paper.MouseEvent | paper.KeyEvent): void => {
    if (eventListener === 'rightclick') {
      if ((e as any).event.which === 3) {
        eventTimeline.play();
      }
    } else {
      eventTimeline.play();
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

export const buildContentMenuTemplate = (args, btwxElectron, type: 'document' | 'preview')  => {
  const { instanceId, template } = JSON.parse(args, (key, value) => {
    if (key === 'click') {
      const { id, params } = value;
      return (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
        const instance = btwxElectron.instance.byId[instanceId];
        if (instance) {
          instance[type].webContents.executeJavaScript(`${id}(${JSON.stringify(params)})`);
        }
      }
    } else {
      return value;
    }
  });
  return template;
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
}

export const bufferToBase64 = (buffer: Buffer) => {
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
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