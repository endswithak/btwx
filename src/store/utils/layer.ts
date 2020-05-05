/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { AddPage, AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer, AddLayerChild, InsertLayerChild, EnableLayerHover, DisableLayerHover, InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer, DeselectAllLayers, RemoveLayers, SetGroupScope, HideLayerChildren, ShowLayerChildren, DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope, CopyLayerToClipboard, CopyLayersToClipboard, PasteLayersFromClipboard, SelectLayers, DeselectLayers, MoveLayerTo, MoveLayerBy, EnableLayerDrag, DisableLayerDrag, MoveLayersTo, MoveLayersBy, DeepSelectLayer, EscapeLayerScope, MoveLayer, MoveLayers, AddArtboard, SetLayerName } from '../actionTypes/layer';
import { addItem, removeItem, insertItem, addItems } from './general';
import { getLayerIndex, getLayer, getLayerDepth, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getNearestScopeGroupAncestor, getParentLayer, getLayerScope, getPaperLayer, getSelectionTopLeft, getPaperLayerByPaperId, getClipboardTopLeft, getSelectionBottomRight, getPagePaperLayer, getClipboardBottomRight } from '../selectors/layer';

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
    page: action.payload.id,
    paperProject: paper.project.exportJSON()
  }
};

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(state.page);
  return {
    ...state,
    allIds: addItems(state.allIds, [action.payload.id, action.payload.background]),
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: state.page
      } as em.Artboard,
      [action.payload.background]: {
        type: 'ArtboardBackground',
        id: action.payload.background,
        name: 'ArtboardBackground',
        parent: action.payload.id,
        children: null
      } as em.ArtboardBackground,
      [state.page]: {
        ...state.byId[state.page],
        children: addItem(state.byId[state.page].children, action.payload.id)
      } as em.Page
    },
    paperProject: paper.project.exportJSON()
  }
};

export const addLayer = (state: LayerState, action: AddGroup | AddShape): LayerState => {
  const layerParent = action.payload.parent ? action.payload.parent : state.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  // add layer
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
    },
    paperProject: paper.project.exportJSON()
  }
  // select layer
  return selectLayer(stateWithLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  const layer = state.byId[action.payload.id];
  const layersToRemove = removeLayerAndChildren(state, action.payload.id);
  // check selected
  if (state.selected.includes(action.payload.id)) {
    currentState = layersToRemove.reduce((result, current) => {
      if (result.selected.includes(current)) {
        return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
      } else {
        return result;
      }
    }, currentState);
  }
  // check hover
  if (state.hover === action.payload.id) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({id: null}) as SetLayerHover);
  }
  // remove paper layer
  getPaperLayer(action.payload.id).remove();
  // remove layer
  return {
    ...currentState,
    allIds: currentState.allIds.filter((id) => !layersToRemove.includes(id)),
    byId: Object.keys(currentState.byId).reduce((result: any, key) => {
      if (!layersToRemove.includes(key)) {
        if (layer.parent && layer.parent === key) {
          result[key] = {
            ...currentState.byId[key],
            children: removeItem(currentState.byId[key].children, action.payload.id)
          }
        } else {
          result[key] = currentState.byId[key];
        }
      }
      return result;
    }, {}),
    paperProject: paper.project.exportJSON(),
    scope: currentState.scope.filter((id) => !layersToRemove.includes(id))
  }
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, state);
}

export const updateSelectionFrame = (state: LayerState) => {
  const selectionFrame = paper.project.getItem({ data: { id: 'selectionFrame' } });
  if (selectionFrame) {
    selectionFrame.remove();
  }
  if (state.selected.length > 0) {
    const selectionTopLeft = getSelectionTopLeft(state);
    const selectionBottomRight = getSelectionBottomRight(state);
    new paper.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      selected: true,
      data: {
        id: 'selectionFrame'
      }
    });
  }
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  const layer = state.byId[action.payload.id] as em.Layer;
  const newState = {
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
  updateSelectionFrame(newState);
  return newState;
};

export const deselectLayers = (state: LayerState, action: DeselectLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, state);
};

export const deselectAllLayers = (state: LayerState, action: DeselectAllLayers): LayerState => {
  const deselectedLayersState = state.selected.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, state);
  return clearLayerScope(deselectedLayersState, layerActions.clearLayerScope() as ClearLayerScope);
};

