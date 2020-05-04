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

export const getPaperLayerByPaperId = (id: string): paper.Item => {
  return paper.project.getItem({ data: { id } });
}

export const getPaperLayer = (id: string): paper.Item => {
  return paper.project.getItem({ data: { id } });
}

// export const getActiveGroup = (store: LayerState): em.Group => {
//   return store.byId[store.activeGroup] as em.Group;
// }

export const getPage = (store: LayerState): em.Page => {
  return store.byId[store.page] as em.Page;
}

export const getPagePaperLayer = (store: LayerState): paper.Item => {
  const page = store.page;
  return getPaperLayer(page);
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

export const getScopeLayers = (store: LayerState) => {
  const rootItems = getPage(store).children;
  const expandedItems = store.scope.reduce((result, current) => {
    const layer = getLayer(store, current);
    result = [...result, ...layer.children];
    return result;
  }, []);
  return [...rootItems, ...expandedItems];
}

export const getScopeGroupLayers = (store: LayerState) => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.reduce((result, current) => {
    const layer = getLayer(store, current);
    if (layer.type === 'Group') {
      result = [...result, current];
    }
    return result;
  }, []);
}

export const isScopeLayer = (store: LayerState, id: string) => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.includes(id);
}

export const isScopeGroupLayer = (store: LayerState, id: string) => {
  const expandableLayers = getScopeGroupLayers(store);
  return expandableLayers.includes(id);
}

export const getNearestScopeAncestor = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  while(!isScopeLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
}

export const getNearestScopeGroupAncestor = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  while(!isScopeGroupLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
}

export const getLayerScope = (store: LayerState, id: string) => {
  const newScope = [];
  let currentLayer = id;
  while(getParentLayer(store, currentLayer).type === 'Group') {
    const parentGroup = getParentLayer(store, currentLayer);
    newScope.push(parentGroup.id);
    currentLayer = parentGroup.id;
  }
  return newScope.reverse();
}

export const getSelectionTopLeft = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getSelectionBottomRight = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getClipboardTopLeft = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const paperLayer = store.clipboard.byId[current].paperLayer;
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getClipboardBottomRight = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const paperLayer = store.clipboard.byId[current].paperLayer;
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}
