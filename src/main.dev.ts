/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, session, Menu, nativeTheme, dialog, nativeImage, globalShortcut, TouchBar } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { StateWithHistory } from 'redux-undo';
import { KeyBindingsState, initialMacState as initialMacKeyBindingsState, initialWindowsState as initialWindowsKeyBindingsState } from './store/reducers/keyBindings';
import { PreferencesState, initialState as initialPreferencesState } from './store/reducers/preferences';
import { SessionState } from './store/reducers/session';
import { ArtboardPresetsState, initialState as initialArtboardPresetsState } from './store/reducers/artboardPresets';
import { LayerState } from './store/reducers/layer';
import { DocumentSettingsState } from './store/reducers/documentSettings';
import { ViewSettingsState } from './store/reducers/viewSettings';
import { APP_NAME, MIN_DOCUMENT_WIDTH, MIN_DOCUMENT_HEIGHT, DEFAULT_MAC_DEVICE, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT, PREVIEW_TOPBAR_HEIGHT, TWEEN_PROPS_MAP } from './constants';
import { THEME_DARK_RECORDING } from './theme';
import { addItem, removeItem } from './store/utils/general';
import noInstancesMenu from './menu';
import { buildContentMenuTemplate } from './utils';

// export default class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

interface BtwxInstanceDocumentState {
  layer?: StateWithHistory<LayerState>;
  documentSettings?: DocumentSettingsState;
  viewSettings?: ViewSettingsState;
}

interface BtwxInstanceEditState {
  edit: Btwx.Edit;
  dirty: boolean;
  name: string;
  path: string
}

interface BtwxInstanceSaveState {
  instance: BtwxInstance;
  editState: BtwxInstanceEditState;
}

interface BtwxInstance {
  id: string;
  document: BrowserWindow | null;
  preview: BrowserWindow | null;
  documentPath?: string;
}

export interface BtwxElectron {
  preferences: BrowserWindow | null;
  instance: {
    allIds: string[];
    byId: {
      [id: string]: BtwxInstance;
    };
  };
  menu: {
    default: Menu | null;
    input: Menu | null;
    noInstances: Menu | null;
  };
  contextMenu: {
    layer: Menu | null;
    event: Menu | null;
    artboardPreset: Menu | null;
    tweenLayer: Menu | null;
  };
}

let btwxElectron: BtwxElectron = {
  preferences: null,
  instance: {
    allIds: [],
    byId: {}
  },
  menu: {
    default: null,
    input: null,
    noInstances: noInstancesMenu
  },
  contextMenu: {
    layer: null,
    event: null,
    artboardPreset: null,
    tweenLayer: null
  }
}

const store = new Store({
  watch: true,
  defaults: {
    session: {
      platform: process.platform
    },
    preferences: initialPreferencesState,
    keyBindings: process.platform === 'darwin' ? {...initialMacKeyBindingsState, defaults: initialMacKeyBindingsState} : {...initialWindowsKeyBindingsState, defaults: initialWindowsKeyBindingsState},
    artboardPresets: initialArtboardPresetsState
  }
});

// reset store in development
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  store.set({
    preferences: initialPreferencesState,
    keyBindings: process.platform === 'darwin' ? {...initialMacKeyBindingsState, defaults: initialMacKeyBindingsState} : {...initialWindowsKeyBindingsState, defaults: initialWindowsKeyBindingsState},
    artboardPresets: initialArtboardPresetsState
  });
}

store.onDidChange('preferences', (newValue, oldValue) => {
  if (btwxElectron.instance.allIds.length > 0) {
    btwxElectron.instance.allIds.forEach((id: string) => {
      const instance = btwxElectron.instance.byId[id];
      instance.document.webContents.executeJavaScript(`hydratePreferences(${JSON.stringify(newValue)})`);
      instance.preview.webContents.executeJavaScript(`hydratePreferences(${JSON.stringify(newValue)})`);
    });
  }
});

store.onDidChange('keyBindings', (newValue, oldValue) => {
  if (btwxElectron.instance.allIds.length > 0) {
    btwxElectron.instance.allIds.forEach((id: string) => {
      const instance = btwxElectron.instance.byId[id];
      instance.document.webContents.executeJavaScript(`hydrateKeyBindings(${JSON.stringify(newValue)})`);
      instance.preview.webContents.executeJavaScript(`hydrateKeyBindings(${JSON.stringify(newValue)})`);
    });
  }
});

// store.onDidChange('artboardPresets', (newValue, oldValue) => {
//   if (btwxElectron.instance.allIds.length > 0) {
//     btwxElectron.instance.allIds.forEach((id: number) => {
//       const instance = btwxElectron.instance.byId[id];
//       if (instance && instance.document) {
//         const document = instance.document;
//         document.webContents.executeJavaScript(`hydrateArtboardPresets(${JSON.stringify(newValue)})`);
//       }
//     });
//   }
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

export const handleInstanceClose = (instanceId: string) => {
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.destroy();
  instance.document.destroy();
};

interface HandleExecute {
  instance: BtwxInstance;
  window: Btwx.WindowType;
  func: string;
  payloadString?: string;
  callback?: any;
}

const handleExecute = ({instance, window, func, payloadString = '', callback = null}: HandleExecute) => {
  if (instance && instance[window]) {
    if (!instance[window].webContents.isLoading()) {
      instance[window].webContents.executeJavaScript(`${func}(${payloadString})`).then(() => {
        if (callback) {
          callback();
        }
      });
    } else {
      instance[window].webContents.on('did-finish-load', () => {
        instance[window].webContents.executeJavaScript(`${func}(${payloadString})`).then(() => {
          if (callback) {
            callback();
          }
        });;
      });
    }
  } else {
    console.error('execute error: invalid instance');
  }
}

