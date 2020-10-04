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

import { remote } from 'electron';
import React from 'react';
import sharp from 'sharp';
import { ActionCreators } from 'redux-undo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Titlebar, Color } from 'custom-electron-titlebar';
import store from './store';
import getTheme from './store/theme';
import { saveDocumentAs, saveDocument, openDocument } from './store/actions/documentSettings';
import { closePreview, hydratePreview, startPreviewRecording, stopPreviewRecording, setPreviewFocusing, setPreviewWindowId, setPreviewDocumentWindowId } from './store/actions/preview';
import App from './components/App';
import Preview from './components/Preview';
// import Preferences from './components/Preferences';
// import SketchImporter from './components/SketchImporter';
// import importSketchArtboards from './canvas/sketch';
import ThemeProvider from './components/ThemeProvider';
import { pasteLayersThunk, pasteStyleThunk, copyStyleThunk, copyLayersThunk, removeLayersThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, escapeLayerScopeThunk, removeLayers, addImageThunk, alignLayersToBottom, alignLayersToCenter, alignLayersToLeft, alignLayersToMiddle, alignLayersToRight, alignLayersToTop, distributeLayersHorizontally, distributeLayersVertically, applyBooleanOperationThunk, toggleSelectionFillThunk, toggleSelectionShadowThunk, toggleSelectionStrokeThunk, addSelectionMaskThunk, toggleSelectionHorizontalFlipThunk, toggleSelectionVerticalFlipThunk, copySVGThunk, pasteSVGThunk } from './store/actions/layer';
import { toggleArtboardToolThunk} from './store/actions/artboardTool';
import { toggleTextToolThunk } from './store/actions/textTool';
import { toggleShapeToolThunk } from './store/actions/shapeTool';
import { zoomInThunk, zoomOutThunk, zoomSelectionThunk, zoomCanvasThunk } from './store/actions/zoomTool';
import { toggleTweenDrawerThunk, toggleRightSidebarThunk, toggleLeftSidebarThunk, enableDarkTheme, enableLightTheme } from './store/actions/viewSettings';
import { centerSelectionThunk } from './store/actions/translateTool';
import { duplicateLayers, selectAllLayers, selectLayers, setActiveArtboard } from './store/actions/layer';
import { canGroupSelection, canUngroupSelection, canSendBackwardSelection, canBringForwardSelection } from './store/selectors/layer';
import { PREVIEW_PREFIX } from './constants';

import './styles/index.sass';
import { RootState } from './store/reducers';

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
  store.dispatch(copyLayersThunk() as any);
};

(window as any).editCopyStyle = (): void => {
  store.dispatch(copyStyleThunk() as any);
};

(window as any).editCopySVG = (): void => {
  store.dispatch(copySVGThunk() as any);
};

(window as any).editPaste = (): void => {
  store.dispatch(pasteLayersThunk({}) as any);
};

(window as any).editPasteOverSelection = (): void => {
  store.dispatch(pasteLayersThunk({overSelection: true}) as any);
};

