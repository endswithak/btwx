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
  const store = configureStore({preloadedState, windowType: 'document'});
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
  const store = configureStore({preloadedState, windowType: 'preview'});
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Titlebar isPreview />
        <Preview />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};