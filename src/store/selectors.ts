import { RootState } from '../store/reducers';
import LayerNode from '../canvas/base/layerNode';

export const getLayer = (store: RootState, id: string): LayerNode => {
  return store.layers.layerById[id] as LayerNode;
}

export const getParentLayer = (store: RootState, id: string): LayerNode => {
  const layer = getLayer(store, id);
  return store.layers.layerById[layer.parent] as LayerNode;
}

export const getPaperLayer = (store: RootState, id: string): paper.Item => {
  return store.layers.paperLayers[id];
}

export const getActivePage = (store: RootState): LayerNode => {
  return store.layers.layerById[store.layers.activePage] as LayerNode;
}

export const getActivePagePaperLayer = (store: RootState) => {
  const activePage = store.layers.activePage;
  return store.layers.paperLayers[activePage];
}