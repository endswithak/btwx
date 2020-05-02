import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { AddPage, AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer, AddLayerChild, InsertLayerChild, EnableLayerHover, DisableLayerHover, InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer, DeselectAllLayers, RemoveLayers, SetGroupScope, HideLayerChildren, ShowLayerChildren, DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope, CopyLayerToClipboard, CopyLayersToClipboard, PasteLayersFromClipboard } from '../actionTypes/layer';
import { addItem, removeItem, insertItem } from './general';
import { getLayerIndex, getLayer, getLayerDepth, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getNearestScopeGroupAncestor, getParentLayer, getLayerScope, getPaperLayer, getSelectionTopLeft, getPaperLayerByPaperId, getClipboardTopLeft } from '../selectors/layer';
import { clipboard } from 'electron';

const removeLayerAndChildren = (state: LayerState, layer: string): string[] => {
  const groups: string[] = [layer];
  const layersToRemove: string[] = [layer];
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        layersToRemove.push(child);
      });
    }
    i++;
  }
  return layersToRemove;
};

export const addPage = (state: LayerState, action: AddPage): LayerState => {
  return {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...action.payload
      } as em.Page
    },
    page: action.payload.id
  }
};

export const addLayer = (state: LayerState, action: AddGroup | AddShape): LayerState => {
  const layerParent = action.payload.parent ? action.payload.parent : state.page;
  const paperLayer = getPaperLayerByPaperId(action.payload.paperLayer);
  paperLayer.parent = getPaperLayerByPaperId(state.byId[layerParent].paperLayer);
  const stateWithLayer = {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent
      } as em.Page | em.Group | em.Shape,
      [layerParent]: {
        ...state.byId[layerParent],
        children: addItem((state.byId[layerParent] as em.Group).children, action.payload.id)
      } as em.Group
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return selectLayer(stateWithLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  const layer = state.byId[action.payload.id];
  const layersToRemove = removeLayerAndChildren(state, action.payload.id);
  paper.project.getItem({id: layer.paperLayer}).remove();
  return {
    ...state,
    allIds: state.allIds.filter((id) => !layersToRemove.includes(id)),
    byId: Object.keys(state.byId).reduce((result: any, key) => {
      if (!layersToRemove.includes(key)) {
        if (layer.parent && layer.parent === key) {
          result[key] = {
            ...state.byId[key],
            children: removeItem(state.byId[key].children, action.payload.id)
          }
        } else {
          result[key] = state.byId[key];
        }
      }
      return result;
    }, {}),
    selected: state.selected.filter((layer) => !layersToRemove.includes(layer)),
    scope: state.scope.filter((layer) => !layersToRemove.includes(layer))
  }
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, state);
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  const layer = state.byId[action.payload.id] as em.Layer;
  paper.project.getItem({id: layer.paperLayer}).selected = false;
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        selected: false
      }
    },
    selected: state.selected.filter((id) => id !== layer.id)
  }
};

export const deselectAllLayers = (state: LayerState, action: DeselectAllLayers): LayerState => {
  return state.selected.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, state);
};

