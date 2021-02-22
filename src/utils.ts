/* eslint-disable @typescript-eslint/no-use-before-define */
import { BrowserWindow, remote, systemPreferences, ipcRenderer } from 'electron';
import tinyColor from 'tinycolor2';
import mexp from 'math-expression-evaluator';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FixedSizeTree as Tree } from '../react-vtree';
import { PreviewState } from './store/reducers/preview';
import getTheme from './store/theme';

gsap.registerPlugin(ScrollToPlugin);

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

export const clearTouchbar = () => {
  const emptyTouchbar = new remote.TouchBar({});
  remote.getCurrentWindow().setTouchBar(emptyTouchbar);
}

export const evaluateHex = (hex: string): string => {
  if (hex === 'multi') {
    return hex;
  } else {
    return tinyColor(hex).toHex();
  }
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

export const layerInScrollView = (id: string) => {
  const layerDomItem = document.getElementById(id);
  const rect = layerDomItem.getBoundingClientRect();
  const top = rect.top;
  const height = 32;
  const bottom = top + height;
  const parent = document.getElementById('sidebar-scroll-left');
  const parentRect = parent.getBoundingClientRect();
  return top <= parentRect.top
         ? parentRect.top - top <= height
         : bottom - parentRect.bottom <= height;
};

export const scrollToLayer = (id: string) => {
  console.log(Tree);
  // const leftSidebar = document.getElementById('sidebar-scroll-left');
  // const layerDomItem = document.getElementById(id);
  // if (leftSidebar && layerDomItem && !layerInScrollView(id)) {
  //   gsap.set(leftSidebar, {
  //     scrollTo: {
  //       y: layerDomItem
  //     }
  //   });
  // }
};

export const getFocusedDocument = (focused?: BrowserWindow): Promise<BrowserWindow> => {
  return new Promise((resolve, reject) => {
    const focusedWindow = focused ? focused : BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      isPreviewWindow(focusedWindow.id).then((previewWindow) => {
        if (previewWindow) {
          getDocumentWindow(focusedWindow.id).then((documentWindow) => {
            resolve(documentWindow);
          });
        } else {
          return resolve(focusedWindow);
        }
      });
    } else {
      return resolve(null);
    }
  })
};

export const getFocusedDocumentFromRenderer = (focused?: BrowserWindow): Promise<BrowserWindow> => {
  return new Promise((resolve, reject) => {
    const focusedWindow = focused ? focused : remote.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      isPreviewWindow(focusedWindow.id, true).then((previewWindow) => {
        if (previewWindow) {
          getDocumentWindow(focusedWindow.id, true).then((documentWindow) => {
            resolve(documentWindow);
          });
        } else {
          return resolve(focusedWindow);
        }
      });
    } else {
      return resolve(null);
    }
  })
};

export const isMac = process.platform === 'darwin';

export const getWindowBackground = (themeName?: Btwx.ThemeName): string => {
  const theme = getTheme(themeName ? themeName : isMac ? systemPreferences.getUserDefault('theme', 'string') : 'dark');
  return tinyColor(theme.background.z0).setAlpha(0).toHex8String();
};

export const getAllWindowPreviewStates = (fromRenderer?: boolean): Promise<{previewState: PreviewState; windowId: number}[]> => {
  const allWindows = fromRenderer ? remote.BrowserWindow.getAllWindows() : BrowserWindow.getAllWindows();
  const promises = [] as Promise<{previewState: PreviewState; windowId: number}>[];
  allWindows.forEach((window, index) => {
    promises.push(
      new Promise((resolve) => {
        window.webContents.executeJavaScript(`getPreviewState()`).then((previewJSON: string) => resolve({previewState: JSON.parse(previewJSON) as PreviewState, windowId: window.id}));
      })
    )
  });
  return Promise.all(promises).then((documents) => {
    return documents;
  });
};

export const getAllDocumentWindows = (fromRenderer?: boolean): Promise<BrowserWindow[]> => {
  return getAllWindowPreviewStates(fromRenderer).then((previewStates: {previewState: PreviewState; windowId: number}[]) => {
    return previewStates.reduce((result, current) => {
      if (current.previewState.documentWindowId === current.windowId) {
        result = [...result, fromRenderer ? remote.BrowserWindow.fromId(current.windowId) : BrowserWindow.fromId(current.windowId)];
      }
      return result;
    }, []) as BrowserWindow[];
  });
};