(window as any).editPasteSVG = (): void => {
  store.dispatch(pasteSVGThunk() as any);
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

(window as any).editDuplicate = (): void => {
  const state = store.getState();
  if (state.layer.present.selected.length > 0) {
    store.dispatch(duplicateLayers({layers: state.layer.present.selected}));
  }
};

(window as any).editSelectAll = (): void => {
  const state = store.getState();
  if (state.layer.present.allIds.length > 0) {
    store.dispatch(selectAllLayers());
  }
};

(window as any).editSelectAllArtboards = (): void => {
  const state = store.getState();
  if (state.layer.present.allArtboardIds.length > 0) {
    store.dispatch(selectLayers({layers: state.layer.present.allArtboardIds, newSelection: true}));
  }
};

(window as any).insertArtboard = (): void => {
  store.dispatch(toggleArtboardToolThunk() as any);
};

(window as any).insertShape = (shapeType: em.ShapeType): void => {
  store.dispatch(toggleShapeToolThunk(shapeType) as any);
};

(window as any).insertText = (): void => {
  store.dispatch(toggleTextToolThunk() as any);
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
  if (state.canvasSettings.focusing && canBringForwardSelection(state.layer.present)) {
    store.dispatch(sendLayersForward({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeBringToFront = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && canBringForwardSelection(state.layer.present)) {
    store.dispatch(sendLayersToFront({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeSendBackward = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && canSendBackwardSelection(state.layer.present)) {
    store.dispatch(sendLayersBackward({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeSendToBack = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && canSendBackwardSelection(state.layer.present)) {
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
  if (state.canvasSettings.focusing && canGroupSelection(state.layer.present)) {
    store.dispatch(groupLayersThunk({layers: state.layer.present.selected}) as any);
  }
};

(window as any).arrangeUngroup = (): void => {
  const state = store.getState();
  if (state.canvasSettings.focusing && canUngroupSelection(state.layer.present)) {
    store.dispatch(ungroupLayers({layers: state.layer.present.selected}) as any);
  }
};

(window as any).viewZoomIn = (): void => {
  store.dispatch(zoomInThunk() as any);
};

(window as any).viewZoomOut = (): void => {
  store.dispatch(zoomOutThunk() as any);
};

(window as any).viewZoomFitCanvas = (): void => {
  store.dispatch(zoomCanvasThunk() as any);
};

(window as any).viewZoomFitSelection = (): void => {
  store.dispatch(zoomSelectionThunk() as any);
};

(window as any).viewZoomFitArtboard = (): void => {
  store.dispatch(zoomSelectionThunk() as any);
};

(window as any).viewCenterSelection = (): void => {
  store.dispatch(centerSelectionThunk() as any);
};

(window as any).viewShowLayers = (): void => {
  store.dispatch(toggleLeftSidebarThunk() as any);
};

(window as any).viewShowStyles = (): void => {
  store.dispatch(toggleRightSidebarThunk() as any);
};

(window as any).viewShowEvents = (): void => {
  store.dispatch(toggleTweenDrawerThunk() as any);
};

(window as any).layerStyleFill = (): void => {
  store.dispatch(toggleSelectionFillThunk() as any);
};

(window as any).layerStyleStroke = (): void => {
  store.dispatch(toggleSelectionStrokeThunk() as any);
};

(window as any).layerStyleShadow = (): void => {
  store.dispatch(toggleSelectionShadowThunk() as any);
};

(window as any).layerMask = (): void => {
  store.dispatch(addSelectionMaskThunk() as any);
};

(window as any).layerCombine = (booleanOperation: em.BooleanOperation): void => {
  const state = store.getState();
  store.dispatch(applyBooleanOperationThunk({layers: state.layer.present.selected}, booleanOperation) as any);
};

(window as any).layerMask = (): void => {
  store.dispatch(addSelectionMaskThunk() as any);
};

(window as any).layerTransformFlipHorizontally = (): void => {
  store.dispatch(toggleSelectionHorizontalFlipThunk() as any);
};

(window as any).layerTransformFlipVertically = (): void => {
  store.dispatch(toggleSelectionVerticalFlipThunk() as any);
};

(window as any).getState = (): string => {
  const state = store.getState();
  return JSON.stringify(state);
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
  return state.viewSettings.theme;
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
  const previewWindowId = state.preview.windowId;
  if (previewWindowId) {
    remote.BrowserWindow.fromId(previewWindowId).webContents.executeJavaScript(`setTitleBarTitle(${JSON.stringify(`${PREVIEW_PREFIX}${documentSettings.base}`)})`);
  }
  return (window as any).getSaveState();
};

(window as any).openFile = (fileJSON: any): void => {
  store.dispatch(openDocument({document: fileJSON}));
  titleBar.updateTitle(fileJSON.documentSettings.name);
  store.dispatch(ActionCreators.clearHistory());
};

(window as any).setTitleBarTheme = (theme: em.ThemeName): void => {
  themeObject = getTheme(theme);
  titleBar.updateBackground(Color.fromHex(theme === 'dark' ? themeObject.background.z1 : themeObject.background.z2));
};

(window as any).setTitleBarTitle = (title: string): void => {
  titleBar.updateTitle(title);
};

(window as any).setActiveArtboard = (activeArtboard: string): void => {
  store.dispatch(setActiveArtboard({id: activeArtboard}));
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

(window as any).hydratePreview = (state: RootState): void => {
  store.dispatch(hydratePreview({state: state}));
};

(window as any).previewClosed = (): void => {
  store.dispatch(closePreview());
};

(window as any).startPreviewRecording = (): void => {
  store.dispatch(startPreviewRecording());
};

(window as any).stopPreviewRecording = (): void => {
  store.dispatch(stopPreviewRecording());
};

(window as any).setPreviewFocusing = (focusing: boolean): void => {
  store.dispatch(setPreviewFocusing({focusing}));
};

(window as any).setPreviewWindowId = (windowId: number): void => {
  store.dispatch(setPreviewWindowId({windowId}));
};

(window as any).setPreviewDocumentWindowId = (documentWindowId: number): void => {
  store.dispatch(setPreviewDocumentWindowId({documentWindowId}));
};

(window as any).getPreviewState = (): string => {
  const state = store.getState() as RootState;
  return JSON.stringify(state.preview);
};

(window as any).renderNewDocument = (): void => {
  const state = store.getState();
  titleBar.updateTitle(state.documentSettings.name);
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};

(window as any).renderPreviewWindow = (): void => {
  const state = store.getState();
  titleBar.updateTitle(`${PREVIEW_PREFIX}${state.documentSettings.name}`);
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Preview />
      </ThemeProvider>
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