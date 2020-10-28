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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store';
import Menu from './components/Menu';
import Titlebar from './components/Titlebar';
import Preview from './components/Preview';
import ThemeProvider from './components/ThemeProvider';

import './styles/index.sass';

(window as any).renderNewDocument = (preloadedState?: Btwx.Document): void => {
  const store = configureStore(preloadedState);
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
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Menu />
        <Titlebar />
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};

(window as any).renderPreviewWindow = (preloadedState?: Btwx.Document): void => {
  const store = configureStore(preloadedState);
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Titlebar />
        <Preview />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};

// import { ActionCreators } from 'redux-undo';
// import store from './store';
// import { openDocument } from './store/actions/documentSettings';
// import { closePreview, hydratePreview, startPreviewRecording, stopPreviewRecording, setPreviewFocusing, setPreviewWindowId, setPreviewDocumentWindowId } from './store/actions/preview';
// import { enableDarkTheme, enableLightTheme } from './store/actions/viewSettings';
// import { setActiveArtboard } from './store/actions/layer';

// (window as any).getState = (): string => {
//   const state = store.getState();
//   return JSON.stringify(state);
// };

// (window as any).getSaveState = (): string => {
//   const state = store.getState();
//   const { documentSettings, layer } = state;
//   const fileState = { layer: layer.present, documentSettings };
//   return JSON.stringify(fileState);
// };

// (window as any).getDocumentSettings = (): string => {
//   const state = store.getState();
//   return JSON.stringify(state.documentSettings);
// };

// (window as any).getCurrentEdit = (): string => {
//   const state = store.getState();
//   const currentEdit = {
//     edit: state.layer.present.edit,
//     dirty: state.documentSettings.edit !== state.layer.present.edit,
//     path: state.documentSettings.path,
//     name: state.documentSettings.name
//   }
//   return JSON.stringify(currentEdit);
// };

// (window as any).getCurrentTheme = (): string => {
//   const state = store.getState();
//   return state.viewSettings.theme;
// };

// (window as any).saveDocument = (): void => {
//   const state = store.getState();
//   store.dispatch(saveDocument({edit: state.layer.present.edit}));
//   return (window as any).getSaveState();
// };

// (window as any).saveDocumentAs = (documentSettings: { base: string; fullPath: string }): void => {
//   const state = store.getState();
//   store.dispatch(saveDocumentAs({name: documentSettings.base, path: documentSettings.fullPath, edit: state.layer.present.edit}));
//   titleBar.updateTitle(documentSettings.base);
//   const previewWindowId = state.preview.windowId;
//   if (previewWindowId) {
//     remote.BrowserWindow.fromId(previewWindowId).webContents.executeJavaScript(`setTitleBarTitle(${JSON.stringify(`${PREVIEW_PREFIX}${documentSettings.base}`)})`);
//   }
//   return (window as any).getSaveState();
// };

// (window as any).setTitleBarTheme = (theme: Btwx.ThemeName): void => {
//   themeObject = getTheme(theme);
//   titleBar.updateBackground(Color.fromHex(theme === 'dark' ? themeObject.background.z1 : themeObject.background.z2));
// };

// (window as any).setTitleBarTitle = (title: string): void => {
//   titleBar.updateTitle(title);
// };

// (window as any).setActiveArtboard = (activeArtboard: string): void => {
//   store.dispatch(setActiveArtboard({id: activeArtboard}));
// };

// (window as any).setTheme = (theme: Btwx.ThemeName): void => {
//   switch(theme) {
//     case 'light':
//       store.dispatch(enableLightTheme());
//       break;
//     case 'dark':
//       store.dispatch(enableDarkTheme());
//       break;
//   }
// };

// (window as any).hydratePreview = (state: RootState): void => {
//   store.dispatch(hydratePreview({state: state}));
// };

// (window as any).previewClosed = (): void => {
//   store.dispatch(closePreview());
// };

// (window as any).startPreviewRecording = (): void => {
//   store.dispatch(startPreviewRecording());
// };

// (window as any).stopPreviewRecording = (): void => {
//   store.dispatch(stopPreviewRecording());
// };

// (window as any).setPreviewFocusing = (focusing: boolean): void => {
//   store.dispatch(setPreviewFocusing({focusing}));
// };

// (window as any).setPreviewWindowId = (windowId: number): void => {
//   store.dispatch(setPreviewWindowId({windowId}));
// };

// (window as any).setPreviewDocumentWindowId = (documentWindowId: number): void => {
//   store.dispatch(setPreviewDocumentWindowId({documentWindowId}));
// };

// (window as any).getPreviewState = (): string => {
//   const state = store.getState() as RootState;
//   return JSON.stringify(state.preview);
// };

// (window as any).openFile = (fileJSON: any): void => {
//   store.dispatch(openDocument({document: fileJSON}));
//   // titleBar.updateTitle(fileJSON.documentSettings.name);
//   store.dispatch(ActionCreators.clearHistory());
// };

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