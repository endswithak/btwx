import { ipcRenderer } from 'electron';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';
import { closePreview, startPreviewRecording, stopPreviewRecording, setPreviewFocusing, openPreview, setPreviewTweening } from './actions/preview';
import { hydratePreferences } from './actions/preferences';
import { setEventDrawerEvent, setEventDrawerEventThunk } from './actions/eventDrawer';
import { hydrateLayers, addLayerTween, removeLayerTweens, removeLayerTween, removeLayersEvent } from './actions/layer';
import { openEaseEditor, closeEaseEditor } from './actions/easeEditor';
import { hydrateKeyBindings } from './actions/keyBindings';
import { hydrateArtboardPresets } from './actions/artboardPresets';
import { setActiveArtboard } from './actions/layer';
import { KeyBindingsState } from './reducers/keyBindings';
import { PreferencesState } from './reducers/preferences';
import { ArtboardPresetsState } from './reducers/artboardPresets';
import { hydrateDocumentThunk, saveDocumentAs, saveDocument, hydrateDocumentImages } from './actions/documentSettings';
import { HydrateDocumentPayload, SaveDocumentAsPayload, SaveDocumentPayload } from './actionTypes/documentSettings';
import { LayerState } from './reducers/layer';

const configureStore: any = (preloadedState, isDocumentWindow = false): typeof store => {
  const store = createStore(rootReducer, preloadedState, applyMiddleware(logger, thunk));
  let currentEdit: string = null;
  let currentDocumentImages: string[] = [];
  // let currentActiveArtboard: string = null;
  const handleChange = () => {
    const currentState = store.getState() as RootState;
    const previousEdit: string = currentEdit;
    // const previousActiveArtboard: string = currentActiveArtboard;
    const instanceId = currentState.session.instance;
    currentEdit = currentState.layer.present.edit.id;
    // currentActiveArtboard = currentState.layer.present.activeArtboard;
    if (previousEdit !== currentEdit) {
      const cdi = currentState.documentSettings.images.allIds;
      if (cdi.length !== currentDocumentImages.length || cdi.every((id) => currentDocumentImages.includes(id))) {
        ipcRenderer.send('hydrateDocumentImages', JSON.stringify({
          instanceId: instanceId,
          images: currentState.documentSettings.images
        }));
        currentDocumentImages = cdi;
      }
      ipcRenderer.send('hydratePreviewLayers', JSON.stringify({
        instanceId: instanceId,
        state: currentState.layer.present
      }));
    }
    // if (isMainWindow && currentActiveArtboard !== previousActiveArtboard) {
    //   ipcRenderer.send('setPreviewActiveArtboard', JSON.stringify({
    //     instanceId: instanceId,
    //     activeArtboard: currentActiveArtboard
    //   }));
    // }
  }
  if (isDocumentWindow) {
    store.subscribe(handleChange);
  }
  (window as any).getCurrentEdit = (): string => {
    const state = store.getState();
    return JSON.stringify({
      edit: state.layer.present.edit,
      dirty: state.documentSettings.edit !== state.layer.present.edit.id,
      path: state.documentSettings.path,
      name: state.documentSettings.name
    });
  };
  (window as any).getDocumentState = (): string => {
    const state = store.getState();
    const { documentSettings, layer, viewSettings } = state;
    return JSON.stringify({
      viewSettings,
      documentSettings: {
        ...documentSettings,
        edit: null
      },
      layer: {
        past: [],
        present: {
          ...layer.present,
          hover: null,
          tree: {
            tree: {},
            scroll: layer.present.tree.scroll
          }
        },
        future: []
      }
    });
  };
  (window as any).resizePreview = (params: any): void => {
    ipcRenderer.send('resizePreview', JSON.stringify(params));
  };
  (window as any).hydrateDocument = (state: HydrateDocumentPayload): void => {
    store.dispatch(hydrateDocumentThunk(state) as any);
  };
  (window as any).hydrateDocumentImages = (params: any): void => {
    store.dispatch(hydrateDocumentImages(params));
  };
  (window as any).hydratePreferences = (state: PreferencesState): void => {
    store.dispatch(hydratePreferences(state));
  };
  (window as any).hydrateKeyBindings = (state: KeyBindingsState): void => {
    store.dispatch(hydrateKeyBindings(state));
  };
  (window as any).hydrateArtboardPresets = (state: ArtboardPresetsState): void => {
    store.dispatch(hydrateArtboardPresets(state));
  };
  (window as any).hydrateLayers = (state: LayerState): void => {
    store.dispatch(hydrateLayers(state));
  };
  (window as any).addLayerTween = (params: any): void => {
    store.dispatch(addLayerTween(params));
  };
  (window as any).removeLayerTweens = (params: any): void => {
    store.dispatch(removeLayerTweens(params));
  };
  (window as any).removeLayerTween = (params: any): void => {
    store.dispatch(removeLayerTween(params));
  };
  (window as any).removeLayersEvent = (params: any): void => {
    store.dispatch(removeLayersEvent(params));
  };
  (window as any).openEaseEditor = (params: any): void => {
    store.dispatch(openEaseEditor(params) as any);
  };
  (window as any).closeEaseEditor = (): void => {
    store.dispatch(closeEaseEditor() as any);
  };
  (window as any).openPreview = (): void => {
    store.dispatch(openPreview());
  };
  (window as any).closePreview = (): void => {
    store.dispatch(closePreview());
  };
  (window as any).setPreviewFocusing = (focusing: boolean): void => {
    store.dispatch(setPreviewFocusing({focusing}));
  };
  (window as any).setPreviewTweening = (tweening: string): void => {
    store.dispatch(setPreviewTweening({tweening}));
  };
  (window as any).startPreviewRecording = (): void => {
    store.dispatch(startPreviewRecording());
  };
  (window as any).stopPreviewRecording = (): void => {
    store.dispatch(stopPreviewRecording());
  };
  (window as any).setActiveArtboard = (activeArtboard: string): void => {
    store.dispatch(setActiveArtboard({id: activeArtboard}));
  };
  (window as any).setEventDrawerEvent = (event: string): void => {
    store.dispatch(setEventDrawerEvent({id: event}));
  };
  (window as any).setEventDrawerEventThunk = (params: any): void => {
    store.dispatch(setEventDrawerEventThunk(params) as any);
  };
  (window as any).saveDocumentAs = (payload: SaveDocumentAsPayload): void => {
    store.dispatch(saveDocumentAs(payload));
  };
  (window as any).saveDocument = (payload: SaveDocumentPayload): void => {
    store.dispatch(saveDocument(payload));
  };
  return store;
}

export default configureStore;