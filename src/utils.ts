/* eslint-disable @typescript-eslint/no-use-before-define */
import { BrowserWindow, remote, systemPreferences, ipcRenderer } from 'electron';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { PreviewState } from './store/reducers/preview';
import getTheme from './store/theme';

gsap.registerPlugin(ScrollToPlugin);

export const bufferToBase64 = (buffer: Buffer) => {
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

export const isBetween = (x: number, min: number, max: number): boolean => {
  return x >= min && x <= max;
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
  const leftSidebar = document.getElementById('sidebar-scroll-left');
  const layerDomItem = document.getElementById(id);
  if (leftSidebar && layerDomItem && !layerInScrollView(id)) {
    gsap.set(leftSidebar, {
      scrollTo: {
        y: layerDomItem
      }
    });
  }
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

export const isMac = process.platform === 'darwin';

export const getWindowBackground = (themeName?: Btwx.ThemeName): string => {
  const theme = getTheme(themeName ? themeName : isMac ? systemPreferences.getUserDefault('theme', 'string') : 'dark');
  return theme.background.z0;
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

export const isPreviewWindow = (id = remote.getCurrentWindow().id): Promise<boolean> => {
  return BrowserWindow.fromId(id).webContents.executeJavaScript(`getPreviewState()`).then((previewState: string) => {
    const parsed = JSON.parse(previewState) as PreviewState;
    return parsed.windowId === id;
  });
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