export const selectLayer = (state: LayerState, action: SelectLayer): LayerState => {
  const layer = state.byId[action.payload.id] as em.Layer;
  if (action.payload.newSelection) {
    const deselectAll = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers)
    paper.project.getItem({id: layer.paperLayer}).selected = true;
    return {
      ...deselectAll,
      byId: {
        ...deselectAll.byId,
        [action.payload.id]: {
          ...deselectAll.byId[action.payload.id],
          selected: true
        }
      },
      selected: [action.payload.id]
    }
  } else {
    if (state.selected.includes(action.payload.id)) {
      return state;
    } else {
      paper.project.getItem({id: layer.paperLayer}).selected = true;
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            selected: true
          }
        },
        selected: addItem(state.selected, action.payload.id)
      }
    }
  }
};

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  return {
    ...state,
    hover: action.payload.id
  }
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const childPaperLayer = paper.project.getItem({id: child.paperLayer});
  paperLayer.addChild(childPaperLayer);
  if (child.parent === action.payload.id) {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: addItem(removeItem((state.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child)
        } as em.Group
      }
    };
  } else {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [child.parent]: {
          ...state.byId[child.parent],
          children: removeItem((state.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...state.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: addItem((state.byId[action.payload.id] as em.Group).children, action.payload.child)
        } as em.Group
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return selectLayer(stateWithChild, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const childPaperLayer = paper.project.getItem({id: child.paperLayer});
  paperLayer.insertChild(action.payload.index, childPaperLayer);
  const updatedChildren = state.byId[action.payload.id].children.slice();
  updatedChildren.splice(action.payload.index, 0, action.payload.id);
  if (child.parent === action.payload.id) {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: insertItem(removeItem((state.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child, action.payload.index)
        } as em.Group
      }
    };
  } else {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [child.parent]: {
          ...state.byId[child.parent],
          children: removeItem((state.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...state.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: insertItem((state.byId[action.payload.id] as em.Group).children, action.payload.child, action.payload.index)
        } as em.Group
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return selectLayer(stateWithChild, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const showLayerChildren = (state: LayerState, action: ShowLayerChildren): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        showChildren: true
      } as em.Group
    }
  }
};

export const hideLayerChildren = (state: LayerState, action: HideLayerChildren): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        showChildren: false
      } as em.Group
    }
  }
};

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  let stateWithMovedLayer;
  const layer = state.byId[action.payload.id];
  const above = state.byId[action.payload.above];
  const aboveParent = state.byId[above.parent] as em.Group;
  const aboveIndex = aboveParent.children.indexOf(action.payload.above);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: above.paperLayer});
  paperLayer.insertAbove(abovePaperLayer);
  if (layer.parent !== above.parent) {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          parent: above.parent
        },
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [above.parent]: {
          ...state.byId[above.parent],
          children: insertItem((state.byId[above.parent] as em.Group).children, action.payload.id, aboveIndex)
        } as em.Group
      }
    };
  } else {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: insertItem(removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id), action.payload.id, aboveIndex)
        } as em.Group
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return selectLayer(stateWithMovedLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let stateWithMovedLayer;
  const layer = state.byId[action.payload.id];
  const below = state.byId[action.payload.below];
  const belowParent = state.byId[below.parent] as em.Group;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: below.paperLayer});
  paperLayer.insertBelow(abovePaperLayer);
  if (layer.parent !== below.parent) {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          parent: below.parent
        },
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [below.parent]: {
          ...state.byId[below.parent],
          children: insertItem((state.byId[below.parent] as em.Group).children, action.payload.id, belowIndex + 1)
        } as em.Group
      }
    };
  } else {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: insertItem(removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id), action.payload.id, belowIndex + 1)
        } as em.Group
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return selectLayer(stateWithMovedLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const increaseLayerScope = (state: LayerState, action: IncreaseLayerScope): LayerState => {
  if (isScopeLayer(state, action.payload.id) && isScopeGroupLayer(state, action.payload.id)) {
    return {
      ...showLayerChildren(state, layerActions.showLayerChildren({id: action.payload.id}) as ShowLayerChildren),
      scope: addItem(state.scope, action.payload.id)
    }
  } else {
    return state;
  }
};

export const decreaseLayerScope = (state: LayerState, action: DecreaseLayerScope): LayerState => {
  return {
    ...state,
    scope: state.scope.filter((id, index) => index !== state.scope.length - 1)
  }
};

export const clearLayerScope = (state: LayerState, action: ClearLayerScope): LayerState => {
  return {
    ...state,
    scope: []
  }
};

export const newLayerScope = (state: LayerState, action: NewLayerScope): LayerState => {
  return {
    ...state,
    scope: getLayerScope(state, action.payload.id)
  }
};

export const groupLayers = (state: LayerState, action: GroupLayers): LayerState => {
  const topLayer = action.payload.layers.reduce((result, current) => {
    const layerDepth = getLayerDepth(state, current);
    const layerIndex = getLayerIndex(state, current);
    if (layerDepth < result.depth) {
      return {
        id: current,
        index: layerIndex,
        depth: layerDepth
      }
    } else if (layerDepth === result.depth) {
      if (layerIndex < result.index) {
        return {
          id: current,
          index: layerIndex,
          depth: layerDepth
        }
      } else {
        return result;
      }
    } else {
      return result;
    }
  }, {
    id: action.payload.layers[0],
    index: getLayerIndex(state, action.payload.layers[0]),
    depth: getLayerDepth(state, action.payload.layers[0])
  });
  const addGroup = addLayer(state, layerActions.addGroup({selected: true}) as AddGroup);
  const groupId = addGroup.allIds[addGroup.allIds.length - 1];
  const insertGroup = insertLayerAbove(addGroup, layerActions.insertLayerAbove({id: groupId, above: topLayer.id}) as InsertLayerAbove);
  const groupedLayers = action.payload.layers.reduce((result: LayerState, current: string) => {
    result = addLayerChild(result, layerActions.addLayerChild({id: groupId, child: current}) as AddLayerChild);
    return result;
  }, insertGroup);
  return selectLayer(groupedLayers, {payload: {id: groupId, newSelection: true}} as SelectLayer);
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  const layer = getLayer(state, action.payload.id);
  if (layer.type === 'Group') {
    const ungroupedChildren = layer.children.reduce((result: LayerState, current: string) => {
      result = selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
      result = insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: layer.id}) as InsertLayerAbove);
      return result;
    }, state);
    return removeLayer(ungroupedChildren, layerActions.removeLayer({id: layer.id}) as RemoveLayer);
  } else {
    return selectLayer(state, layerActions.selectLayer({id: layer.id}) as SelectLayer);
  }
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return ungroupLayer(result, layerActions.ungroupLayer({id: current}) as UngroupLayer);
  }, state);
};