const getFocusedInstance = (): string => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow && btwxElectron.instance.allIds.length > 0) {
    const focusedWindowId = focusedWindow.id;
    return btwxElectron.instance.allIds.find((id) => {
      const currentInstance = btwxElectron.instance.byId[id];
      if (currentInstance.document.id === focusedWindowId || currentInstance.preview.id === focusedWindowId) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    return null;
  }
};

const getFocusedInstanceDocument = (): BrowserWindow => {
  const focusedInstance = getFocusedInstance();
  if (focusedInstance) {
    const instance = btwxElectron.instance.byId[focusedInstance];
    return instance.document;
  } else {
    return null;
  }
};

const getDocumentStateWithTree = (documentState: BtwxInstanceDocumentState): BtwxInstanceDocumentState => ({
  ...documentState,
  layer: {
    ...documentState.layer,
    present: {
      ...documentState.layer.present,
      tree: {
        ...documentState.layer.present.tree,
        byId: documentState.layer.present.byId
      }
    }
  }
});

const getWriteDocumentState = (documentState: BtwxInstanceDocumentState, documentPath: string): BtwxInstanceDocumentState => ({
  ...documentState,
  documentSettings: {
    ...documentState.documentSettings,
    name: path.basename(documentPath),
    path: documentPath,
    edit: documentState.layer.present.edit.id
  }
});

export const createInstance = async ({
  width = MIN_DOCUMENT_WIDTH,
  height = MIN_DOCUMENT_HEIGHT,
  initialState = {}
}: {
  width?: number;
  height?: number;
  initialState?: BtwxInstanceDocumentState
}) => {

  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const INSTANCE_ID = uuidv4();

  btwxElectron = {
    ...btwxElectron,
    instance: {
      allIds: [...btwxElectron.instance.allIds, INSTANCE_ID],
      byId: {
        ...btwxElectron.instance.byId,
        [INSTANCE_ID]: {
          documentPath: initialState && initialState.documentSettings && initialState.documentSettings.path ? initialState.documentSettings.path : null,
          id: INSTANCE_ID,
          document: new BrowserWindow({
            show: false,
            width: width,
            height: height,
            minWidth: MIN_DOCUMENT_WIDTH,
            minHeight: MIN_DOCUMENT_HEIGHT,
            icon: getAssetPath('icon.png'),
            backgroundColor: '#00000000',
            vibrancy: 'sidebar',
            transparent: true,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: false
            },
          }),
          preview: new BrowserWindow({
            show: false,
            width: DEFAULT_MAC_DEVICE.width,
            height: DEFAULT_MAC_DEVICE.height,
            icon: getAssetPath('icon.png'),
            backgroundColor: '#00000000',
            vibrancy: 'sidebar',
            transparent: true,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: false
            },
          })
        }
      }
    }
  }

  const instance = btwxElectron.instance.byId[INSTANCE_ID];

  instance.document.loadURL(`file://${__dirname}/index.html`);
  instance.preview.loadURL(`file://${__dirname}/index.html`);

  instance.document.webContents.on('did-finish-load', () => {
    if (!instance.document) {
      throw new Error('"documentWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      instance.document.minimize();
    } else {
      instance.document.show();
      instance.document.focus();
    }
    instance.document.webContents.executeJavaScript(`renderDocument(${JSON.stringify({
      ...initialState,
      session: {
        ...store.get('session') as SessionState,
        instance: INSTANCE_ID,
        windowType: 'document',
        env: process.env.NODE_ENV,
        images: (initialState && initialState.documentSettings) ? initialState.documentSettings.images : {
          allIds: [],
          byId: {}
        }
      },
      preferences: store.get('preferences') as PreferencesState,
      keyBindings: store.get('keyBindings') as KeyBindingsState,
      artboardPresets: store.get('artboardPresets') as ArtboardPresetsState
    })})`);
  });

  instance.document.on('focus', (event) => {
    if (btwxElectron.menu.default) {
      Menu.setApplicationMenu(btwxElectron.menu.default);
    }
  });

  instance.preview.webContents.on('did-finish-load', () => {
    if (!instance.preview) {
      throw new Error('"previewWindow" is not defined');
    }
    instance.preview.webContents.executeJavaScript(`renderPreview(${JSON.stringify({
      ...initialState,
      session: {
        ...store.get('session') as SessionState,
        instance: INSTANCE_ID,
        windowType: 'preview',
        env: process.env.NODE_ENV,
        images: (initialState && initialState.documentSettings) ? initialState.documentSettings.images : {
          allIds: [],
          byId: {}
        }
      },
      preferences: store.get('preferences') as PreferencesState,
      keyBindings: store.get('keyBindings') as KeyBindingsState,
      artboardPresets: store.get('artboardPresets') as ArtboardPresetsState
    })})`);
  });

  instance.preview.on('focus', (event) => {
    instance.preview.webContents.executeJavaScript(`setPreviewFocusing(${JSON.stringify(true)})`);
    instance.document.webContents.executeJavaScript(`setPreviewFocusing(${JSON.stringify(true)})`);
  });

  instance.preview.on('blur', (event) => {
    instance.preview.webContents.executeJavaScript(`setPreviewFocusing(${JSON.stringify(false)})`);
    instance.document.webContents.executeJavaScript(`setPreviewFocusing(${JSON.stringify(false)})`);
  });

  instance.preview.on('close', (event) => {
    event.preventDefault();
    instance.preview.hide();
    instance.document.focus();
  });

  instance.preview.on('hide', (event) => {
    instance.preview.webContents.executeJavaScript(`closePreview()`);
    instance.document.webContents.executeJavaScript(`closePreview()`);
  });

  instance.preview.on('show', (event) => {
    instance.preview.webContents.executeJavaScript(`openPreview()`);
    instance.document.webContents.executeJavaScript(`openPreview()`);
  });

  instance.document.on('close', (event) => {
    event.preventDefault();
    instance.document.webContents.executeJavaScript(`getCurrentEdit()`).then((currentEditJSON) => {
      const editState = JSON.parse(currentEditJSON) as BtwxInstanceEditState;
      const instanceSaveState = { instance, editState };
      if (editState.dirty) {
        openCloseSaveDialog({
          instanceSaveState,
          onSave: () => {
            if (editState.path) {
              handleSave({
                instanceSaveState,
                onSave: {
                  close: true
                }
              });
            } else {
              handleSaveAs({
                instanceSaveState,
                onSave: {
                  close: true
                }
              });
            }
          },
          onDontSave: () => {
            handleInstanceClose(INSTANCE_ID);
          }
        });
      } else {
        handleInstanceClose(INSTANCE_ID);
      }
    });
  });

  instance.document.on('closed', () => {
    if (instance.preview) {
      instance.preview.destroy();
    }
    btwxElectron = {
      ...btwxElectron,
      instance: {
        allIds: removeItem(btwxElectron.instance.allIds, INSTANCE_ID),
        byId: Object.keys(btwxElectron.instance.byId).reduce((result: { [id: string]: BtwxInstance }, current: any) => {
          if (current !== INSTANCE_ID) {
            result = {
              ...result,
              [current]: btwxElectron.instance.byId[current]
            }
          }
          return result;
        }, {}) as { [id: string]: BtwxInstance }
      }
    }
  });

  // electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = 'default';
  ses.fromPartition(partition).setPermissionRequestHandler((webContents, permission, permCallback) => {
    console.error(`The app tried to request permission from ${permission}. The permission was not whitelisted and has been blocked.`);
    permCallback(false); // deny
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

export const createPreferences = async () => {

  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  btwxElectron = {
    ...btwxElectron,
    preferences: new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      icon: getAssetPath('icon.png'),
      backgroundColor: '#00000000',
      vibrancy: 'sidebar',
      transparent: true,
      frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: false
      },
    })
  }

  btwxElectron.preferences.loadURL(`file://${__dirname}/index.html`);

  btwxElectron.preferences.webContents.on('did-finish-load', () => {
    if (!btwxElectron.preferences) {
      throw new Error('"preferencesWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      btwxElectron.preferences.minimize();
    } else {
      btwxElectron.preferences.show();
      btwxElectron.preferences.focus();
    }
    btwxElectron.preferences.webContents.executeJavaScript(`renderPreferences(${JSON.stringify({
      session: {
        ...store.get('session') as SessionState,
        windowType: 'preferences',
        env: process.env.NODE_ENV
      },
      preferences: store.get('preferences') as PreferencesState,
      keyBindings: store.get('keyBindings') as KeyBindingsState,
      artboardPresets: store.get('artboardPresets') as ArtboardPresetsState
    })})`);
  });

  btwxElectron.preferences.on('closed', () => {
    btwxElectron = {
      ...btwxElectron,
      preferences: null
    }
  });

  // electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = 'default';
  ses.fromPartition(partition).setPermissionRequestHandler((webContents, permission, permCallback) => {
    console.error(`The app tried to request permission from ${permission}. The permission was not whitelisted and has been blocked.`);
    permCallback(false); // deny
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    Menu.setApplicationMenu(btwxElectron.menu.noInstances);
  }
});

app.on('ready', () => {
  // need a better way to handle this
  // issue:
  // - accelerator form group will refresh preferences...
  //   if any shortcut is set to `CommandOrControl+R`...
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('reloaded');
  });
  Menu.setApplicationMenu(btwxElectron.menu.noInstances);
  createInstance({});
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (btwxElectron.instance.allIds.length === 0) {
    createInstance({});
  };
});

