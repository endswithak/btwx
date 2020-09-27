/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { remote, ipcRenderer } from 'electron';
import React from 'react';
import sharp from 'sharp';
import { ActionCreators } from 'redux-undo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Titlebar, Color } from 'custom-electron-titlebar';
import store, { persistor, persistConfig } from './store';
import persist from './store/utils/persist';
import getTheme from './store/theme';
import { openFile } from './store/reducers';
import { enableDarkTheme, enableLightTheme } from './store/actions/theme';
import { saveDocumentAs, saveDocument } from './store/actions/documentSettings';
import { closePreview } from './store/actions/preview';
import App from './components/App';
import Preview from './components/Preview';
// import Preferences from './components/Preferences';
// import SketchImporter from './components/SketchImporter';
import ThemeProvider from './components/ThemeProvider';
// import importSketchArtboards from './canvas/sketch';
import { pasteLayersThunk, pasteStyleThunk, copyStyleThunk, copyLayersThunk, removeLayersThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, escapeLayerScopeThunk, removeLayers, addImageThunk, alignLayersToBottom, alignLayersToCenter, alignLayersToLeft, alignLayersToMiddle, alignLayersToRight, alignLayersToTop, distributeLayersHorizontally, distributeLayersVertically } from './store/actions/layer';
import { toggleArtboardToolThunk} from './store/actions/artboardTool';
import { toggleTextToolThunk } from './store/actions/textTool';
import { toggleShapeToolThunk } from './store/actions/shapeTool';

import './styles/index.sass';

window.addEventListener('storage', persist(store, persistConfig));

const themePref = remote.systemPreferences.getUserDefault('theme', 'string');
let themeObject = getTheme(themePref);
const titleBar = new Titlebar({
  backgroundColor: Color.fromHex(themePref === 'dark' ? themeObject.background.z1 : themeObject.background.z2)
});

// ipcRenderer.on('sketchArtboardsImport', (event, arg) => {
//   const sketchData = JSON.parse(arg);
//   console.log(sketchData);
//   importSketchArtboards(sketchData);
// });

(window as any).editUndo = (): void => {
  store.dispatch(undoThunk() as any);
};

(window as any).editRedo = (): void => {
  store.dispatch(redoThunk() as any);
};

(window as any).editCopy = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(copyLayersThunk() as any);
  }
};

(window as any).editCopyStyle = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(copyStyleThunk() as any);
  }
};

(window as any).editPaste = (): void => {
  store.dispatch(pasteLayersThunk({}) as any);
};

(window as any).editPasteOverSelection = (): void => {
  store.dispatch(pasteLayersThunk({overSelection: true}) as any);
};

(window as any).editPasteStyle = (): void => {
  store.dispatch(pasteStyleThunk() as any);
};

(window as any).editCut = (): void => {
  store.dispatch(removeLayersThunk() as any);
};

(window as any).editDelete = (): void => {
  store.dispatch(removeLayersThunk() as any);
};

(window as any).insertArtboard = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleArtboardToolThunk() as any);
  }
};

(window as any).insertRectangle = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Rectangle') as any);
  }
};

(window as any).insertRounded = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Rounded') as any);
  }
};

(window as any).insertEllipse = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Ellipse') as any);
  }
};

(window as any).insertPolygon = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Polygon') as any);
  }
};

(window as any).insertStar = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Star') as any);
  }
};

(window as any).insertLine = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleShapeToolThunk('Line') as any);
  }
};

(window as any).insertText = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    store.dispatch(toggleTextToolThunk() as any);
  }
};

(window as any).insertImage = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing) {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] }
      ],
      properties: ['openFile']
    }).then(result => {
      if (result.filePaths.length > 0 && !result.canceled) {
        sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
          sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
            store.dispatch(addImageThunk({
              layer: {
                frame: {
                  width: info.width,
                  height: info.height,
                  innerWidth: info.width,
                  innerHeight: info.height
                } as em.Frame
              },
              buffer: data
            }) as any);
          });
        });
      }
    });
  }
};

