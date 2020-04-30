import paper from 'paper';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { AddPage, AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer, AddLayerChild, InsertLayerChild, EnableLayerHover, DisableLayerHover, InsertLayerAbove, InsertLayerBelow, ExpandLayer, CollapseLayer, GroupLayers, UngroupLayers, UngroupLayer, DeselectAllLayers, RemoveLayers, SetGroupScope } from '../actionTypes/layer';
import { addItem, removeItem, insertItem } from './general';
import { getLayerIndex, getLayer, getLayerDepth } from '../selectors/layer';

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
        ...action.payload,
        paperLayer: action.payload.paperLayer.id
      } as em.Page
    },
    activePage: action.payload.id,
    groupScope: action.payload.id
  }
};

export const addLayer = (state: LayerState, action: AddGroup | AddShape): LayerState => {
  const layerParent = action.payload.parent ? action.payload.parent : state.activePage;
  action.payload.paperLayer.parent = paper.project.getItem({id: state.byId[layerParent].paperLayer});
  return {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...action.payload,
        paperLayer: action.payload.paperLayer.id,
        parent: layerParent
      } as em.Page | em.Group | em.Shape,
      [layerParent]: {
        ...state.byId[layerParent],
        children: addItem((state.byId[layerParent] as em.Group).children, action.payload.id)
      } as em.Group
    }
  }
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
    selected: state.selected.filter((layer) => !layersToRemove.includes(layer))
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

export const enableLayerHover = (state: LayerState, action: EnableLayerHover): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        hover: true
      }
    }
  }
};

export const disableLayerHover = (state: LayerState, action: DisableLayerHover): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        hover: false
      }
    }
  }
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const childPaperLayer = paper.project.getItem({id: child.paperLayer});
  paperLayer.addChild(childPaperLayer);
  if (child.parent === action.payload.id) {
    return {
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
    return {
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
};

export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const childPaperLayer = paper.project.getItem({id: child.paperLayer});
  paperLayer.insertChild(action.payload.index, childPaperLayer);
  const updatedChildren = state.byId[action.payload.id].children.slice();
  updatedChildren.splice(action.payload.index, 0, action.payload.id);
  if (child.parent === action.payload.id) {
    return {
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
    return {
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
};

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  const layer = state.byId[action.payload.id];
  const above = state.byId[action.payload.above];
  const aboveParent = state.byId[above.parent] as em.Group;
  const aboveIndex = aboveParent.children.indexOf(action.payload.above);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: above.paperLayer});
  paperLayer.insertAbove(abovePaperLayer);
  if (layer.parent !== above.parent) {
    return {
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
    return {
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
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  const layer = state.byId[action.payload.id];
  const below = state.byId[action.payload.below];
  const belowParent = state.byId[below.parent] as em.Group;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: below.paperLayer});
  paperLayer.insertBelow(abovePaperLayer);
  if (layer.parent !== below.parent) {
    return {
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
    return {
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
};

export const expandLayer = (state: LayerState, action: ExpandLayer): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        expanded: true
      } as em.Group
    }
  }
};

export const collapseLayer = (state: LayerState, action: CollapseLayer): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        expanded: false
      } as em.Group
    }
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

export const setGroupScope = (state: LayerState, action: SetGroupScope): LayerState => {
  const layer = getLayer(state, action.payload.id);
  const groupScopeLayer = getLayer(state, state.groupScope);
  if (groupScopeLayer.children.includes(action.payload.id) && layer.type === 'Group') {
    return {
      ...state,
      groupScope: layer.type === 'Group' ? action.payload.id : state.groupScope
    }
  } else {
    return state;
  }
};