app.on('open-file', (event, path) => {
  // used for opening  recent documents
  event.preventDefault();
  handleOpen(process.platform === 'darwin' ? path : process.argv[1]);
});

// electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (contentsEvent, navigationUrl) => {
    contentsEvent.preventDefault();
    console.error(`The app tried to perform a nono and navigate to an unknown url.`);
    return;
  });
  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    contentsEvent.preventDefault();
    console.error(`The app tried to perform a nono and redirect to an unknown url.`);
    return;
  });
  // electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on('will-attach-webview', (contentsEvent, webPreferences, params) => {
    contentsEvent.preventDefault();
    // strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete (webPreferences as any).preloadURL; //
    // disable node integration
    webPreferences.nodeIntegration = false;
    console.error(`The app tried to perform a nono and attach a webview.`);
    return;
  });
  // electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  contents.on('new-window', (contentsEvent, navigationUrl) => {
    contentsEvent.preventDefault();
    console.error(`The app tried to perform a nono and open a new window.`);
    return;
  });
});

app.on('before-quit', (event) => {
  const hasOpenWindows = btwxElectron.instance.allIds.length > 0;
  if (hasOpenWindows) {
    event.preventDefault();
    const promises = [] as Promise<BtwxInstanceSaveState>[];
    const focusedInstance = getFocusedInstance();
    const instances = btwxElectron.instance.allIds.reduce((result, current) => {
      if (focusedInstance && focusedInstance === current) {
        result = [current, ...result];
      } else {
        result = [...result, current];
      }
      return result;
    }, []);
    instances.forEach((instanceId, index) => {
      const instance = btwxElectron.instance.byId[instanceId];
      promises.push(
        new Promise((resolve) => {
          instance.document.webContents.executeJavaScript(`getCurrentEdit()`).then((documentJSON: string) => {
            resolve({
              instance: instance,
              editState: JSON.parse(documentJSON) as BtwxInstanceEditState
            });
          });
        })
      )
    });
    Promise.all(promises).then((instanceSaveStates) => {
      const dirtySaveStates = instanceSaveStates.filter((i) => i.editState.dirty);
      if (dirtySaveStates.length > 0) {
        if (dirtySaveStates.length > 1) {
          dialog.showMessageBox({
            type: 'question',
            buttons: ['Review Changes...', 'Cancel', 'Discard Changes'],
            cancelId: 1,
            message: `You have ${dirtySaveStates.length} ${APP_NAME} documents with unsaved changes. Do you want to review these changes before quitting?`,
            detail: 'If you don’t review your documents, all your unsaved changes will be lost.'
          }).then((data: any) => {
            switch(data.response) {
              case 0: {
                let reviewedInstances = 0;
                const handleNextSaveDialog = (instanceSaveState: BtwxInstanceSaveState): void => {
                  instanceSaveState.instance.document.focus();
                  const handleNext = () => {
                    reviewedInstances++;
                    if (reviewedInstances < dirtySaveStates.length) {
                      handleNextSaveDialog(dirtySaveStates[reviewedInstances]);
                    } else {
                      app.exit();
                      app.quit();
                    }
                  }
                  openCloseSaveDialog({
                    instanceSaveState,
                    onSave: () => {
                      if (instanceSaveState.editState.path) {
                        handleSave({instanceSaveState: instanceSaveState, onSave: { close: true }}).then(() => {
                          handleNext();
                        });
                      } else {
                        handleSaveAs({instanceSaveState: instanceSaveState, onSave: { close: true }}).then(() => {
                          handleNext();
                        });
                      }
                    },
                    onDontSave: () => {
                      handleInstanceClose(instanceSaveState.instance.id);
                      // instanceSaveState.instance.document.destroy();
                      handleNext();
                    }
                  });
                }
                handleNextSaveDialog(dirtySaveStates[reviewedInstances]);
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
          const instanceSaveState = dirtySaveStates[0];
          openCloseSaveDialog({
            instanceSaveState: instanceSaveState,
            onSave: () => {
              if (instanceSaveState.editState.path) {
                handleSave({
                  instanceSaveState,
                  onSave: {
                    quit: true
                  }
                });
              } else {
                handleSaveAs({
                  instanceSaveState,
                  onSave: {
                    quit: true
                  }
                });
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

export const openCloseSaveDialog = ({
  instanceSaveState,
  onSave,
  onDontSave,
  onCancel
}: {
  instanceSaveState: BtwxInstanceSaveState;
  onSave: any;
  onDontSave: any;
  onCancel?: any
}): void => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Save', 'Cancel', 'Dont Save'],
    cancelId: 1,
    message: `Do you want to save the changes made to the document “${instanceSaveState.editState.name}”?`,
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

export const handleSave = ({
  instanceSaveState,
  onSave
}:{
  instanceSaveState: BtwxInstanceSaveState,
  onSave?: {
    reload?: boolean;
    close?: boolean;
    quit?: boolean
  }
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const instance = instanceSaveState.instance;
    const editState = instanceSaveState.editState;
    const focusedInstanceDocument = instance.document;
    const handleOnSave = () => {
      if (onSave && onSave.close) {
        handleInstanceClose(instanceSaveState.instance.id);
        resolve(null);
        return;
      } else if (onSave && onSave.reload) {
        instanceSaveState.instance.document.reload();
        resolve(null);
        return;
      } else if (onSave && onSave.quit) {
        app.exit();
        app.quit();
        return;
      } else {
        resolve(null);
      }
    }
    if (instanceSaveState.editState.path) {
      focusedInstanceDocument.webContents.executeJavaScript(`getDocumentState()`).then((documentStateJSON) => {
        const writeDocumentState = getWriteDocumentState(JSON.parse(documentStateJSON), editState.path);
        fs.writeFile(`${editState.path}.${APP_NAME}`, JSON.stringify(writeDocumentState), (err) => {
          if (err) {
            dialog.showMessageBox(focusedInstanceDocument, {
              type: 'error',
              message: `Failed to save document at "${editState.path}.${APP_NAME}"`
            }).then(handleOnSave);
          } else {
            focusedInstanceDocument.webContents.executeJavaScript(`saveDocument(${JSON.stringify({
              edit: writeDocumentState.documentSettings.edit
            })})`).then(handleOnSave);
          }
        });
      });
    } else {
      handleSaveAs({instanceSaveState, onSave}).then(() => {
        resolve(null);
      }).catch(() => {
        reject();
      });
      // dialog.showSaveDialog(focusedInstanceDocument, {}).then((result) => {
      //   if (!result.canceled) {
      //     handleWrite(result.filePath);
      //   } else {
      //     reject();
      //   }
      // });
    }
  });
};

export const handleSaveAs = ({
  instanceSaveState,
  onSave
}:{
  instanceSaveState: BtwxInstanceSaveState,
  onSave?: {
    reload?: boolean;
    close?: boolean;
    quit?: boolean
  }
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const instance = instanceSaveState.instance;
    const focusedInstanceDocument = instance.document;
    const handleOnSave = () => {
      if (onSave && onSave.close) {
        handleInstanceClose(instanceSaveState.instance.id);
        resolve(null);
        return;
      } else if (onSave && onSave.reload) {
        instanceSaveState.instance.document.reload();
        resolve(null);
        return;
      } else if (onSave && onSave.quit) {
        app.exit();
        app.quit();
        return;
      } else {
        resolve(null);
      }
    }
    dialog.showSaveDialog(focusedInstanceDocument, {}).then((result) => {
      if (!result.canceled) {
        focusedInstanceDocument.webContents.executeJavaScript(`getDocumentState()`).then((documentStateJSON) => {
          const fullPath = result.filePath;
          const writeDocumentState = getWriteDocumentState(JSON.parse(documentStateJSON), fullPath);
          fs.writeFile(`${fullPath}.${APP_NAME}`, JSON.stringify(writeDocumentState), function(err) {
            if (err) {
              dialog.showMessageBox(focusedInstanceDocument, {
                type: 'error',
                message: `Failed to save document at "${fullPath}.${APP_NAME}"`
              }).then(handleOnSave);
            } else {
              app.addRecentDocument(`${fullPath}.${APP_NAME}`);
              focusedInstanceDocument.webContents.executeJavaScript(`saveDocumentAs(${JSON.stringify({
                name: writeDocumentState.documentSettings.name,
                path: writeDocumentState.documentSettings.path,
                edit: writeDocumentState.documentSettings.edit
              })})`).then(handleOnSave);
              btwxElectron.instance = {
                ...btwxElectron.instance,
                byId: {
                  ...btwxElectron.instance.byId,
                  [instance.id]: {
                    ...btwxElectron.instance.byId[instance.id],
                    documentPath: writeDocumentState.documentSettings.path
                  }
                }
              }
            }
          });
        });
      } else {
        reject();
      }
    });
  });
};

export const handleOpenDialog = () => {
  const focusedInstanceDocument = getFocusedInstanceDocument();
  if (focusedInstanceDocument) {
    focusedInstanceDocument.focus();
  }
  dialog.showOpenDialog(focusedInstanceDocument, {
    filters: [
      { name: 'Custom File Type', extensions: [APP_NAME] }
    ],
    properties: ['openFile']
  }).then((result) => {
    if (result.filePaths.length > 0 && !result.canceled) {
      handleOpen(result.filePaths[0]);
    }
  });
}

export const handleOpen = (fullPath: string) => {
  const ext = path.extname(fullPath);
  const alreadyOpen = btwxElectron.instance.allIds.find((instanceId) => {
    const documentPath = btwxElectron.instance.byId[instanceId].documentPath;
    const matches = documentPath && (`${documentPath}.${APP_NAME}` === fullPath);
    return matches;
  });
  if (alreadyOpen) {
    btwxElectron.instance.byId[alreadyOpen].document.focus();
  } else {
    if (ext === `.${APP_NAME}`) {
      const focusedInstanceId = getFocusedInstance();
      const focusedInstanceDocument = getFocusedInstanceDocument();
      if (focusedInstanceDocument) {
        focusedInstanceDocument.focus();
      }
      if (focusedInstanceDocument) {
        const size = focusedInstanceDocument.getSize();
        focusedInstanceDocument.webContents.executeJavaScript(`getCurrentEdit()`).then((documentJSON: string) => {
          const editState = JSON.parse(documentJSON) as BtwxInstanceEditState;
          fs.readFile(fullPath, { encoding: 'utf-8' }, (err, data) => {
            if(err) {
              dialog.showMessageBox(focusedInstanceDocument, {
                type: 'error',
                message: `Failed to open document "${fullPath}.${APP_NAME}"`
              });
            } else {
              app.addRecentDocument(fullPath);
              const documentState = JSON.parse(data) as BtwxInstanceDocumentState;
              const documentStateWithTree = getDocumentStateWithTree(documentState);
              const documentStateWithSessionImages = {
                ...documentStateWithTree,
                session: {
                  ...store.get('session') as SessionState,
                  instance: focusedInstanceId,
                  windowType: 'document',
                  env: process.env.NODE_ENV,
                  images: documentStateWithTree.documentSettings.images
                }
              }
              if (!editState.path && !editState.edit.id) {
                focusedInstanceDocument.webContents.executeJavaScript(`hydrateDocument(${JSON.stringify(documentStateWithSessionImages)})`);
                btwxElectron = {
                  ...btwxElectron,
                  instance: {
                    ...btwxElectron.instance,
                    byId: {
                      ...btwxElectron.instance.byId,
                      [focusedInstanceId]: {
                        ...btwxElectron.instance.byId[focusedInstanceId],
                        documentPath: documentStateWithTree.documentSettings.path
                      }
                    }
                  }
                }
              } else {
                createInstance({
                  width: size[0],
                  height: size[1],
                  initialState: documentStateWithTree
                });
              }
            }
          });
        });
      } else {
        fs.readFile(fullPath, {encoding: 'utf-8'}, (err, data) => {
          if(err) {
            dialog.showMessageBox(focusedInstanceDocument, {
              type: 'error',
              message: `Failed to open document "${fullPath}.${APP_NAME}"`
            });
          } else {
            app.addRecentDocument(fullPath);
            createInstance({
              initialState: getDocumentStateWithTree(JSON.parse(data) as BtwxInstanceDocumentState)
            });
          }
        });
      }
    } else {
      dialog.showMessageBox({
        type: 'error',
        title: 'Invalid Filetype',
        message: `Cannot open ".${ext}" files.`
      });
    }
  }
}

// electronjs.org/docs/tutorial/security#16-filter-the-remote-module
app.on('remote-require', (event, webContents, moduleName) => {
  event.preventDefault();
  console.error(`The app tried to perform a remote nono: 'remote-require'.`);
});

app.on('remote-get-builtin', (event, webContents, moduleName) => {
  event.preventDefault();
  console.error(`The app tried to perform a remote nono: 'remote-get-builtin'.`);
});

app.on('remote-get-global', (event, webContents, globalName) => {
  event.preventDefault();
  console.error(`The app tried to perform a remote nono: 'remote-get-global'.`);
});

app.on('remote-get-current-window', (event, webContents) => {
  event.preventDefault();
  console.error(`The app tried to perform a remote nono: 'remote-get-current-window'.`);
});

app.on('remote-get-current-web-contents', (event, webContents) => {
  event.preventDefault();
  console.error(`The app tried to perform a remote nono: 'remote-get-current-web-contents'.`);
});

////////////////////////////////////////////////////////////
// INSTANCE
////////////////////////////////////////////////////////////

ipcMain.on('newInstance', (event, args) => {
  const focusedInstanceDocument = getFocusedInstanceDocument();
  if (focusedInstanceDocument) {
    const focusedInstanceDocumentSize = focusedInstanceDocument.getSize();
    createInstance({
      width: focusedInstanceDocumentSize[0],
      height: focusedInstanceDocumentSize[1]
    });
  } else {
    createInstance({});
  }
});

ipcMain.on('openInstance', (event, args) => {
  handleOpenDialog();
});

ipcMain.on('saveInstance', (event, args) => {
  const focusedInstance = getFocusedInstance();
  if (focusedInstance) {
    const instance = btwxElectron.instance.byId[focusedInstance];
    const focusedInstanceDocument = instance.document;
    focusedInstanceDocument.webContents.executeJavaScript(`getCurrentEdit()`).then((editStateJSON: string) => {
      handleSave({
        instanceSaveState: {
          editState: JSON.parse(editStateJSON),
          instance: instance
        }
      });
    });
  }
});

ipcMain.on('saveInstanceAs', (event, args) => {
  const focusedInstance = getFocusedInstance();
  if (focusedInstance) {
    const instance = btwxElectron.instance.byId[focusedInstance];
    const focusedInstanceDocument = instance.document;
    focusedInstanceDocument.webContents.executeJavaScript(`getCurrentEdit()`).then((editStateJSON: string) => {
      handleSaveAs({
        instanceSaveState: {
          editState: JSON.parse(editStateJSON),
          instance: instance
        }
      });
    });
  }
});

ipcMain.handle('insertImage', (event, binding) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'png', 'webp']
      }],
      properties: ['openFile']
    }).then((res) => {
      if (res.filePaths.length > 0) {
        fs.readFile(res.filePaths[0], (err, data) => {
          if (!err) {
            resolve({
              buffer: data,
              ext: path.extname(res.filePaths[0]).split('.').pop()
            });
          } else {
            dialog.showMessageBox({
              type: 'error',
              message: `Could not read image file.`
            }).then((res) => {
              switch(res.response) {
                case 0:
                  reject('');
                  break;
                case 1:
                  reject(null);
                  break;
                default:
                  reject(null);
                  break;
              }
            });
          }
        });
      }
    });
  });
});

ipcMain.on('openTweenLayerContextMenu', (event, args) => {
  const template = buildContentMenuTemplate(args, btwxElectron, 'document');
  Menu.buildFromTemplate(template).popup();
});

ipcMain.on('openTweenContextMenu', (event, args) => {
  const template = buildContentMenuTemplate(args, btwxElectron, 'document');
  Menu.buildFromTemplate(template).popup();
});

ipcMain.on('openEventContextMenu', (event, args) => {
  const template = buildContentMenuTemplate(args, btwxElectron, 'document');
  Menu.buildFromTemplate(template).popup();
});

ipcMain.on('focusInstancePreview', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.focus();
});

ipcMain.on('focusInstanceDocument', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.focus();
});

////////////////////////////////////////////////////////////
// INSTANCE => FROM PREVIEW RENDERER
////////////////////////////////////////////////////////////

ipcMain.on('setDocumentPreviewTweening', (event, args) => {
  const { instanceId, tweening } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'document',
    func: 'setPreviewTweening',
    payloadString: JSON.stringify(tweening)
  });
});

ipcMain.handle('setDocumentActiveArtboard', (event, args) => {
  const { instanceId, activeArtboard } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'document',
    func: 'setActiveArtboard',
    payloadString: JSON.stringify(activeArtboard),
    callback: Promise.resolve
  });
});

