import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { remote } from 'electron';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';
import { PREVIEW_PREFIX } from '../constants';

const store = createStore(rootReducer, applyMiddleware(logger, thunk));
export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;
export type Store = typeof store;

let currentEdit: string;
let currentActiveArtboard: string;
const handleChange = () => {
  const previousEdit: string = currentEdit;
  const previousActiveArtboard: string = currentActiveArtboard;
  const isMainWindow = remote.getCurrentWindow().getParentWindow() ? false : true;
  const currentState = store.getState() as RootState;
  currentEdit = currentState.layer.present.edit;
  currentActiveArtboard = currentState.layer.present.activeArtboard;
  if (isMainWindow && (previousEdit !== currentEdit || previousActiveArtboard !== currentActiveArtboard)) {
    const previewWindow = remote.getCurrentWindow().getChildWindows().find((window) => window.getTitle().startsWith(PREVIEW_PREFIX));
    if (previewWindow) {
      previewWindow.webContents.executeJavaScript(`hydratePreview(${JSON.stringify(currentState)})`);
    }
  }
  if (!isMainWindow && previousActiveArtboard !== currentActiveArtboard) {
    const parentWindow = remote.getCurrentWindow().getParentWindow();
    if (parentWindow) {
      parentWindow.webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(currentActiveArtboard)})`);
    }
  }
}

store.subscribe(handleChange);

export default store;