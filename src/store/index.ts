import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { remote } from 'electron';
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

// const store = createStore(rootReducer, applyMiddleware(logger, thunk));
// export type StoreDispatch = typeof store.dispatch;
// export type StoreGetState = typeof store.getState;
// export type Store = typeof store;

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

// export default store;