ipcMain.on('resizePreview', (event, args) => {
  const { instanceId, size } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const width = parseInt(size.width);
  const height = parseInt(size.height + (process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT) + PREVIEW_TOPBAR_HEIGHT);
  instance.preview.setSize(width, height);
});

ipcMain.on('openPreviewDeviceContextMenu', (event, args) => {
  const template = buildContentMenuTemplate(args, btwxElectron, 'preview');
  Menu.buildFromTemplate(template).popup();
});

ipcMain.handle('getPreviewWindowSize', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const previewSize = instance.preview.getSize();
  return JSON.stringify({
    width: previewSize[0],
    height: previewSize[1]
  });
});

ipcMain.on('setPreviewWindowSize', (event, args) => {
  const { instanceId, width, height, animate = false } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.setSize(Math.round(width), Math.round(height), animate);
});

ipcMain.on('hidePreviewTrafficLights', (event, args) => {
  const { instanceId } = JSON.parse(args);
  if (process.platform === 'darwin') {
    const instance = btwxElectron.instance.byId[instanceId];
    instance.preview.setWindowButtonVisibility(false);
  }
});

ipcMain.on('showPreviewTrafficLights', (event, args) => {
  const { instanceId } = JSON.parse(args);
  if (process.platform === 'darwin') {
    const instance = btwxElectron.instance.byId[instanceId];
    instance.preview.setWindowButtonVisibility(true);
  }
});

