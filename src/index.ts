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
  DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
  DEFAULT_COLOR_FORMAT,
  APP_NAME
} from './constants';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const getWindowBackground = (themeName?: em.ThemeName): string => {
  let theme = getTheme(themeName ? themeName : 'dark');
  if (isMac) {
    const themeName = systemPreferences.getUserDefault('theme', 'string');
    theme = getTheme(themeName);
  }
  return theme.background.z0;
};

export const getFocusedDocument = (): electron.BrowserWindow => {
  return BrowserWindow.getFocusedWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() ? BrowserWindow.getFocusedWindow().getParentWindow() : BrowserWindow.getFocusedWindow() : null;
};

export const getAllOpenDocuments = (): electron.BrowserWindow[] => {
  return BrowserWindow.getAllWindows().filter((window) => window.getTitle() !== 'Preview');
};

// export let preferencesWindow: electron.BrowserWindow;
// export let sketchImporterWindow: electron.BrowserWindow;

const isMac = process.platform === 'darwin';

if (isMac) {
  if (!systemPreferences.getUserDefault('colorFormat', 'string') || (systemPreferences.getUserDefault('colorFormat', 'string') !== 'rgb' || systemPreferences.getUserDefault('colorFormat', 'string') !== 'hsl')) {
    systemPreferences.setUserDefault('colorFormat', 'string', DEFAULT_COLOR_FORMAT as any);
  }
  if (!systemPreferences.getUserDefault('theme', 'string') || (systemPreferences.getUserDefault('theme', 'string') !== 'light' || systemPreferences.getUserDefault('theme', 'string') !== 'dark')) {
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
      height: height ? height : 768,
      width: width ? width : 1200,
      minWidth: 1200,
      minHeight: 768,
      show: false,
      frame: false,
      titleBarStyle: 'hidden',
      backgroundColor: getWindowBackground(),
      webPreferences: {
        nodeIntegration: true
      }
    });

    // and load the index.html of the app.
    newDocument.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    newDocument.webContents.session.clearStorageData();

    newDocument.webContents.on('did-finish-load', () => {
      newDocument.webContents.session.clearStorageData().then(() => {
        newDocument.webContents.executeJavaScript(`renderNewDocument()`).then(() => {
          newDocument.show();
          resolve(newDocument);
        });
      });
    });

    newDocument.on('close', (event) => {
      event.preventDefault();
      newDocument.webContents.executeJavaScript(`getCurrentEdit()`).then((currentEditJSON) => {
        const editState = JSON.parse(currentEditJSON) as { edit: string; dirty: boolean; name: string; path: string };
        if (editState.dirty) {
          openSaveDialog({
            documentState: editState,
            onSave: () => {
              if (editState.path) {
                handleSave(newDocument, editState.path, {close: true});
              } else {
                handleSaveAs(newDocument, {close: true});
              }
            },
            onDontSave: () => {
              newDocument.destroy();
            }
          });
        } else {
          newDocument.destroy();
        }
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
    show: false,
    backgroundColor: getWindowBackground(),
    webPreferences: {
      nodeIntegration: true
    }
  });

  previewWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  previewWindow.webContents.on('did-finish-load', () => {
    previewWindow.webContents.executeJavaScript(`renderPreviewWindow()`).then(() => {
      previewWindow.show();
    });
  });

  previewWindow.on('close', (event) => {
    event.preventDefault();
    previewWindow.getParentWindow().webContents.executeJavaScript(`previewClosed()`).then(() => {
      previewWindow.destroy();
    });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  createNewDocument();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('before-quit', (event) => {
  const openDocuments = getAllOpenDocuments();
  if (openDocuments.length > 0) {
    event.preventDefault();
    const promises = [] as Promise<{editState: { edit: string; dirty: boolean; name: string; path: string }; windowIndex: number}>[];
    const focusedDocument = getFocusedDocument();
    const focusedFirst = openDocuments.reduce((result, current) => {
      if (focusedDocument && focusedDocument.id === current.id) {
        result = [current, ...result];
      } else {
        result = [...result, current];
      }
      return result;
    }, []);
    focusedFirst.forEach((document, index) => {
      promises.push(
        new Promise((resolve) => {
          document.webContents.executeJavaScript(`getCurrentEdit()`).then((documentJSON: any) => resolve({editState: JSON.parse(documentJSON), windowIndex: index}));
        })
      )
    });
    Promise.all(promises).then((documents) => {
      const dirtyDocuments = documents.filter((document) => document.editState.dirty);
      if (dirtyDocuments.length > 0) {
        if (dirtyDocuments.length > 1) {
          dialog.showMessageBox({
            type: 'question',
            buttons: ['Review Changes...', 'Cancel', 'Discard Changes'],
            cancelId: 1,
            message: `You have ${dirtyDocuments.length} ${APP_NAME} documents with unsaved changes. Do you want to review these changes before quitting?`,
            detail: 'If you don’t review your documents, all your unsaved changes will be lost.'
          }).then((data: any) => {
            switch(data.response) {
              case 0: {
                let reviewedDocuments = 0;
                const documentState = dirtyDocuments[reviewedDocuments];
                const documentWindow = focusedFirst[documentState.windowIndex];
                const handleNextSaveDialog = (dState: { edit: string; dirty: boolean; name: string; path: string }, dWindow: electron.BrowserWindow): void => {
                  dWindow.focus();
                  const handleNext = () => {
                    reviewedDocuments++;
                    if (reviewedDocuments < dirtyDocuments.length) {
                      const nextDocumentState = dirtyDocuments[reviewedDocuments];
                      const nextDocumentWindow = focusedFirst[nextDocumentState.windowIndex];
                      handleNextSaveDialog(nextDocumentState.editState, nextDocumentWindow);
                    } else {
                      app.exit();
                      app.quit();
                    }
                  }
                  openSaveDialog({
                    documentState: dState,
                    onSave: () => {
                      if (dState.path) {
                        handleSave(documentWindow, dState.path, { close: true }).then(() => {
                          handleNext();
                        });
                      } else {
                        handleSaveAs(documentWindow, { close: true }).then(() => {
                          handleNext();
                        });
                      }
                    },
                    onDontSave: () => {
                      documentWindow.destroy();
                      handleNext();
                    }
                  });
                }
                handleNextSaveDialog(documentState.editState, documentWindow);
                break;
              }
              case 2: {
                app.exit();
                app.quit();
                break;
              }
            }
          });
        } else {
          const documentState = dirtyDocuments[0];
          const documentWindow = focusedFirst[documentState.windowIndex];
          openSaveDialog({
            documentState: documentState.editState,
            onSave: () => {
              if (documentState.editState.path) {
                handleSave(documentWindow, documentState.editState.path, {quit: true});
              } else {
                handleSaveAs(documentWindow, {quit: true});
              }
            },
            onDontSave: () => {
              app.exit();
              app.quit();
            }
          });
        }
      } else {
        app.exit();
        app.quit();
      }
    });
  }
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

export const openSaveDialog = ({documentState, onSave, onDontSave, onCancel}: {documentState: { edit: string; dirty: boolean; name: string; path: string }; onSave: any; onDontSave: any; onCancel?: any}): void => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Save', 'Cancel', 'Dont Save'],
    cancelId: 1,
    message: `Do you want to save the changes made to the document “${documentState.name}”?`,
    detail: 'Your changes will be lost if you don’t save them.'
  }).then((data: any) => {
    switch(data.response) {
      case 0: {
        onSave();
        break;
      }
      case 1: {
        if (onCancel) {
          onCancel();
        }
        break;
      }
      case 2: {
        onDontSave();
        break;
      }
    }
  });
};

export const handleSave = (document: any, path: string, onSave?: { reload?: boolean; close?: boolean; quit?: boolean }): Promise<any> => {
  if (document) {
    return new Promise((resolve, reject) => {
      document.webContents.executeJavaScript(`saveDocument()`).then((documentJSON: any) => {
        fs.writeFile(`${path}.${APP_NAME}`, documentJSON, function(err) {
          if (err) {
            resolve(err);
          }
          if (onSave && onSave.close) {
            document.destroy();
            resolve();
          }
          if (onSave && onSave.reload) {
            document.reload();
            resolve();
          }
          if (onSave && onSave.quit) {
            app.exit();
            app.quit();
          }
        });
      });
    });
  } else {
    return Promise.resolve();
  }
};

export const handleSaveAs = (document: any, onSave?: { reload?: boolean; close?: boolean; quit?: boolean }): Promise<any> => {
  if (document) {
    return new Promise((resolve, reject) => {
      dialog.showSaveDialog(document, {}).then((result) => {
        if (!result.canceled) {
          const base = path.basename(result.filePath);
          const documentSettings = {base, fullPath: result.filePath};
          document.webContents.executeJavaScript(`saveDocumentAs(${JSON.stringify(documentSettings)})`).then((documentJSON: any) => {
            fs.writeFile(`${result.filePath}.${APP_NAME}`, documentJSON, function(err) {
              if (err) {
                resolve(err);
              } else {
                app.addRecentDocument(`${result.filePath}.${APP_NAME}`);
              }
              if (onSave && onSave.close) {
                document.destroy();
                resolve();
              }
              if (onSave && onSave.reload) {
                document.reload();
                resolve();
              }
              if (onSave && onSave.quit) {
                app.exit();
                app.quit();
              }
            });
          });
        }
      });
    });
  } else {
    return Promise.resolve();
  }
};

export const handleOpenDocument = (filePath: string): void => {
  const document = getFocusedDocument();
  if (document) {
    document.webContents.executeJavaScript(`getCurrentEdit()`).then((currentEditJSON) => {
      const editState = JSON.parse(currentEditJSON) as { edit: string; dirty: boolean; name: string; path: string };
      if (editState.dirty || editState.path) {
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

ipcMain.on('updateTheme', (event, theme: em.ThemeName) => {
  BrowserWindow.getAllWindows().forEach((window) => {
    const documentWindow = !window.getParentWindow();
    window.setBackgroundColor(getWindowBackground(theme));
    if (window.webContents) {
      window.webContents.executeJavaScript(`setTitleBarTheme(${JSON.stringify(theme)})`);
      if (documentWindow) {
        window.webContents.executeJavaScript(`setTheme(${JSON.stringify(theme)})`);
      }
    }
  });
});