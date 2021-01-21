import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { remote } from 'electron';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';
import { hydratePreview, closePreview, startPreviewRecording, stopPreviewRecording, setPreviewFocusing, setPreviewWindowId, setPreviewTweening } from './actions/preview';
import { enableLightTheme, enableDarkTheme } from './actions/viewSettings';
import { setActiveArtboard } from './actions/layer';

const getMinState = (state: RootState) => ({
  layer: state.layer,
  documentSettings: state.documentSettings,
  preview: state.preview,
  viewSettings: state.viewSettings,
  eventDrawer: state.eventDrawer
});

const configureStore = ({ preloadedState, windowType }: { preloadedState: any; windowType: 'document' | 'preview' }): typeof store => {
  const store = createStore(rootReducer, preloadedState, applyMiddleware(logger, thunk));
  // hydrate preview on document edit change
  // update document active artboard on preview active artboard update
  let currentEdit: string = null;
  let currentActiveArtboard: string = null;
  const handleChange = () => {
    const currentState = store.getState() as RootState;
    const previousEdit: string = currentEdit;
    // const previousActiveArtboard: string = currentActiveArtboard;
    const isMainWindow = currentState.preview.documentWindowId === remote.getCurrentWindow().id;
    currentEdit = currentState.layer.present.edit ? currentState.layer.present.edit.id : null;
    currentActiveArtboard = currentState.layer.present.activeArtboard ? currentState.layer.present.activeArtboard : null;
    if (isMainWindow && previousEdit !== currentEdit) {
      const previewWindowId = currentState.preview.windowId;
      if (previewWindowId) {
        const minState = getMinState(currentState);
        remote.BrowserWindow.fromId(previewWindowId).webContents.executeJavaScript(`hydratePreview(${JSON.stringify(minState)})`);
      }
    }
  }
  store.subscribe(handleChange);
  // document & preview window specific functions
  (window as any).getPreviewState = (): string => {
    const state = store.getState();
    return JSON.stringify(state.preview);
  };
  (window as any).setPreviewFocusing = (focusing: boolean): void => {
    store.dispatch(setPreviewFocusing({focusing}));
  };
  // document window specific functions
  if (windowType === 'document') {
    (window as any).getState = (): string => {
      const state = store.getState();
      const minState = getMinState(state);
      return JSON.stringify(minState);
    };
    (window as any).getCurrentEdit = (): string => {
      const state = store.getState();
      const currentEdit = {
        edit: state.layer.present.edit,
        dirty: state.documentSettings.edit !== state.layer.present.edit.id,
        path: state.documentSettings.path,
        name: state.documentSettings.name
      }
      return JSON.stringify(currentEdit);
    };
    (window as any).setActiveArtboard = (activeArtboard: string): void => {
      store.dispatch(setActiveArtboard({id: activeArtboard}));
    };
    (window as any).startPreviewRecording = (): void => {
      store.dispatch(startPreviewRecording());
    };
    (window as any).previewClosed = (): void => {
      store.dispatch(closePreview());
    };
    (window as any).setPreviewWindowId = (windowId: number): void => {
      store.dispatch(setPreviewWindowId({windowId}));
    };
    (window as any).setPreviewTweening = (tweening: string): void => {
      store.dispatch(setPreviewTweening({tweening}));
    };
  }
  // preview window specific functions
  if (windowType === 'preview') {
    (window as any).hydratePreview = (state: RootState): void => {
      store.dispatch(hydratePreview({state: state}));
    };
    (window as any).stopPreviewRecording = (): void => {
      store.dispatch(stopPreviewRecording());
    };
    (window as any).setTheme = (theme: Btwx.ThemeName): void => {
      switch(theme) {
        case 'light':
          store.dispatch(enableLightTheme());
          break;
        case 'dark':
          store.dispatch(enableDarkTheme());
          break;
      }
    };
  }
  return store;
}

export default configureStore;