ipcMain.handle('getPreviewMediaSource', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  return instance.preview.getMediaSourceId();
});

ipcMain.on('setDocumentRecordingStarted', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'document',
    func: 'startPreviewRecording'
  });
});

// ipcMain.on('setDocumentRecordingStopped', (event, args) => {
//   const { instanceId } = JSON.parse(args);
//   const instance = btwxElectron.instance.byId[instanceId];
//   instance.document.webContents.executeJavaScript(`stopPreviewRecording()`);
// });

ipcMain.handle('setDocumentRecordingStopped', (event, args) => {
  const { instanceId, buffer } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const videoBuffer = Buffer.from(buffer);
  instance.document.webContents.executeJavaScript(`stopPreviewRecording()`).then(() => {
    return new Promise((resolve, reject) => {
      dialog.showSaveDialog(instance.document, {
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
      }).then((res) => {
        if (!res.canceled && res.filePath) {
          fs.writeFile(res.filePath, videoBuffer, (err) => {
            if(err) {
              return console.log(err);
            }
          });
        }
        resolve(null);
      });
    });
  });
});

ipcMain.on('setDocumentTimelineGuidePosition', (event, args) => {
  const { instanceId, time } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.webContents.send('setDocumentTimelineGuidePosition', JSON.stringify({
    time: time
  }));
});

////////////////////////////////////////////////////////////
// INSTANCE => FROM DOCUMENT RENDERER => TOUCHBAR
////////////////////////////////////////////////////////////

const activeBG = '#777';

interface BuildInsertGroup {
  instance: BtwxInstance;
  hasActiveArtboard: boolean;
  isArtboardToolActive: boolean;
  isRectangleToolActive: boolean;
  isEllipseToolActive: boolean;
  isTextToolActive: boolean;
  theme: Btwx.ThemeName;
}

