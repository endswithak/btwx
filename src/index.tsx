import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import Preview from './components/Preview';
import Preferences from './components/Preferences';
import Menu from './components/Menu';
import ContextMenu from './components/ContextMenu';
import configureStore from './store';
import ThemeProvider from './components/ThemeProvider';
import './app.global.sass';

(window as any).renderDocument = (preloadedState?: Btwx.Document): void => {
  const store = configureStore(preloadedState, true);
  ReactDOM.render(
    <Provider store={store}>
      <Menu />
      <ContextMenu />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};

(window as any).renderPreview = (preloadedState?: Btwx.Document): void => {
  const store = configureStore(preloadedState);
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Preview />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};

(window as any).renderPreferences = (preloadedState?: Btwx.Document): void => {
  const store = configureStore(preloadedState);
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <Preferences />
      </ThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
};