export const copyLayerToClipboard = (state: LayerState, action: CopyLayerToClipboard): LayerState => {
  if (!state.clipboard.includes(action.payload.id)) {
    return {
      ...state,
      clipboard: addItem(state.clipboard, action.payload.id)
    }
  } else {
    return state;
  }
};

export const copyLayersToClipboard = (state: LayerState, action: CopyLayersToClipboard): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return copyLayerToClipboard(result, layerActions.copyLayerToClipboard({id: current}) as CopyLayerToClipboard);
  }, {...state, clipboard: []});
};

const getLayerCloneMap = (state: LayerState, id: string) => {
  const groups: string[] = [id];
  const layerCloneMap: {[id: string]: string} = {
    [id]: uuidv4()
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        layerCloneMap[child] = uuidv4();
      });
    }
    i++;
  }
  return layerCloneMap;
}

const getPaperLayerCloneMap = (state: LayerState, id: string) => {
  const paperLayer = getPaperLayer(state, id);
  const paperLayerClone = paperLayer.clone({deep: false, insert: true});
  const groups: string[] = [id];
  const paperLayerCloneMap: {[id: number]: number} = {
    [paperLayer.id]: paperLayerClone.id
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        const childPaperLayer = getPaperLayer(state, childLayer.id);
        const childPaperLayerClone = childPaperLayer.clone({deep: false, insert: true});
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        paperLayerCloneMap[childPaperLayer.id] = childPaperLayerClone.id;
      });
    }
    i++;
  }
  return paperLayerCloneMap;
}

const cloneLayerAndChildren = (state: LayerState, id: string) => {
  const layerCloneMap = getLayerCloneMap(state, id);
  const paperLayerCloneMap = getPaperLayerCloneMap(state, id);
  const rootLayer = getLayer(state, Object.keys(layerCloneMap)[0]);
  const rootParent = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  return Object.keys(layerCloneMap).reduce((result: any, key) => {
    const layer = state.byId[key];
    const cloneId = layerCloneMap[key];
    return {
      ...result,
      allIds: [...result.allIds, cloneId],
      byId: {
        ...result.byId,
        [cloneId]: {
          ...layer,
          id: layerCloneMap[key],
          parent: key === rootLayer.id ? rootParent.id : layerCloneMap[layer.parent],
          paperLayer: paperLayerCloneMap[layer.paperLayer],
          children: layer.children ? layer.children.reduce((childResult, current) => {
            return [...childResult, layerCloneMap[current]];
          }, []) : null
        }
      }
    };
  }, {allIds: [], byId: {}});
}

export const pasteLayerFromClipboard = (state: LayerState, id: string, pasteOverSelection?: boolean): LayerState => {
  const clonedLayerAndChildren = cloneLayerAndChildren(state, id);
  const rootLayer = clonedLayerAndChildren.byId[clonedLayerAndChildren.allIds[0]];
  const rootLayerPaperLayer = getPaperLayerByPaperId(rootLayer.paperLayer);
  if (pasteOverSelection && state.selected.length > 0) {
    const selectionTopLeft = getSelectionTopLeft(state);
    const clipboardTopLeft = getClipboardTopLeft(state);
    clonedLayerAndChildren.allIds.forEach((layer: string) => {
      const paperLayer = getPaperLayerByPaperId(clonedLayerAndChildren.byId[layer].paperLayer);
      const paperLayerTopLeft = paperLayer.bounds.topLeft;
      paperLayer.bounds.topLeft = new paper.Point(selectionTopLeft.x + (clipboardTopLeft.x - paperLayerTopLeft.x), selectionTopLeft.y + (clipboardTopLeft.y - paperLayerTopLeft.y));
    });
  }
  const stateWithPastedLayer = clonedLayerAndChildren.allIds.reduce((result: LayerState, current: string, index: number) => {
    const layer = clonedLayerAndChildren.byId[current];
    const layerParent = getLayer(result, layer.parent);
    const paperLayer = getPaperLayerByPaperId(layer.paperLayer);
    paperLayer.parent = getPaperLayerByPaperId(layerParent.paperLayer);
    return {
      ...result,
      allIds: addItem(result.allIds, current),
      byId: {
        ...result.byId,
        [current]: layer,
        [layerParent.id]: {
          ...result.byId[layerParent.id],
          children: index === 0 ? addItem(result.byId[layerParent.id].children, current) : result.byId[layerParent.id].children
        }
      }
    }
  }, state);
  return selectLayer(stateWithPastedLayer, layerActions.selectLayer({id: rootLayer.id}) as SelectLayer);
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  if (state.clipboard.length > 0) {
    const selectionBeforePaste = state.selected;
    const stateWithPastedLayers = state.clipboard.reduce((result: LayerState, current: string) => {
      return pasteLayerFromClipboard(result, current, action.payload.overSelection);
    }, state);
    if (selectionBeforePaste.length > 0) {
      return selectionBeforePaste.reduce((result: LayerState, current: string) => {
        return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
      }, stateWithPastedLayers);
    }
  } else {
    return state;
  }
};