export const selectLayer = (state: LayerState, action: SelectLayer): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    const deselectAll = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers)
    currentState = {
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
    currentState = newLayerScope(currentState, layerActions.newLayerScope({id: action.payload.id}) as NewLayerScope);
  } else {
    if (!state.selected.includes(action.payload.id)) {
      currentState = {
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
  updateSelectionFrame(currentState);
  return currentState;
};

export const deepSelectLayer = (state: LayerState, action: DeepSelectLayer): LayerState => {
  let currentState = state;
  const nearestScopeAncestor = getNearestScopeAncestor(currentState, action.payload.id);
  if (isScopeGroupLayer(currentState, nearestScopeAncestor.id)) {
    currentState = increaseLayerScope(currentState, layerActions.increaseLayerScope({id: nearestScopeAncestor.id}) as IncreaseLayerScope);
    const nearestScopeAncestorDeep = getNearestScopeAncestor(currentState, action.payload.id);
    if (currentState.hover === nearestScopeAncestor.id) {
      currentState = setLayerHover(currentState, layerActions.setLayerHover({id: nearestScopeAncestorDeep.id}) as SetLayerHover);
    }
    return selectLayer(currentState, layerActions.selectLayer({id: nearestScopeAncestorDeep.id, newSelection: true}) as SelectLayer);
  } else {
    return state;
  }
};

export const selectLayers = (state: LayerState, action: SelectLayers): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return action.payload.layers.reduce((result, current) => {
    return selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
  }, currentState);
};

export const updateHoverFrame = (state: LayerState) => {
  const hoverFrame = paper.project.getItem({ data: { id: 'hoverFrame' } });
  const hoverFrameConstants = {
    strokeColor: '#009DEC',
    strokeWidth: 1,
    data: {
      id: 'hoverFrame'
    }
  }
  if (hoverFrame) {
    hoverFrame.remove();
  }
  if (state.hover && !state.selected.includes(state.hover)) {
    const paperHoverLayer = getPaperLayer(state.hover);
    if (paperHoverLayer.className === ('Path' || 'CompoundPath')) {
      new paper.Path({
        ...hoverFrameConstants,
        closed: (paperHoverLayer as paper.Path).closed,
        segments: [...(paperHoverLayer as paper.Path).segments]
      });
    } else {
      new paper.Path.Rectangle({
        ...hoverFrameConstants,
        point: paperHoverLayer.bounds.topLeft,
        size: [paperHoverLayer.bounds.width, paperHoverLayer.bounds.height]
      });
    }
  }
}

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  const stateWithNewHover = {
    ...state,
    hover: action.payload.id
  };
  updateHoverFrame(stateWithNewHover);
  return stateWithNewHover;
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
  paperLayer.addChild(childPaperLayer);
  if (child.parent === action.payload.id) {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          showChildren: true,
          children: addItem(removeItem((state.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child)
        } as em.Group
      },
      paperProject: paper.project.exportJSON()
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
          showChildren: true,
          children: addItem((state.byId[action.payload.id] as em.Group).children, action.payload.child)
        } as em.Group
      },
      paperProject: paper.project.exportJSON()
    };
  }
  return selectLayer(stateWithChild, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
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
      },
      paperProject: paper.project.exportJSON()
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
      },
      paperProject: paper.project.exportJSON()
    };
  }
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
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.above);
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
      },
      paperProject: paper.project.exportJSON()
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
      },
      paperProject: paper.project.exportJSON()
    };
  }
  return selectLayer(stateWithMovedLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let stateWithMovedLayer;
  const layer = state.byId[action.payload.id];
  const below = state.byId[action.payload.below];
  const belowParent = state.byId[below.parent] as em.Group;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.below);
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
      },
      paperProject: paper.project.exportJSON()
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
      },
      paperProject: paper.project.exportJSON()
    };
  }
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

