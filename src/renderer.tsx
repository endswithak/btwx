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
  return JSON.stringify(state.layer.present.edit);
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
  return (window as any).getSaveState();
};

(window as any).openFile = (fileJSON: any): void => {
  store.dispatch(openFile({file: fileJSON}));
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
  window.onbeforeunload = (e: any): void => {
    const state = store.getState();
    if (state.documentSettings.edit !== state.layer.present.edit) {
      e.returnValue = false;
      remote.dialog.showMessageBox({
        type: 'question',
        buttons: ['Save', 'Cancel', 'Dont Save'],
        cancelId: 1,
        message: `Do you want to save the changes made to the document “${state.documentSettings.name}”?`,
        detail: 'Your changes will be lost if you don’t save them.'
      }).then((data: any) => {
        switch(data.response) {
          case 0: {
            if (state.documentSettings.path) {
              ipcRenderer.send('saveDocument', state.documentSettings.path);
            } else {
              ipcRenderer.send('saveDocumentAs');
            }
            break;
          }
          case 2: {
            store.dispatch(saveDocument({edit: state.layer.present.edit}));
            remote.getCurrentWindow().close();
            break;
          }
        }
      });
    }
  }
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
  window.onbeforeunload = (e: any): void => {
    store.dispatch(closePreview());
  }
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