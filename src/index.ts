/* eslint-disable @typescript-eslint/no-use-before-define */
import electron, { app, BrowserWindow, ipcMain, systemPreferences, Menu, dialog, nativeTheme } from 'electron';
import fs from 'fs';
import path from 'path';
import menu from './menu';
import preferences from './preferences';
import sharp from 'sharp';
import { PREVIEW_TOPBAR_HEIGHT } from './constants';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

export let mainWindow: electron.BrowserWindow;
export let previewWindow: electron.BrowserWindow;
export let preferencesWindow: electron.BrowserWindow;

Menu.setApplicationMenu(menu);

const createMainWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    titleBarStyle: 'hidden'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.session.clearStorageData();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.session.clearStorageData().then(() => {
      mainWindow.webContents.executeJavaScript(`renderMainWindow()`);
    });
  });
};

export const createPreferencesWindow = (): void => {
  preferencesWindow = new BrowserWindow({
    parent: mainWindow,
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    titleBarStyle: 'hidden',
    show: false
  });

  preferencesWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  preferencesWindow.webContents.openDevTools();

  preferencesWindow.webContents.on('did-finish-load', () => {
    preferencesWindow.webContents.executeJavaScript(`renderPreferencesWindow()`).then(() => {
      preferencesWindow.show();
    });
  });

  preferencesWindow.on('close', () => {
    preferencesWindow = null;
  });
}

const createPreviewWindow = ({width, height}: {width: number; height: number}): void => {
  previewWindow = new BrowserWindow({
    parent: mainWindow,
    width: width,
    height: height + PREVIEW_TOPBAR_HEIGHT,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    titleBarStyle: 'hidden'
  });

  previewWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  previewWindow.webContents.openDevTools();

  previewWindow.webContents.on('did-finish-load', () => {
    previewWindow.webContents.executeJavaScript(`renderPreviewWindow()`);
  });

  previewWindow.on('close', () => {
    previewWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

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
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('openPreview', (event, windowSize) => {
  const size = JSON.parse(windowSize);
  createPreviewWindow({
    width: Math.round(size.width),
    height: Math.round(size.height)
  });
});

ipcMain.on('updateTheme', (event, theme) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`updateTheme()`);
  }
  if (previewWindow && previewWindow.webContents) {
    previewWindow.webContents.executeJavaScript(`updateTheme()`);
  }
  if (preferencesWindow && preferencesWindow.webContents) {
    preferencesWindow.webContents.executeJavaScript(`updateTheme()`);
  }
});

ipcMain.on('addImage', (event, arg) => {
  dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'Images', extensions: ['jpg', 'png'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (result.filePaths.length > 0 && !result.canceled) {
      sharp(result.filePaths[0]).metadata().then(({ width }) => {
        sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer().then((buffer) => {
          event.reply('addImage-reply', JSON.stringify(buffer));
        });
      });
    }
  });
});

ipcMain.on('saveDocument', (event, path) => {
  mainWindow.webContents.executeJavaScript(`saveDocument()`).then((documentJSON) => {
    fs.writeFile(`${path}.esketch`, documentJSON, function(err) {
      if(err) {
        return console.log(err);
      }
      mainWindow.close();
    });
  });
});

ipcMain.on('saveDocumentAs', (event, arg) => {
  dialog.showSaveDialog(mainWindow, {}).then((result) => {
    if (!result.canceled) {
      const base = path.basename(result.filePath);
      const fullPath = result.filePath;
      const documentSettings = {base, fullPath};
      mainWindow.webContents.executeJavaScript(`saveDocumentAs(${JSON.stringify(documentSettings)})`).then((documentJSON) => {
        fs.writeFile(`${result.filePath}.esketch`, documentJSON, function(err) {
          if(err) {
            return console.log(err);
          }
          mainWindow.close();
        });
      });
    }
  });
});