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

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Preview from './components/Preview';
import { ThemeProvider } from './components/ThemeProvider';
import { Provider } from 'react-redux';
import store, { persistor, persistConfig } from './store';
import persist from './store/utils/persist';
import { PersistGate } from 'redux-persist/integration/react';
import { remote } from 'electron';

import './styles/index.sass';

window.addEventListener('storage', persist(store, persistConfig));

window.renderMainWindow = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
}

window.renderPreviewWindow = () => {
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