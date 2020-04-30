import paper from 'paper';
import { LayerState } from '../reducers/layer';

export const getLayerByPaperId = (store: LayerState, id: number): em.Layer => {
  let layer: em.Layer;
  Object.keys(store.byId).forEach((layerId) => {
    if (store.byId[layerId].paperLayer === id) {
      layer = store.byId[layerId];
    }
  });
  return layer;
}

export const getLayer = (store: LayerState, id: string): em.Layer => {
  return store.byId[id] as em.Layer;
}

export const getParentLayer = (store: LayerState, id: string): em.Group => {
  const layer = getLayer(store, id);
  return store.byId[layer.parent] as em.Group;
}

export const getLayerIndex = (store: LayerState, id: string): number => {
  const parent = getParentLayer(store, id);
  return parent.children.indexOf(id);
}

export const getLayerType = (store: LayerState, id: string): em.LayerTypes => {
  const layer = getLayer(store, id);
  return layer.type;
}

export const getPaperLayerByPaperId = (id: number): paper.Item => {
  return paper.project.getItem({ id });
}

export const getPaperLayer = (store: LayerState, id: string): paper.Item => {
  const layer = getLayer(store, id);
  return getPaperLayerByPaperId(layer.paperLayer);
}

// export const getActiveGroup = (store: LayerState): em.Group => {
//   return store.byId[store.activeGroup] as em.Group;
// }

export const getActivePage = (store: LayerState): em.Page => {
  return store.byId[store.activePage] as em.Page;
}

export const getActivePagePaperLayer = (store: LayerState): paper.Item => {
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

export const getLayerDepth = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  let depth = 0;
  while(getParentLayer(store, currentNode.id).type === 'Group') {
    currentNode = getParentLayer(store, currentNode.id);
    depth++;
  }
  return depth;
}