const buildInsertGroup = ({
  instance,
  hasActiveArtboard,
  isArtboardToolActive,
  isRectangleToolActive,
  isEllipseToolActive,
  isTextToolActive,
  theme
}: BuildInsertGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const artboardImage = nativeImage.createFromPath(`${RESOURCES_PATH}/artboard.png`);
  const rectangleImage = nativeImage.createFromPath(`${RESOURCES_PATH}/rectangle.png`);
  const ellipseImage = nativeImage.createFromPath(`${RESOURCES_PATH}/ellipse.png`);
  const textImage = nativeImage.createFromPath(`${RESOURCES_PATH}/text.png`);
  const imageImage = nativeImage.createFromPath(`${RESOURCES_PATH}/image-${theme}.png`);

  // artboard
  const artboardButton = new TouchBarButton({
    icon: artboardImage,
    accessibilityLabel: 'Artboard',
    backgroundColor: isArtboardToolActive ? activeBG : null,
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'toggleArtboardToolThunk'
    })
  });
  // rect
  const rectangleButton = hasActiveArtboard ? [new TouchBarButton({
    icon: rectangleImage,
    accessibilityLabel: 'Rectangle',
    backgroundColor: isRectangleToolActive ? activeBG : null,
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'toggleShapeToolThunk',
      payloadString: JSON.stringify('Rectangle')
    })
  })] : [];
  // ellipse
  const ellipseButton = hasActiveArtboard ? [new TouchBarButton({
    icon: ellipseImage,
    accessibilityLabel: 'Ellipse',
    backgroundColor: isEllipseToolActive ? activeBG : null,
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'toggleShapeToolThunk',
      payloadString: JSON.stringify('Ellipse')
    })
  })] : [];
  // text
  const textButton = hasActiveArtboard ? [new TouchBarButton({
    icon: textImage,
    accessibilityLabel: 'Text',
    backgroundColor: isTextToolActive ? activeBG : null,
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'toggleTextToolThunk'
    })
  })] : [];
  // image
  const imageButton = hasActiveArtboard ? [new TouchBarButton({
    icon: imageImage,
    accessibilityLabel: 'Image',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'insertImageThunk',
    })
  })] : [];
  // group
  return [
    artboardButton,
    ...rectangleButton,
    ...ellipseButton,
    ...textButton,
    ...imageButton
  ];
}

interface BuildDistributeGroup {
  instance: BtwxInstance;
  canDistribute: boolean;
}

const buildDistributeGroup = ({
  instance,
  canDistribute
}: BuildDistributeGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const distributeHorizontallyImage = nativeImage.createFromPath(`${RESOURCES_PATH}/distribute-horizontally.png`);
  const distributeVerticallyImage = nativeImage.createFromPath(`${RESOURCES_PATH}/distribute-vertically.png`);
  // distribute horizontally
  const distributeHorizontallyButton = canDistribute ? [new TouchBarButton({
    icon: distributeHorizontallyImage,
    accessibilityLabel: 'Distribute Horizontally',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'distributeSelectedHorizontallyThunk'
    })
  })] : [];
  // distribute vertically
  const distributeVerticallyButton = canDistribute ? [new TouchBarButton({
    icon: distributeVerticallyImage,
    accessibilityLabel: 'Distribute Vertically',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'distributeSelectedVerticallyThunk'
    })
  })] : [];
  // group
  return canDistribute ? [...distributeHorizontallyButton, ...distributeVerticallyButton] : [];
}

interface BuildMoveGroup {
  instance: BtwxInstance;
  canBringForward: boolean;
  canSendBackward: boolean;
}

const buildMoveGroup = ({
  instance,
  canBringForward,
  canSendBackward
}: BuildMoveGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const moveForwardImage = nativeImage.createFromPath(`${RESOURCES_PATH}/bring-forward.png`);
  const moveBackwardImage = nativeImage.createFromPath(`${RESOURCES_PATH}/send-backward.png`);
  // forward
  const moveForwardButton = canBringForward ? [new TouchBarButton({
    icon: moveForwardImage,
    accessibilityLabel: 'Bring Forward',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'bringSelectedForwardThunk'
    })
  })] : [];
  // backward
  const moveBackwardButton = canSendBackward ? [new TouchBarButton({
    icon: moveBackwardImage,
    accessibilityLabel: 'Send Backward',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'sendSelectedBackwardThunk'
    })
  })] : [];
  // group
  return canBringForward || canSendBackward ? [...moveForwardButton, ...moveBackwardButton] : [];
}

interface BuildGroupGroup {
  instance: BtwxInstance;
  canGroup: boolean;
  canUngroup: boolean;
}

const buildGroupGroup = ({
  instance,
  canGroup,
  canUngroup
}: BuildGroupGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const groupImage = nativeImage.createFromPath(`${RESOURCES_PATH}/group.png`);
  const ungroupImage = nativeImage.createFromPath(`${RESOURCES_PATH}/ungroup.png`);
  // group
  const groupButton = canGroup ? [new TouchBarButton({
    icon: groupImage,
    accessibilityLabel: 'Group',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'groupSelectedThunk'
    })
  })] : [];
  // ungroup
  const ungroupButton = canUngroup ? [new TouchBarButton({
    icon: ungroupImage,
    accessibilityLabel: 'Ungroup',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'ungroupSelectedThunk'
    })
  })] : [];
  // group
  return canGroup || canUngroup ? [...groupButton, ...ungroupButton] : [];
}

interface BuildAlignGroup {
  instance: BtwxInstance;
  canAlignLeft: boolean;
  canAlignCenter: boolean;
  canAlignRight: boolean;
  canAlignTop: boolean;
  canAlignMiddle: boolean;
  canAlignBottom: boolean
}

