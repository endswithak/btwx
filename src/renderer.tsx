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

// import * as sketchfile from 'sketch-file';
// import paper from 'paper';

import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './components/App';
import Preview from './components/Preview';
import Preferences from './components/Preferences';
import ThemeProvider from './components/ThemeProvider';
import store, { persistor, persistConfig } from './store';
import persist from './store/utils/persist';
import { Titlebar, Color } from 'custom-electron-titlebar';
import getTheme from './store/theme';
import { openFile } from './store/reducers';

import './styles/index.sass';

window.addEventListener('storage', persist(store, persistConfig));

let theme = remote.systemPreferences.getUserDefault('theme', 'string');
let themeObject = getTheme(theme);
const titleBar = new Titlebar({
  backgroundColor: Color.fromHex(theme === 'dark' ? themeObject.background.z1 : themeObject.background.z2)
});

(window as any).saveFile = () => {
  const state = store.getState();
  const {
    layer,
    canvasSettings,
    tool,
    contextMenu,
    tweenDrawer,
    easeEditor,
    textEditor,
    textSettings,
    colorEditor,
    gradientEditor,
    artboardPresetEditor,
    rightSidebar,
    theme
  } = state;
  const fileState = {
    layer,
    canvasSettings,
    tool,
    contextMenu,
    tweenDrawer,
    easeEditor,
    textEditor,
    textSettings,
    colorEditor,
    gradientEditor,
    artboardPresetEditor,
    rightSidebar,
    theme
  }
  return JSON.stringify(fileState);
}

(window as any).openFile = (fileJSON: any) => {
  store.dispatch(openFile({file: fileJSON}));
}

(window as any).updateTheme = () => {
  theme = remote.systemPreferences.getUserDefault('theme', 'string');
  themeObject = getTheme(theme);
  titleBar.updateBackground(Color.fromHex(theme === 'dark' ? themeObject.background.z1 : themeObject.background.z2));
}

(window as any).renderMainWindow = () => {
  titleBar.updateTitle('eSketch');
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
}

(window as any).renderPreviewWindow = () => {
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
}

(window as any).renderPreferencesWindow = () => {
  titleBar.updateTitle('Preferences');
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Preferences />
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
}