export const getAllPreviewWindows = (fromRenderer?: boolean): Promise<BrowserWindow[]> => {
  return getAllWindowPreviewStates(fromRenderer).then((previewStates: {previewState: PreviewState; windowId: number}[]) => {
    return previewStates.reduce((result, current) => {
      if (current.previewState.windowId === current.windowId) {
        result = [...result, fromRenderer ? remote.BrowserWindow.fromId(current.windowId) : BrowserWindow.fromId(current.windowId)];
      }
      return result;
    }, []) as BrowserWindow[];
  });
};

export const getDocumentWindow = (previewWindowId: number, fromRenderer?: boolean): Promise<BrowserWindow> => {
  return getAllWindowPreviewStates(fromRenderer).then((previewStates: {previewState: PreviewState; windowId: number}[]) => {
    const windowState = previewStates.find((state: {previewState: PreviewState; windowId: number}) => {
      return state.previewState.documentWindowId === state.windowId && state.previewState.windowId === previewWindowId;
    });
    if (windowState) {
      return fromRenderer ? remote.BrowserWindow.fromId(windowState.windowId) : BrowserWindow.fromId(windowState.windowId);
    } else {
      return null;
    }
  });
};

export const getPreviewWindow = (documentWindowId: number, fromRenderer?: boolean): Promise<BrowserWindow> => {
  return getAllWindowPreviewStates(fromRenderer).then((previewStates: {previewState: PreviewState; windowId: number}[]) => {
    const windowState = previewStates.find((state: {previewState: PreviewState; windowId: number}) => {
      return state.previewState.windowId === state.windowId && state.previewState.documentWindowId === documentWindowId;
    });
    if (windowState) {
      return fromRenderer ? remote.BrowserWindow.fromId(windowState.windowId) : BrowserWindow.fromId(windowState.windowId);
    } else {
      return null;
    }
  });
};

export const isPreviewWindow = (id = remote.getCurrentWindow().id, fromRenderer?: boolean): Promise<boolean> => {
  if (fromRenderer) {
    return remote.BrowserWindow.fromId(id).webContents.executeJavaScript(`getPreviewState()`).then((previewState: string) => {
      const parsed = JSON.parse(previewState) as PreviewState;
      return parsed.windowId === id;
    });
  } else {
    return BrowserWindow.fromId(id).webContents.executeJavaScript(`getPreviewState()`).then((previewState: string) => {
      const parsed = JSON.parse(previewState) as PreviewState;
      return parsed.windowId === id;
    });
  }
};

export const isDocumentWindow = (id = remote.getCurrentWindow().id): Promise<boolean> => {
  return BrowserWindow.fromId(id).webContents.executeJavaScript(`getPreviewState()`).then((previewState: string) => {
    const parsed = JSON.parse(previewState) as PreviewState;
    return parsed.documentWindowId === id;
  });
};

export const handleDocumentClose = (id: number): Promise<void> => {
  return getPreviewWindow(id).then((previewWindow) => {
    if (previewWindow) {
      previewWindow.destroy();
    }
    BrowserWindow.fromId(id).destroy();
  });
};

export const setMenuItem = (menuItem: { id: string; enabled: boolean; checked?: boolean }) => {
  const menu = remote.Menu.getApplicationMenu();
  const electronMenuItem = menu.getMenuItemById(menuItem.id);
  electronMenuItem.enabled = menuItem.enabled;
  if (menuItem.checked !== null || menuItem.checked !== undefined) {
    electronMenuItem.checked = menuItem.checked;
  }
}

export const setMenuItems = (menuItems: any) => {
  const menu = remote.Menu.getApplicationMenu();
  Object.keys(menuItems).forEach((key: string) => {
    const menuItem = (menuItems as any)[key] as { id: string; enabled: boolean; checked?: boolean };
    const electronMenuItem = menu.getMenuItemById(key);
    electronMenuItem.enabled = menuItem.enabled;
    if (menuItem.checked !== null || menuItem.checked !== undefined) {
      electronMenuItem.checked = menuItem.checked;
    }
  });
}