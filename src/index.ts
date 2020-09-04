/* eslint-disable @typescript-eslint/no-use-before-define */
import electron, { app, BrowserWindow, ipcMain, systemPreferences, Menu, dialog, nativeTheme } from 'electron';
import fs from 'fs';
import path from 'path';
import menu from './menu';
import getTheme from './store/theme';

import {
  PREVIEW_TOPBAR_HEIGHT,
  MAC_TITLEBAR_HEIGHT,
  WINDOWS_TITLEBAR_HEIGHT,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_TWEEN_DRAWER_HEIGHT,
  DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH
} from './constants';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const windowBackground = ((): string => {
  let theme = getTheme('dark');
  if (isMac) {
    const themeName = systemPreferences.getUserDefault('theme', 'string');
    theme = getTheme(themeName);
  }
  return theme.background.z0;
})();

// export let preferencesWindow: electron.BrowserWindow;
// export let sketchImporterWindow: electron.BrowserWindow;

const isMac = process.platform === 'darwin';

if (isMac) {
  if (!systemPreferences.getUserDefault('theme', 'string')) {
    systemPreferences.setUserDefault('theme', 'string', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  }
  if (!systemPreferences.getUserDefault('leftSidebarWidth', 'integer')) {
    systemPreferences.setUserDefault('leftSidebarWidth', 'integer', DEFAULT_LEFT_SIDEBAR_WIDTH as any);
  }
  if (!systemPreferences.getUserDefault('rightSidebarWidth', 'integer')) {
    systemPreferences.setUserDefault('rightSidebarWidth', 'integer', DEFAULT_RIGHT_SIDEBAR_WIDTH as any);
  }
  if (!systemPreferences.getUserDefault('tweenDrawerHeight', 'integer')) {
    systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', DEFAULT_TWEEN_DRAWER_HEIGHT as any);
  }
  if (!systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer')) {
    systemPreferences.setUserDefault('tweenDrawerLayersWidth', 'integer', DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH as any);
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

export const createNewDocument = (width?: number, height?: number): Promise<electron.BrowserWindow> => {
  return new Promise((resolve) => {
    // Create the browser window.
    const newDocument = new BrowserWindow({
      height: height ? height : 800,
      width: width ? width : 1000,
      minWidth: 1000,
      minHeight: 800,
      frame: false,
      titleBarStyle: 'hidden',
      backgroundColor: windowBackground,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // and load the index.html of the app.
    newDocument.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    newDocument.webContents.openDevTools();

    newDocument.webContents.session.clearStorageData();

    newDocument.webContents.on('did-finish-load', () => {
      newDocument.webContents.session.clearStorageData().then(() => {
        newDocument.webContents.executeJavaScript(`renderNewDocument()`).then(() => {
          resolve(newDocument);
        });
      });
    });
  });
};

// export const createPreferencesWindow = (): void => {
//   preferencesWindow = new BrowserWindow({
//     parent: getFocusedDocument(),
//     height: 600,
//     width: 800,
//     frame: false,
//     titleBarStyle: 'hidden',
//     show: false,
//     backgroundColor: windowBackground,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   });

//   preferencesWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

//   // Open the DevTools.
//   preferencesWindow.webContents.openDevTools();

//   preferencesWindow.webContents.on('did-finish-load', () => {
//     preferencesWindow.webContents.executeJavaScript(`renderPreferencesWindow()`).then(() => {
//       preferencesWindow.show();
//     });
//   });

//   preferencesWindow.on('closed', () => {
//     preferencesWindow = null;
//   });
// };

// export const createSketchImporterWindow = (sketchFile: any): void => {
//   sketchImporterWindow = new BrowserWindow({
//     parent: getFocusedDocument(),
//     height: 600,
//     width: 800,
//     frame: false,
//     titleBarStyle: 'hidden',
//     show: false,
//     backgroundColor: windowBackground,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   });

//   sketchImporterWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

//   // Open the DevTools.
//   sketchImporterWindow.webContents.openDevTools();

//   sketchImporterWindow.webContents.on('did-finish-load', () => {
//     sketchImporterWindow.webContents.executeJavaScript(`renderSketchImporterWindow(${JSON.stringify(sketchFile)})`).then(() => {
//       sketchImporterWindow.show();
//     });
//   });

//   sketchImporterWindow.on('closed', () => {
//     sketchImporterWindow = null;
//   });
// };

const createPreviewWindow = ({width, height}: {width: number; height: number}): void => {
  const previewWindow = new BrowserWindow({
    parent: getFocusedDocument(),
    width: width,
    height: height + PREVIEW_TOPBAR_HEIGHT + (process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT),
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: windowBackground,
    webPreferences: {
      nodeIntegration: true
    }
  });

  previewWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  previewWindow.webContents.openDevTools();

  previewWindow.webContents.on('did-finish-load', () => {
    previewWindow.webContents.executeJavaScript(`renderPreviewWindow()`);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  createNewDocument();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createNewDocument();
  }
});

app.on('open-file', (event, path) => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  handleOpenDocument(path);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
export const getFocusedDocument = (): electron.BrowserWindow => {
  return BrowserWindow.getFocusedWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() : BrowserWindow.getFocusedWindow() : null;
};

// export const handleSketchImport = () => {
//   const document = getFocusedDocument();
//   dialog.showOpenDialog(document, {
//     buttonLabel: 'Import',
//     filters: [{ name: 'Custom File Type', extensions: ['sketch'] }],
//     properties: ['openFile']
//   }).then(result => {
//     if (!result.canceled && result.filePaths.length > 0) {
//       const sketchFilePath = result.filePaths[0];
//       readSketchFile(sketchFilePath).then((sketchJSON) => {
//         if (!sketchImporterWindow) {
//           createSketchImporterWindow(sketchJSON);
//         }
//       });
//     }
//   });
// };

export const handleSave = (path: string, closeOnSave?: boolean): void => {
  const document = getFocusedDocument();
  document.webContents.executeJavaScript(`saveDocument()`).then((documentJSON) => {
    fs.writeFile(`${path}.esketch`, documentJSON, function(err) {
      if(err) {
        return console.log(err);
      }
      if (closeOnSave) {
        document.close();
      }
    });
  });
};

export const handleSaveAs = (closeOnSave?: boolean): void => {
  const document = getFocusedDocument();
  dialog.showSaveDialog(document, {}).then((result) => {
    if (!result.canceled) {
      const base = path.basename(result.filePath);
      const fullPath = result.filePath;
      const documentSettings = {base, fullPath};
      document.webContents.executeJavaScript(`saveDocumentAs(${JSON.stringify(documentSettings)})`).then((documentJSON) => {
        // app.addRecentDocument(result.filePath);
        fs.writeFile(`${result.filePath}.esketch`, documentJSON, function(err) {
          if(err) {
            return console.log(err);
          }
          if (closeOnSave) {
            document.close();
          }
        });
      });
    }
  });
};

export const handleOpenDocument = (filePath: string): void => {
  const document = getFocusedDocument();
  if (document) {
    document.webContents.executeJavaScript(`getCurrentEdit()`).then((currentEditJSON) => {
      const documentClean = JSON.parse(currentEditJSON);
      if (documentClean) {
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
          if(err) {
            return console.log(err);
          } else {
            createNewDocument().then((documentWindow) => {
              documentWindow.webContents.executeJavaScript(`openFile(${data})`);
            });
          }
        });
      } else {
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
          if(err) {
            return console.log(err);
          } else {
            document.webContents.executeJavaScript(`openFile(${data})`);
          }
        });
      }
    });
  } else {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      createNewDocument().then((documentWindow) => {
        documentWindow.webContents.executeJavaScript(`openFile(${data})`);
      });
    });
  }
};

