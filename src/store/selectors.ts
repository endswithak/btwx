import { RootState } from '../store/reducers';
import LayerNode from '../canvas/base/layerNode';

export const getLayer = (store: RootState, id: string): LayerNode => {
  return store.layers.layerById[id] as LayerNode;
}

export const getParentLayer = (store: RootState, id: string): LayerNode => {
  const layer = getLayer(store, id);
  return store.layers.layerById[layer.parent] as LayerNode;
}

export const getLayerIndex = (store: RootState, id: string): number => {
  const layer = getLayer(store, id);
  const parent = getParentLayer(store, layer.parent);
  return parent.children.indexOf(id);
}

export const getPaperLayer = (store: RootState, id: string): paper.Item => {
  const layer = getLayer(store, id);
  return layer.paperItem();
}

export const getActivePage = (store: RootState): LayerNode => {
  return store.layers.layerById[store.layers.activePage] as LayerNode;
}

export const getActivePagePaperLayer = (store: RootState) => {
  const activePage = store.layers.activePage;
  return getPaperLayer(store, activePage);
}