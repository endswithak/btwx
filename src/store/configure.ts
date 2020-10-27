import { createStore, applyMiddleware } from 'redux';
import { remote } from 'electron';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';

export default function configureStore(preloadedState: any): typeof store {
  const store = createStore(rootReducer, preloadedState, applyMiddleware(logger, thunk));
  // let currentEdit: string;
  // let currentActiveArtboard: string;
  // const handleChange = () => {
  //   const currentState = store.getState() as RootState;
  //   const previousEdit: string = currentEdit;
  //   const previousActiveArtboard: string = currentActiveArtboard;
  //   const isMainWindow = currentState.preview.documentWindowId === remote.getCurrentWindow().id;
  //   currentEdit = currentState.layer.present.edit;
  //   currentActiveArtboard = currentState.layer.present.activeArtboard;
  //   if (isMainWindow && (previousEdit !== currentEdit || previousActiveArtboard !== currentActiveArtboard)) {
  //     const previewWindowId = currentState.preview.windowId;
  //     if (previewWindowId) {
  //       remote.BrowserWindow.fromId(previewWindowId).webContents.executeJavaScript(`hydratePreview(${JSON.stringify(currentState)})`);
  //     }
  //   }
  //   if (!isMainWindow && previousActiveArtboard !== currentActiveArtboard) {
  //     const documentWindowId = currentState.preview.documentWindowId;
  //     if (documentWindowId) {
  //       remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(currentActiveArtboard)})`);
  //     }
  //   }
  // }
  // store.subscribe(handleChange);
  return store;
}