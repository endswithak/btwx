import paper from 'paper';
import { RootState } from '../reducers';

export const getLayerByPaperId = (store: RootState, id: number): em.Layer => {
  let layer: em.Layer;
  Object.keys(store.page.byId).forEach((layerId) => {
    if (store.page.byId[layerId].paperLayer === id) {
      layer = store.page.byId[layerId];
    }
  });
  if (!layer) {
    Object.keys(store.shape.byId).forEach((layerId) => {
      if (store.shape.byId[layerId].paperLayer === id) {
        layer = store.shape.byId[layerId];
      }
    });
  }
  return layer;
}

export const getLayer = (store: RootState, id: string): em.Layer => {
  switch(true) {
    case store.shape.allIds.includes(id):
      return store.shape.byId[id];
    case store.page.allIds.includes(id):
      return store.page.byId[id];
  }
}

export const getParentLayer = (store: RootState, id: string): em.Layer => {
  const layer = getLayer(store, id);
  switch(true) {
    case store.shape.allIds.includes(layer.parent):
      return store.shape.byId[layer.parent];
    case store.page.allIds.includes(layer.parent):
      return store.page.byId[layer.parent];
  }
}

export const getPaperLayer = (store: RootState, id: string): paper.Item => {
  const layer = getLayer(store, id);
  return paper.project.getItem({id: layer.paperLayer});
}