export const handleThemeToggle = (): void => {
  const document = getFocusedDocument();
  if (document) {
    document.webContents.executeJavaScript(`getCurrentTheme()`).then((currentTheme) => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      BrowserWindow.getAllWindows().forEach((window) => {
        const documentWindow = !window.getParentWindow();
        if (window.webContents) {
          window.webContents.executeJavaScript(`setTitleBarTheme(${JSON.stringify(newTheme)})`);
          if (documentWindow) {
            window.webContents.executeJavaScript(`setTheme(${JSON.stringify(newTheme)})`);
          }
        }
      });
    });
  }
}

ipcMain.on('openPreview', (event, windowSize) => {
  const size = JSON.parse(windowSize);
  createPreviewWindow({
    width: Math.round(size.width),
    height: Math.round(size.height)
  });
});

ipcMain.on('updateTheme', (event, theme) => {
  BrowserWindow.getAllWindows().forEach((window) => {
    const documentWindow = !window.getParentWindow();
    if (window.webContents) {
      window.webContents.executeJavaScript(`setTitleBarTheme(${JSON.stringify(theme)})`);
      if (documentWindow) {
        window.webContents.executeJavaScript(`setTheme(${JSON.stringify(theme)})`);
      }
    }
  });
});

ipcMain.on('saveDocument', (event, path) => {
  handleSave(path, true);
});

ipcMain.on('saveDocumentAs', () => {
  handleSaveAs(true);
});