(window as any).arrangeBringForward = (): void => {
  const state = store.getState();
  const canBringForward = state.layer.present.selected.length > 0 && !state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layerItem.parent];
    const isMask = layerItem.mask;
    return parent.children[parent.children.length - 1] === id || isMask;
  });
  if (state.canvasSettings.focusing && canBringForward) {
    store.dispatch(sendLayersForward({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeBringToFront = (): void => {
  const state = store.getState();
  const canBringForward = state.layer.present.selected.length > 0 && !state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layerItem.parent];
    const isMask = layerItem.mask;
    return parent.children[parent.children.length - 1] === id || isMask;
  });
  if (state.canvasSettings.focusing && canBringForward) {
    store.dispatch(sendLayersToFront({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeSendBackward = (): void => {
  const state = store.getState();
  const canSendBackward = state.layer.present.selected.length > 0 && !state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layerItem.parent];
    const inMaskedGroup = parent.type === 'Group' && (parent as em.Group).clipped;
    const isFirstMaskChild = inMaskedGroup && parent.children[1] === id;
    return parent.children[0] === id || isFirstMaskChild;
  });
  if (state.canvasSettings.focusing && canSendBackward) {
    store.dispatch(sendLayersBackward({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeSendToBack = (): void => {
  const state = store.getState();
  const canSendBackward = state.layer.present.selected.length > 0 && !state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layerItem.parent];
    const inMaskedGroup = parent.type === 'Group' && (parent as em.Group).clipped;
    const isFirstMaskChild = inMaskedGroup && parent.children[1] === id;
    return parent.children[0] === id || isFirstMaskChild;
  });
  if (state.canvasSettings.focusing && canSendBackward) {
    store.dispatch(sendLayersToBack({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignLeft = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToLeft({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignHorizontally = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToCenter({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignRight = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToRight({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignTop = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToTop({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignVertically = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToMiddle({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeAlignBottom = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 2) {
    store.dispatch(alignLayersToBottom({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeDistributeHorizontally = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 3) {
    store.dispatch(distributeLayersHorizontally({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeDistributeVertically = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && state.layer.present.selected.length >= 3) {
    store.dispatch(distributeLayersVertically({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeGroup = (): void => {
  const state = store.getState();
  const canGroup = state.layer.present.selected.length > 0 && !state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    return layerItem.type === 'Artboard';
  });
  if (state.canvasSettings.focusing && canGroup) {
    store.dispatch(groupLayersThunk({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeUngroup = (): void => {
  const state = store.getState();
  const canUngroup = state.layer.present.selected.length > 0 && state.layer.present.selected.some((id: string) => {
    const layerItem = state.layer.present.byId[id];
    return layerItem.type === 'Group';
  });
  if (state.canvasSettings.focusing && canUngroup) {
    store.dispatch(ungroupLayers({layers: state.layer.present.selected}) as any);
  }
};


(window as any).getSaveState = (): string => {
  const state = store.getState();
  const { documentSettings, layer } = state;
  const fileState = { layer: layer.present, documentSettings };
  return JSON.stringify(fileState);
};

(window as any).getSaveState = (): string => {
  const state = store.getState();
  const { documentSettings, layer } = state;
  const fileState = { layer: layer.present, documentSettings };
  return JSON.stringify(fileState);
};

(window as any).getDocumentSettings = (): string => {
  const state = store.getState();
  return JSON.stringify(state.documentSettings);
};

(window as any).getCurrentEdit = (): string => {
  const state = store.getState();
  const currentEdit = {
    edit: state.layer.present.edit,
    dirty: state.documentSettings.edit !== state.layer.present.edit,
    path: state.documentSettings.path,
    name: state.documentSettings.name
  }
  return JSON.stringify(currentEdit);
};

(window as any).getCurrentTheme = (): string => {
  const state = store.getState();
  return state.theme.theme;
};

(window as any).saveDocument = (): void => {
  const state = store.getState();
  store.dispatch(saveDocument({edit: state.layer.present.edit}));
  return (window as any).getSaveState();
};

(window as any).saveDocumentAs = (documentSettings: { base: string; fullPath: string }): void => {
  const state = store.getState();
  store.dispatch(saveDocumentAs({name: documentSettings.base, path: documentSettings.fullPath, edit: state.layer.present.edit}));
  titleBar.updateTitle(documentSettings.base);
  return (window as any).getSaveState();
};

(window as any).openFile = (fileJSON: any): void => {
  store.dispatch(openFile({file: fileJSON}));
  titleBar.updateTitle(fileJSON.documentSettings.name);
  store.dispatch(ActionCreators.clearHistory());
};

(window as any).setTitleBarTheme = (theme: em.ThemeName): void => {
  themeObject = getTheme(theme);
  titleBar.updateBackground(Color.fromHex(theme === 'dark' ? themeObject.background.z1 : themeObject.background.z2));
};

(window as any).setTheme = (theme: em.ThemeName): void => {
  switch(theme) {
    case 'light':
      store.dispatch(enableLightTheme());
      break;
    case 'dark':
      store.dispatch(enableDarkTheme());
      break;
  }
};

(window as any).previewClosed = (): void => {
  store.dispatch(closePreview());
};

(window as any).renderNewDocument = (): void => {
  const state = store.getState();
  titleBar.updateTitle(state.documentSettings.name);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

(window as any).renderPreviewWindow = (): void => {
  titleBar.updateTitle('Preview');
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Preview />
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

// (window as any).renderPreferencesWindow = (): void => {
//   titleBar.updateTitle('Preferences');
//   ReactDOM.render(
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <ThemeProvider>
//           <Preferences />
//         </ThemeProvider>
//       </PersistGate>
//     </Provider>,
//     document.getElementById('root')
//   );
// };

// (window as any).renderSketchImporterWindow = (sketchFile: any): void => {
//   titleBar.updateTitle('Sketch Import');
//   ReactDOM.render(
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <ThemeProvider>
//           <SketchImporter
//             sketchFile={sketchFile} />
//         </ThemeProvider>
//       </PersistGate>
//     </Provider>,
//     document.getElementById('root')
//   );
// };