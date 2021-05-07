import { ipcRenderer } from 'electron';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';
import { closePreview, startPreviewRecording, stopPreviewRecording, setPreviewFocusing, openPreview, setPreviewTweening } from './actions/preview';
import { hydratePreferences } from './actions/preferences';
import { setEventDrawerEvent, setEventDrawerEventThunk } from './actions/eventDrawer';
import { hydrateLayers, addLayerTween, removeLayerTweens, removeLayerTween, removeLayersEvent, insertImageThunk, groupSelectedThunk, ungroupSelectedThunk, alignSelectedToLeftThunk, alignSelectedToCenterThunk, alignSelectedToRightThunk, alignSelectedToTopThunk, alignSelectedToMiddleThunk, alignSelectedToBottomThunk, distributeSelectedHorizontallyThunk, distributeSelectedVerticallyThunk, sendSelectedBackwardThunk, bringSelectedForwardThunk, removeLayersGradientStop } from './actions/layer';
import { openEaseEditor, closeEaseEditor } from './actions/easeEditor';
import { zoomInThunk, zoomOutThunk } from './actions/zoomTool';
import { toggleArtboardToolThunk } from './actions/artboardTool';
import { toggleShapeToolThunk } from './actions/shapeTool';
import { toggleTextToolThunk } from './actions/textTool';
import { hydrateKeyBindings } from './actions/keyBindings';
import { hydrateArtboardPresets } from './actions/artboardPresets';
import { setActiveArtboard } from './actions/layer';
import { KeyBindingsState } from './reducers/keyBindings';
import { PreferencesState } from './reducers/preferences';
import { ArtboardPresetsState } from './reducers/artboardPresets';
import { hydrateDocumentThunk, saveDocumentAs, saveDocument } from './actions/documentSettings';
import { hydrateSessionImages } from './actions/session';
import { HydrateDocumentPayload, SaveDocumentAsPayload, SaveDocumentPayload } from './actionTypes/documentSettings';
import { LayerState } from './reducers/layer';

const configureStore: any = (preloadedState, isDocumentWindow = false): typeof store => {
  const isDev = preloadedState.session.env === 'development';
  const store = createStore(rootReducer, preloadedState, (isDev ? applyMiddleware(logger, thunk) : applyMiddleware(thunk)));
  let currentEdit: string = null;
  let currentSessionImages: string[] = [];
  let currentActiveArtboard: string = null;
  const handleChange = () => {
    const currentState = store.getState() as RootState;
    const previousEdit: string = currentEdit;
    const previousActiveArtboard: string = currentActiveArtboard;
    const instanceId = currentState.session.instance;
    currentEdit = currentState.layer.present.edit.id;
    currentActiveArtboard = currentState.layer.present.activeArtboard;
    if (previousEdit !== currentEdit) {
      const csi = currentState.session.images.allIds;
      if (csi.length !== currentSessionImages.length || csi.every((id) => currentSessionImages.includes(id))) {
        ipcRenderer.send('hydratePreviewSessionImages', JSON.stringify({
          instanceId: instanceId,
          images: currentState.session.images
        }));
        currentSessionImages = csi;
      }
      ipcRenderer.send('hydratePreviewLayers', JSON.stringify({
        instanceId: instanceId,
        state: currentState.layer.present
      }));
    }
    if (currentActiveArtboard !== previousActiveArtboard) {
      ipcRenderer.send('setPreviewActiveArtboard', JSON.stringify({
        instanceId: instanceId,
        activeArtboard: currentActiveArtboard
      }));
    }
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
    const documentImages = state.layer.present.allImageIds.reduce((result, current) => {
      const layerItem = state.layer.present.byId[current] as Btwx.Image;
      if (!result.includes(layerItem.imageId)) {
        result = [...result, layerItem.imageId];
      }
      return result;
    }, []);
    const { documentSettings, layer, viewSettings } = state;
    return JSON.stringify({
      viewSettings,
      documentSettings: {
        ...documentSettings,
        edit: null,
        images: {
          allIds: documentImages,
          byId: documentImages.reduce((result, current) => ({
            ...result,
            [current]: state.session.images.byId[current]
          }), {})
        }
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
  (window as any).hydrateSessionImages = (params: any): void => {
    store.dispatch(hydrateSessionImages(params));
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
  (window as any).insertImageThunk = (): void => {
    store.dispatch(insertImageThunk() as any);
  };
  (window as any).groupSelectedThunk = (): void => {
    store.dispatch(groupSelectedThunk() as any);
  };
  (window as any).ungroupSelectedThunk = (): void => {
    store.dispatch(ungroupSelectedThunk() as any);
  };
  (window as any).alignSelectedToLeftThunk = (): void => {
    store.dispatch(alignSelectedToLeftThunk() as any);
  };
  (window as any).alignSelectedToCenterThunk = (): void => {
    store.dispatch(alignSelectedToCenterThunk() as any);
  };
  (window as any).alignSelectedToRightThunk = (): void => {
    store.dispatch(alignSelectedToRightThunk() as any);
  };
  (window as any).alignSelectedToTopThunk = (): void => {
    store.dispatch(alignSelectedToTopThunk() as any);
  };
  (window as any).alignSelectedToMiddleThunk = (): void => {
    store.dispatch(alignSelectedToMiddleThunk() as any);
  };
  (window as any).alignSelectedToBottomThunk = (): void => {
    store.dispatch(alignSelectedToBottomThunk() as any);
  };
  (window as any).distributeSelectedHorizontallyThunk = (): void => {
    store.dispatch(distributeSelectedHorizontallyThunk() as any);
  };
  (window as any).distributeSelectedVerticallyThunk = (): void => {
    store.dispatch(distributeSelectedVerticallyThunk() as any);
  };
  (window as any).sendSelectedBackwardThunk = (): void => {
    store.dispatch(sendSelectedBackwardThunk() as any);
  };
  (window as any).bringSelectedForwardThunk = (): void => {
    store.dispatch(bringSelectedForwardThunk() as any);
  };
  (window as any).zoomInThunk = (): void => {
    store.dispatch(zoomInThunk() as any);
  };
  (window as any).zoomOutThunk = (): void => {
    store.dispatch(zoomOutThunk() as any);
  };
  (window as any).toggleArtboardToolThunk = (): void => {
    store.dispatch(toggleArtboardToolThunk() as any);
  };
  (window as any).toggleShapeToolThunk = (shapeType): void => {
    store.dispatch(toggleShapeToolThunk(shapeType) as any);
  };
  (window as any).toggleTextToolThunk = (): void => {
    store.dispatch(toggleTextToolThunk() as any);
  };
  (window as any).removeLayersGradientStop = (params): void => {
    store.dispatch(removeLayersGradientStop(params) as any);
  };
  return store;
}

export default configureStore;