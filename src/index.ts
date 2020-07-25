/* eslint-disable @typescript-eslint/no-use-before-define */
import electron, { app, BrowserWindow, ipcMain, systemPreferences, Menu, shell, dialog } from 'electron';
import sharp from 'sharp';
import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_TWEEN_DRAWER_HEIGHT,
  PREVIEW_TOPBAR_HEIGHT
} from './constants';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: electron.BrowserWindow;
let previewWindow: electron.BrowserWindow;
let preferencesWindow: electron.BrowserWindow;
const isMac = process.platform === 'darwin';

if (isMac) {
  if (!systemPreferences.getUserDefault('theme', 'string')) {
    systemPreferences.setUserDefault('theme', 'string', 'dark');
  }
  if (!systemPreferences.getUserDefault('leftSidebarWidth', 'integer')) {
    systemPreferences.setUserDefault('leftSidebarWidth', 'integer', DEFAULT_LEFT_SIDEBAR_WIDTH as any);
  }
  if (!systemPreferences.getUserDefault('rightSidebarWidth', 'integer')) {
    systemPreferences.setUserDefault('rightSidebarWidth', 'integer', DEFAULT_RIGHT_SIDEBAR_WIDTH as any);
  }

  if (!systemPreferences.getUserDefault('tweenDrawerHeight', 'integer')) {
    systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', DEFAULT_RIGHT_SIDEBAR_WIDTH as any);
  }
}

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      {
        label: 'Preferences',
        click: () => {
          if (!preferencesWindow) {
            createPreferencesWindow();
          }
        }
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  }
];

const menu = Menu.buildFromTemplate(template as any);
Menu.setApplicationMenu(menu);

const createWindow = (): void => {
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

const createPreferencesWindow = (): void => {
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

const createPreviewWindow = (artboard: em.Artboard): void => {
  previewWindow = new BrowserWindow({
    parent: mainWindow,
    minWidth: artboard.frame.width,
    minHeight: artboard.frame.height + PREVIEW_TOPBAR_HEIGHT,
    width: artboard.frame.width,
    height: artboard.frame.height + PREVIEW_TOPBAR_HEIGHT,
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
app.on('ready', createWindow);

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
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('openPreview', (event, activeArtboard) => {
  const artboard = JSON.parse(activeArtboard);
  createPreviewWindow(artboard);
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