export const escapeLayerScope = (state: LayerState, action: EscapeLayerScope): LayerState => {
  const nextScope = state.scope.filter((id, index) => index !== state.scope.length - 1);
  let currentState = state;
  if (state.scope.length > 0) {
    currentState = selectLayer(state, layerActions.selectLayer({id: state.scope[state.scope.length - 1], newSelection: true}) as SelectLayer);
  } else {
    currentState = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return {
    ...currentState,
    scope: nextScope
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
      return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: layer.id}) as InsertLayerAbove);
    }, state);
    const selectedChildren = selectLayers(ungroupedChildren, layerActions.selectLayers({layers: layer.children, newSelection: true}) as SelectLayers);
    return removeLayer(selectedChildren, layerActions.removeLayer({id: layer.id}) as RemoveLayer);
  } else {
    return selectLayer(state, layerActions.selectLayer({id: layer.id, newSelection: true}) as SelectLayer);
  }
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  const newSelection: string[] = [];
  const ungroupedLayersState = action.payload.layers.reduce((result, current) => {
    const ungroupLayerState = ungroupLayer(result, layerActions.ungroupLayer({id: current}) as UngroupLayer);
    newSelection.push(...ungroupLayerState.selected);
    return ungroupLayerState;
  }, state);
  return selectLayers(ungroupedLayersState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
};

const getClipboardLayerDescendants = (state: LayerState, id: string) => {
  const layer = state.byId[id];
  const paperLayer = getPaperLayer(id);
  const groups: string[] = [id];
  const clipboardLayerDescendants: {allIds: string[]; byId: {[id: string]: em.ClipboardLayer}} = {
    allIds: [id],
    byId: {
      [id]: {
        ...layer,
        paperLayer: paperLayer
      }
    }
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        const childPaperLayer = getPaperLayer(child);
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        clipboardLayerDescendants.allIds.push(child);
        clipboardLayerDescendants.byId[child] = {
          ...childLayer,
          paperLayer: childPaperLayer
        }
      });
    }
    i++;
  }
  return clipboardLayerDescendants;
}

export const copyLayerToClipboard = (state: LayerState, action: CopyLayerToClipboard): LayerState => {
  if (!state.clipboard.allIds.includes(action.payload.id)) {
    const clipboardLayerAncestors = getClipboardLayerDescendants(state, action.payload.id);
    return {
      ...state,
      clipboard: {
        main: addItem(state.clipboard.main, action.payload.id),
        allIds: [...state.clipboard.allIds, ...clipboardLayerAncestors.allIds],
        byId: { ...state.clipboard.byId, ...clipboardLayerAncestors.byId }
      }
    }
  } else {
    return state;
  }
};

export const copyLayersToClipboard = (state: LayerState, action: CopyLayersToClipboard): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return copyLayerToClipboard(result, layerActions.copyLayerToClipboard({id: current}) as CopyLayerToClipboard);
  }, {...state, clipboard: {main: [], allIds: [], byId: {}}});
};

const getLayerCloneMap = (state: LayerState, id: string) => {
  const groups: string[] = [id];
  const layerCloneMap: {[id: string]: string} = {
    [id]: uuidv4()
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.clipboard.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.clipboard.byId[child];
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

const clonePaperLayers = (state: LayerState, id: string, layerCloneMap: any) => {
  const paperLayer = state.clipboard.byId[id].paperLayer;
  const parentLayer = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  const paperParentLayer = getPaperLayer(parentLayer.id);
  const paperLayerClone = paperLayer.clone({deep: false, insert: true});
  paperLayerClone.data.id = layerCloneMap[id];
  paperLayerClone.parent = paperParentLayer;
  paperLayerClone.onClick = paperLayer.onClick;
  paperLayerClone.onDoubleClick = paperLayer.onDoubleClick;
  paperLayerClone.onMouseEnter = paperLayer.onMouseEnter;
  paperLayerClone.onMouseLeave = paperLayer.onMouseLeave;
  paperLayerClone.onMouseDrag = paperLayer.onMouseDrag;
  paperLayerClone.onMouseDown = paperLayer.onMouseDown;
  paperLayerClone.onMouseUp = paperLayer.onMouseUp;
  const groups: string[] = [id];
  let i = 0;
  while(i < groups.length) {
    const layer = state.clipboard.byId[groups[i]];
    const groupClonePaperLayer = getPaperLayer(layerCloneMap[layer.id]);
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.clipboard.byId[child];
        const childPaperLayer = childLayer.paperLayer;
        const childPaperLayerClone = childPaperLayer.clone({deep: false, insert: true});
        childPaperLayerClone.data.id = layerCloneMap[child];
        childPaperLayerClone.parent = groupClonePaperLayer;
        childPaperLayerClone.onClick = childPaperLayer.onClick;
        childPaperLayerClone.onDoubleClick = childPaperLayer.onDoubleClick;
        childPaperLayerClone.onMouseEnter = childPaperLayer.onMouseEnter;
        childPaperLayerClone.onMouseLeave = childPaperLayer.onMouseLeave;
        childPaperLayerClone.onMouseDrag = childPaperLayer.onMouseDrag;
        childPaperLayerClone.onMouseDown = childPaperLayer.onMouseDown;
        childPaperLayerClone.onMouseUp = childPaperLayer.onMouseUp;
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
      });
    }
    i++;
  }
}

