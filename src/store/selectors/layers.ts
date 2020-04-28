import paper from 'paper';
import { LayersState } from '../reducers/layers';

export const getLayerByPaperId = (store: LayersState, id: number): em.Layer => {
  let layer: em.Layer;
  Object.keys(store.layerById).forEach((layerId) => {
    if (store.layerById[layerId].paperLayer === id) {
      layer = store.layerById[layerId];
    }
  });
  return layer;
}

export const getLayer = (store: LayersState, id: string): em.Layer => {
  return store.layerById[id] as em.Layer;
}

export const getParentLayer = (store: LayersState, id: string): em.Group => {
  const layer = getLayer(store, id);
  return store.layerById[layer.parent] as em.Group;
}

export const getLayerIndex = (store: LayersState, id: string): number => {
  const parent = getParentLayer(store, id);
  return parent.children.indexOf(id);
}

export const getLayerType = (store: LayersState, id: string): em.LayerTypes => {
  const layer = getLayer(store, id);
  return layer.type;
}

export const getPaperLayer = (store: LayersState, id: string): paper.Item => {
  const layer = getLayer(store, id);
  return paper.project.getItem({id: layer.paperLayer});
}

export const getActiveGroup = (store: LayersState): em.Group => {
  return store.layerById[store.activeGroup] as em.Group;
}

export const getActivePage = (store: LayersState): em.Page => {
  return store.layerById[store.activePage] as em.Page;
}

export const getActivePagePaperLayer = (store: LayersState): paper.Item => {
  const activePage = store.activePage;
  return getPaperLayer(store, activePage);
}

export const getTopParentGroup = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  while(getParentLayer(store, currentNode.id).type === 'Group') {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
}