const buildAlignGroup = ({
  instance,
  canAlignLeft,
  canAlignCenter,
  canAlignRight,
  canAlignTop,
  canAlignMiddle,
  canAlignBottom
}: BuildAlignGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const alignLeftImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-left.png`);
  const alignCenterImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-center.png`);
  const alignRightImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-right.png`);
  const alignTopImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-top.png`);
  const alignMiddleImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-middle.png`);
  const alignBottomImage = nativeImage.createFromPath(`${RESOURCES_PATH}/align-bottom.png`);
  // left
  const alignLeftButton = canAlignLeft ? [new TouchBarButton({
    icon: alignLeftImage,
    accessibilityLabel: 'Align Left',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToLeftThunk'
    })
  })] : [];
  // center
  const alignCenterButton = canAlignCenter ? [new TouchBarButton({
    icon: alignCenterImage,
    accessibilityLabel: 'Align Center',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToCenterThunk'
    })
  })] : [];
  // right
  const alignRightButton = canAlignRight ? [new TouchBarButton({
    icon: alignRightImage,
    accessibilityLabel: 'Align Right',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToRightThunk'
    })
  })] : [];
  // top
  const alignTopButton = canAlignTop ? [new TouchBarButton({
    icon: alignTopImage,
    accessibilityLabel: 'Align Top',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToTopThunk'
    })
  })] : [];
  // middle
  const alignMiddleButton = canAlignMiddle ? [new TouchBarButton({
    icon: alignMiddleImage,
    accessibilityLabel: 'Align Middle',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToMiddleThunk'
    })
  })] : [];
  // bottom
  const alignBottomButton = canAlignBottom ? [new TouchBarButton({
    icon: alignBottomImage,
    accessibilityLabel: 'Align Bottom',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'alignSelectedToBottomThunk'
    })
  })] : [];
  // group
  return canAlignLeft || canAlignCenter || canAlignRight || canAlignTop || canAlignMiddle || canAlignBottom ? [
    ...alignLeftButton, ...alignCenterButton, ...alignRightButton,
    ...alignTopButton, ...alignMiddleButton, ...alignBottomButton
  ]: [];
}

interface BuildZoomGroup {
  instance: BtwxInstance;
  canZoomOut: boolean;
}

const buildZoomGroup = ({
  instance,
  canZoomOut
}: BuildZoomGroup) => {
  const { TouchBarButton } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  // images
  const zoomOutImage = nativeImage.createFromPath(`${RESOURCES_PATH}/zoom-out.png`);
  const zoomInImage = nativeImage.createFromPath(`${RESOURCES_PATH}/zoom-in.png`);
  // zoom out
  const zoomOutButton = new TouchBarButton({
    icon: zoomOutImage,
    accessibilityLabel: 'Zoom Out',
    enabled: canZoomOut,
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'zoomOutThunk'
    })
  });
  // zoom in
  const zoomInButton = new TouchBarButton({
    icon: zoomInImage,
    accessibilityLabel: 'Zoom In',
    click: () => handleExecute({
      instance,
      window: 'document',
      func: 'zoomInThunk'
    })
  });
  // group
  return [zoomOutButton, zoomInButton];
}

const buildEmptySelectionTouchBar = (props: BuildInsertGroup & BuildZoomGroup) => {
  const { TouchBarSpacer } = TouchBar;
  const {
    instance,
    hasActiveArtboard,
    isArtboardToolActive,
    isRectangleToolActive,
    isEllipseToolActive,
    isTextToolActive,
    theme,
    canZoomOut
  } = props;
  instance.document.setTouchBar(new TouchBar({
    items: [
      ...buildInsertGroup({
        instance,
        hasActiveArtboard,
        isArtboardToolActive,
        isRectangleToolActive,
        isEllipseToolActive,
        isTextToolActive,
        theme
      }),
      new TouchBarSpacer({size: 'large'}),
      ...buildZoomGroup({
        instance,
        canZoomOut
      })
    ]
  }));
}

const buildSelectionTouchBar = (props: BuildAlignGroup & BuildDistributeGroup & BuildGroupGroup & BuildMoveGroup) => {
  const { TouchBarSpacer } = TouchBar;
  const {
    instance,
    canAlignLeft,
    canAlignCenter,
    canAlignRight,
    canAlignTop,
    canAlignMiddle,
    canAlignBottom,
    canDistribute,
    canGroup,
    canUngroup,
    canBringForward,
    canSendBackward
  } = props;
  const alignTouchBar = buildAlignGroup({
    instance,
    canAlignLeft,
    canAlignCenter,
    canAlignRight,
    canAlignTop,
    canAlignMiddle,
    canAlignBottom
  });
  const distributeTouchBar = buildDistributeGroup({
    instance,
    canDistribute
  });
  const groupTouchBar = buildGroupGroup({
    instance,
    canGroup,
    canUngroup
  });
  const moveTouchBar = buildMoveGroup({
    instance,
    canBringForward,
    canSendBackward
  });
  instance.document.setTouchBar(new TouchBar({
    items: [
      ...distributeTouchBar,
      ...alignTouchBar,
      new TouchBarSpacer({size: 'flexible'}),
      ...groupTouchBar,
      new TouchBarSpacer({size: 'flexible'}),
      ...moveTouchBar,
      new TouchBarSpacer({size: 'flexible'})
    ]
  }));
}

ipcMain.on('buildEmptySelectionTouchBar', (event, args) => {
  const { instanceId, ...rest } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  buildEmptySelectionTouchBar({
    instance,
    ...rest
  });
});

ipcMain.on('buildSelectionTouchBar', (event, args) => {
  const { instanceId, ...rest } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  buildSelectionTouchBar({
    instance,
    ...rest
  });
});

const buildPreviewLoadingTouchBar = (instanceId) => {
  const { TouchBarButton, TouchBarSpacer } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  const recordingImage = nativeImage.createFromPath(`${RESOURCES_PATH}/start-recording.png`);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.setTouchBar(new TouchBar({
    items: [
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarButton({
        icon: recordingImage,
        accessibilityLabel: 'Starting Recording',
        enabled: false,
        click: () => {}
      }),
      new TouchBarSpacer({size: 'flexible'})
    ]
  }));
}

ipcMain.on('buildPreviewTouchBar', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const { TouchBarButton, TouchBarSpacer } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  const recordingImage = nativeImage.createFromPath(`${RESOURCES_PATH}/start-recording.png`);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.setTouchBar(new TouchBar({
    items: [
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarButton({
        icon: recordingImage,
        accessibilityLabel: 'Start Recording',
        click: () => {
          buildPreviewLoadingTouchBar(instanceId);
          handleExecute({
            instance,
            window: 'preview',
            func: 'startPreviewRecording'
          })
        }
      }),
      new TouchBarSpacer({size: 'flexible'})
    ]
  }));
});

ipcMain.on('buildPreviewRecordingTouchBar', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const { TouchBarButton, TouchBarSpacer } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  const recordingImage = nativeImage.createFromPath(`${RESOURCES_PATH}/stop-recording.png`);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.setTouchBar(new TouchBar({
    items: [
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarButton({
        icon: recordingImage,
        accessibilityLabel: 'Stop Recording',
        backgroundColor: THEME_DARK_RECORDING,
        click: () => {
          instance.preview.webContents.send('setPreviewRecordingStopped', JSON.stringify({
            instanceId: instanceId
          }));
        }
      }),
      new TouchBarSpacer({size: 'flexible'})
    ]
  }));
});

ipcMain.on('buildDocumentRecordingTouchBar', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const { TouchBarButton, TouchBarSpacer } = TouchBar;
  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets/touch-bar') : path.join(__dirname, '../assets/touch-bar');
  const recordingImage = nativeImage.createFromPath(`${RESOURCES_PATH}/stop-recording.png`);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.setTouchBar(new TouchBar({
    items: [
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarButton({
        icon: recordingImage,
        accessibilityLabel: 'Stop Recording',
        backgroundColor: THEME_DARK_RECORDING,
        click: () => {
          instance.preview.webContents.send('setPreviewRecordingStopped', JSON.stringify({
            instanceId: instanceId
          }));
        }
      }),
      new TouchBarSpacer({size: 'flexible'})
    ]
  }));
});

ipcMain.on('clearTouchBar', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.setTouchBar(null);
});

////////////////////////////////////////////////////////////
// INSTANCE => FROM DOCUMENT RENDERER
////////////////////////////////////////////////////////////

ipcMain.on('hydratePreviewLayers', (event, args) => {
  const { instanceId, state } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'preview',
    func: 'hydrateLayers',
    payloadString: JSON.stringify(state)
  });
});

ipcMain.on('hydratePreviewSessionImages', (event, args) => {
  const { instanceId, images } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const payload = {images};
  handleExecute({
    instance,
    window: 'preview',
    func: 'hydrateSessionImages',
    payloadString: JSON.stringify(payload)
  });
});

ipcMain.on('openPreview', (event, args) => {
  const { instanceId, stick } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const preview = instance.preview;
  if (preview) {
    preview.show();
    preview.focus();
    if (stick) {
      preview.setParentWindow(instance.document);
    }
  }
});

ipcMain.on('setPreviewEventDrawerEvent', (event, args) => {
  const { instanceId, eventId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'preview',
    func: 'setEventDrawerEvent',
    payloadString: JSON.stringify(eventId)
  });
});

ipcMain.on('setPreviewActiveArtboard', (event, args) => {
  const { instanceId, activeArtboard } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  handleExecute({
    instance,
    window: 'preview',
    func: 'setActiveArtboard',
    payloadString: JSON.stringify(activeArtboard)
  });
});

ipcMain.on('stickPreview', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const preview = instance.preview;
  preview.setParentWindow(instance.document);
});

ipcMain.on('unStickPreview', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  const preview = instance.preview;
  preview.setParentWindow(null);
});

ipcMain.handle('initPasteWithoutArtboardAlert', (event, args) => {
  return new Promise((resolve, reject) => {
    const { instanceId } = JSON.parse(args);
    const instance = btwxElectron.instance.byId[instanceId];
    dialog.showMessageBox(instance.document, {
      type: 'error',
      message: `Cannot paste layers without an artboard present.`
    }).then(() => {
      resolve(null);
    });
  });
});

ipcMain.on('initPasteErrorAlert', (event, args) => {
  return new Promise((resolve, reject) => {
    const { instanceId } = JSON.parse(args);
    const instance = btwxElectron.instance.byId[instanceId];
    dialog.showMessageBox(instance.document, {
      type: 'error',
      message: `Unable to paste layers from clipboard.`
    }).then(() => {
      resolve(null);
    });
  });
});

ipcMain.on('setPreviewRecordingStopped', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.preview.webContents.send('setPreviewRecordingStopped', JSON.stringify({
    instanceId: instanceId,
    platform: process.platform
  }));
});

////////////////////////////////////////////////////////////
// TITLEBAR => FROM DOCUMENT RENDERER
////////////////////////////////////////////////////////////

ipcMain.handle('setDocumentEdited', (event, args) => {
  const { instanceId, edited } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.setDocumentEdited(edited);
});

ipcMain.handle('maximizeDocument', (event, args) => {
  const { instanceId } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.maximize();
});

ipcMain.handle('setDocumentRepresentedFilename', (event, args) => {
  const { instanceId, filename } = JSON.parse(args);
  const instance = btwxElectron.instance.byId[instanceId];
  instance.document.setRepresentedFilename(filename);
});

////////////////////////////////////////////////////////////
// PREFERENCES
////////////////////////////////////////////////////////////

ipcMain.on('openPreferences', (event, args) => {
  if (!btwxElectron.preferences) {
    createPreferences();
  } else {
    btwxElectron.preferences.focus();
  }
});

ipcMain.handle('overwriteRegisteredBinding', (event, binding) => {
  return new Promise((resolve, reject) => {
    dialog.showMessageBox({
      type: 'error',
      message: `"${binding}" is already registered.`,
      detail: `Do you want to overwrite existing binding?`,
      buttons: ['Cancel', 'Overwrite']
    }).then((res) => {
      switch(res.response) {
        case 0:
          resolve(false);
          break;
        case 1:
          resolve(true);
          break;
        default:
          resolve(false);
          break;
      }
    });
  });
});

////////////////////////////////////////////////////////////
// MENU
////////////////////////////////////////////////////////////

const buildMenuTemplate = (args: string) => {
  const { template } = JSON.parse(args, (key, value) => {
    if (key === 'click') {
      const { id, params } = value;
      return (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
        const focusedInstanceDocument = getFocusedInstanceDocument();
        if (focusedInstanceDocument) {
          focusedInstanceDocument.webContents.executeJavaScript(`${id}(${JSON.stringify(params)})`);
        }
      }
    } else {
      return value;
    }
  });
  return template;
}

ipcMain.handle('setApplicationMenu', (event, args) => {
  const { type } = JSON.parse(args);
  if (Object.prototype.hasOwnProperty.call(btwxElectron.menu, type) && btwxElectron.menu[type as Btwx.MenuType]) {
    Menu.setApplicationMenu(btwxElectron.menu[type as Btwx.MenuType]);
  }
});

ipcMain.handle('buildDefaultApplicationMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const defaultMenu = Menu.buildFromTemplate(template);
  btwxElectron.menu.default = defaultMenu;
});

ipcMain.handle('buildInputApplicationMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const inputMenu = Menu.buildFromTemplate(template);
  btwxElectron.menu.input = inputMenu;
});

////////////////////////////////////////////////////////////
// CONTEXT MENU
////////////////////////////////////////////////////////////

ipcMain.handle('buildLayerContextMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const layerMenu = Menu.buildFromTemplate(template);
  btwxElectron.contextMenu.layer = layerMenu;
});

ipcMain.handle('buildEventContextMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const inputMenu = Menu.buildFromTemplate(template);
  btwxElectron.contextMenu.event = inputMenu;
});

ipcMain.handle('buildArtboardPresetContextMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const artboardPresetMenu = Menu.buildFromTemplate(template);
  btwxElectron.contextMenu.artboardPreset = artboardPresetMenu;
});

ipcMain.handle('buildTweenLayerContextMenu', (event, args) => {
  const template = buildMenuTemplate(args);
  const inputMenu = Menu.buildFromTemplate(template);
  btwxElectron.contextMenu.tweenLayer = inputMenu;
});

ipcMain.handle('openContextMenu', (event, args) => {
  const { type, callback = { id: null, params: {} } } = JSON.parse(args);
  const { id, params } = callback;
  if (Object.prototype.hasOwnProperty.call(btwxElectron.contextMenu, type) && btwxElectron.contextMenu[type as Btwx.ContextMenuType]) {
    (btwxElectron.contextMenu[type as Btwx.ContextMenuType] as Menu).popup( id ? {
      callback: () => {
        event.sender.executeJavaScript(`${id}(${JSON.stringify(params)})`);
      }
    } : {});
  }
});

////////////////////////////////////////////////////////////
// STORE
////////////////////////////////////////////////////////////

ipcMain.handle('getElectronStore', (event, key) => {
  return store.get(key);
});

ipcMain.handle('setElectronStore', (event, args) => {
  const { key, value } = JSON.parse(args);
  if (store.has(key)) {
    store.set(key, value);
  }
});

////////////////////////////////////////////////////////////
// THEME
////////////////////////////////////////////////////////////

ipcMain.handle('setNativeTheme', (event, key) => {
  nativeTheme.themeSource = key;
});