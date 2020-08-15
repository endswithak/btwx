import electron, { app, BrowserWindow, ipcMain, systemPreferences, Menu, dialog, nativeTheme } from 'electron';
import fs from 'fs';
import path from 'path';
import { mainWindow, preferencesWindow, createPreferencesWindow } from './index';

const isMac = process.platform === 'darwin';

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
      {
        label: 'Save',
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: () => {
          mainWindow.webContents.executeJavaScript(`getDocumentSettings()`).then((documentSettingsJSON) => {
            const documentSettings = JSON.parse(documentSettingsJSON);
            if (documentSettings.path) {
              mainWindow.webContents.executeJavaScript(`saveDocument(${documentSettingsJSON})`).then((documentJSON) => {
                fs.writeFile(`${documentSettings.path}.esketch`, documentJSON, function(err) {
                  if(err) {
                    return console.log(err);
                  }
                });
              });
            } else {
              dialog.showSaveDialog(mainWindow, {title: 'Save As'}).then((result) => {
                if (!result.canceled) {
                  const base = path.basename(result.filePath);
                  const fullPath = result.filePath;
                  const documentSettings = {base, fullPath};
                  mainWindow.webContents.executeJavaScript(`saveDocumentAs(${JSON.stringify(documentSettings)})`).then((documentJSON) => {
                    fs.writeFile(`${result.filePath}.esketch`, documentJSON, function(err) {
                      if(err) {
                        return console.log(err);
                      }
                    });
                  });
                }
              });
            }
          });
        }
      },
      {
        label: 'Save As...',
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
        click: () => {
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
                });
              });
            }
          });
        }
      },
      {
        label: 'Open...',
        click: () => {
          dialog.showOpenDialog(mainWindow, {
            filters: [
              { name: 'Custom File Type', extensions: ['esketch'] }
            ],
            properties: ['openFile']
          }).then((result) => {
            if (result.filePaths.length > 0 && !result.canceled) {
              fs.readFile(result.filePaths[0], {encoding: 'utf-8'}, function(err, data) {
                if(err) {
                  return console.log(err);
                } else {
                  mainWindow.webContents.executeJavaScript(`openFile(${data})`);
                }
              });
            }
          });
        }
      },
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

export default menu;