const cloneLayerAndChildren = (state: LayerState, id: string) => {
  const layerCloneMap = getLayerCloneMap(state, id);
  clonePaperLayers(state, id, layerCloneMap);
  const rootLayer = state.clipboard.byId[id];
  const rootParent = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  return Object.keys(layerCloneMap).reduce((result: any, key: string, index: number) => {
    const layer = state.clipboard.byId[key];
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
          //paperLayer: paperLayerCloneMap[layer.paperLayer.id],
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
      const paperLayer = getPaperLayer(layer);
      const paperLayerTopLeft = paperLayer.bounds.topLeft;
      if (paperLayer.className !== 'Group') {
        paperLayer.bounds.topLeft = new paper.Point(selectionTopLeft.x + (paperLayerTopLeft.x - clipboardTopLeft.x), selectionTopLeft.y + (paperLayerTopLeft.y - clipboardTopLeft.y));
      }
    });
  }
  const stateWithPastedLayer = clonedLayerAndChildren.allIds.reduce((result: LayerState, current: string, index: number) => {
    const layer = clonedLayerAndChildren.byId[current];
    const layerParent = getLayer(result, layer.parent);
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
      },
      paperProject: paper.project.exportJSON()
    }
  }, state);
  return selectLayer(stateWithPastedLayer, layerActions.selectLayer({id: rootLayer.id}) as SelectLayer);
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  if (state.clipboard.allIds.length > 0) {
    const selectionBeforePaste = state.selected;
    const stateWithPastedLayers = state.clipboard.main.reduce((result: LayerState, current: string) => {
      return pasteLayerFromClipboard(result, current, action.payload.overSelection);
    }, state);
    if (selectionBeforePaste.length > 0) {
      return deselectLayers(stateWithPastedLayers, layerActions.deselectLayers({layers: selectionBeforePaste}) as DeselectLayers);
    } else {
      return stateWithPastedLayers;
    }
  } else {
    return state;
  }
};

export const updateParentBounds = (state: LayerState, id: string): LayerState => {
  const layerScope = getLayerScope(state, id);
  return layerScope.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      }
    }
  }, state);
};

export const moveLayer = (state: LayerState, action: MoveLayer): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y
        }
      }
    },
    paperProject: paper.project.exportJSON()
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayer(result, layerActions.moveLayer({id: current}) as MoveLayer);
  }, state);
};

export const moveLayerTo = (state: LayerState, action: MoveLayerTo): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.position.x = action.payload.x;
  paperLayer.position.y = action.payload.y;
  updateSelectionFrame(currentState);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y
        }
      }
    },
    paperProject: paper.project.exportJSON()
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const moveLayersTo = (state: LayerState, action: MoveLayersTo): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerTo);
  }, state);
};

export const moveLayerBy = (state: LayerState, action: MoveLayerBy): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  // paperLayer.position.x += action.payload.x;
  // paperLayer.position.y += action.payload.y;
  updateSelectionFrame(currentState);
  currentState = {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        frame: {
          ...state.byId[action.payload.id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y
        }
      }
    },
    paperProject: paper.project.exportJSON()
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const moveLayersBy = (state: LayerState, action: MoveLayersBy): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayerBy(result, layerActions.moveLayerBy({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerBy);
  }, state);
};

export const enableLayerDrag = (state: LayerState, action: EnableLayerDrag): LayerState => {
  const hoverFrame = paper.project.getItem({ data: { id: 'hoverFrame' } });
  if (hoverFrame) {
    hoverFrame.remove();
  }
  return {
    ...state,
    dragging: true
  }
};

export const disableLayerDrag = (state: LayerState, action: DisableLayerDrag): LayerState => {
  updateSelectionFrame(state);
  updateHoverFrame(state);
  return {
    ...state,
    dragging: false
  }
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        name: action.payload.name
      }
    }
  }
};