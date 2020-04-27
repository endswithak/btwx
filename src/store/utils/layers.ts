import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import { LayersState } from '../reducers/layers';
import { AddShape, AddGroup, AddPage, RemoveLayer, InsertChild, InsertAbove, InsertBelow, ExpandGroup, CollapseGroup, SelectLayer, DeselectLayer } from '../actionTypes/layers';

export const insertItem = (array: string[], item: string, index: number): string[] => {
  const newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
}

export const removeItem = (array: string[], item: string): string[] => {
  return array.filter(id => id !== item);
}

export const addItem = (array: string[], item: string): string[] => {
  return [...array, item];
}

export const addShape = (state: LayersState, action: AddShape): LayersState  => {
  const shapeId = uuidv4();
  const layerParentId = action.payload.parent ? action.payload.parent : state.activePage;
  const paperParentId = state.layerById[layerParentId].paperLayer;
  const paperParentLayer = paper.project.getItem({id: paperParentId});
  action.payload.paperShape.parent = paperParentLayer;
  return {
    ...state,
    allIds: [...state.allIds, shapeId],
    layerById: {
      ...state.layerById,
      [shapeId]: {
        type: 'Shape',
        shapeType: action.payload.shapeType,
        id: shapeId,
        name: action.payload.name ? action.payload.name : action.payload.shapeType,
        parent: layerParentId,
        paperParent: state.layerById[layerParentId].paperLayer,
        paperLayer: action.payload.paperShape.id,
        selected: false,
        children: null
      },
      [layerParentId]: {
        ...state.layerById[layerParentId],
        children: [...(state.layerById[layerParentId] as em.Group).children, shapeId]
      } as em.Group
    }
  };
}

export const addGroup = (state: LayersState, action: AddGroup): LayersState  => {
  const groupId = uuidv4();
  const layerParentId = action.payload.parent ? action.payload.parent : state.activePage;
  const paperParentId = state.layerById[layerParentId].paperLayer;
  const paperParentLayer = paper.project.getItem({id: paperParentId});
  const paperGroup = new paper.Group({
    parent: paperParentLayer
  });
  return {
    ...state,
    allIds: [...state.allIds, groupId],
    layerById: {
      ...state.layerById,
      [groupId]: {
        type: 'Group',
        id: groupId,
        name: action.payload.name ? action.payload.name : 'Group',
        parent: layerParentId,
        paperParent: state.layerById[layerParentId].paperLayer,
        paperLayer: paperGroup.id,
        children: [],
        selected: false,
        expanded: false
      },
      [layerParentId]: {
        ...state.layerById[layerParentId],
        children: [...(state.layerById[layerParentId] as em.Group).children, groupId]
      } as em.Group
    },
    activeGroup: groupId
  };
}

export const addPage = (state: LayersState, action: AddPage): LayersState  => {
  const pageId = uuidv4();
  const paperPage = new paper.Group();
  return {
    ...state,
    allIds: [...state.allIds, pageId],
    layerById: {
      ...state.layerById,
      [pageId]: {
        type: 'Page',
        id: pageId,
        name: action.payload.name ? action.payload.name : 'Page',
        parent: null,
        paperParent: null,
        paperLayer: paperPage.id,
        children: [],
        selected: false
      }
    },
    activePage: pageId
  };
}

export const removeLayer = (state: LayersState, action: RemoveLayer): LayersState  => {
  const layer = state.layerById[action.payload.id];
  paper.project.getItem({id: layer.paperLayer}).remove();
  let updatedIds;
  if (layer.children) {
    updatedIds = state.allIds.filter((child) => !layer.children.includes(child));
  } else {
    updatedIds = removeItem(state.allIds, action.payload.id);
  }
  return {
    ...state,
    allIds: updatedIds,
    layerById: {
      ...Object.keys(state.layerById).reduce((result: any, key) => {
        if (key !== action.payload.id) {
          result[key] = state.layerById[key];
        }
        return result;
      }, {}),
      [layer.parent]: {
        ...state.layerById[layer.parent],
        children: removeItem(state.layerById[layer.parent].children, action.payload.id)
      }
    }
  };
}

export const insertChild = (state: LayersState, action: InsertChild): LayersState  => {
  const layer = state.layerById[action.payload.layer];
  const parent = state.layerById[action.payload.parent];
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const parentPaperLayer = paper.project.getItem({id: parent.paperLayer});
  paperLayer.parent = parentPaperLayer;
  if (layer.parent === action.payload.parent) {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [action.payload.parent]: {
          ...state.layerById[action.payload.parent],
          children: [...removeItem((state.layerById[action.payload.parent] as em.Group).children, action.payload.layer), action.payload.layer]
        } as em.Group
      }
    };
  } else {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [layer.parent]: {
          ...state.layerById[layer.parent],
          children: removeItem((state.layerById[layer.parent] as em.Group).children, action.payload.layer)
        } as em.Group,
        [action.payload.layer]: {
          ...state.layerById[action.payload.layer],
          parent: action.payload.parent
        },
        [action.payload.parent]: {
          ...state.layerById[action.payload.parent],
          children: [...(state.layerById[action.payload.parent] as em.Group).children, action.payload.layer]
        } as em.Group
      }
    };
  }
}

export const insertAbove = (state: LayersState, action: InsertAbove): LayersState  => {
  const layer = state.layerById[action.payload.layer];
  const above = state.layerById[action.payload.above];
  const aboveParent = state.layerById[above.parent] as em.Group;
  const aboveIndex = aboveParent.children.indexOf(action.payload.above);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: above.paperLayer});
  paperLayer.insertAbove(abovePaperLayer);
  if (layer.parent !== above.parent) {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [action.payload.layer]: {
          ...state.layerById[action.payload.layer],
          parent: above.parent
        },
        [layer.parent]: {
          ...state.layerById[layer.parent],
          children: removeItem((state.layerById[layer.parent] as em.Group).children, action.payload.layer)
        } as em.Group,
        [above.parent]: {
          ...state.layerById[above.parent],
          children: insertItem((state.layerById[above.parent] as em.Group).children, action.payload.layer, aboveIndex)
        } as em.Group
      }
    };
  } else {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [layer.parent]: {
          ...state.layerById[layer.parent],
          children: insertItem(removeItem((state.layerById[layer.parent] as em.Group).children, action.payload.layer), action.payload.layer, aboveIndex)
        } as em.Group
      }
    };
  }
}

export const insertBelow = (state: LayersState, action: InsertBelow): LayersState  => {
  const layer = state.layerById[action.payload.layer];
  const below = state.layerById[action.payload.below];
  const belowParent = state.layerById[below.parent] as em.Group;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const paperLayer = paper.project.getItem({id: layer.paperLayer});
  const abovePaperLayer = paper.project.getItem({id: below.paperLayer});
  paperLayer.insertBelow(abovePaperLayer);
  if (layer.parent !== below.parent) {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [action.payload.layer]: {
          ...state.layerById[action.payload.layer],
          parent: below.parent
        },
        [layer.parent]: {
          ...state.layerById[layer.parent],
          children: removeItem((state.layerById[layer.parent] as em.Group).children, action.payload.layer)
        } as em.Group,
        [below.parent]: {
          ...state.layerById[below.parent],
          children: insertItem((state.layerById[below.parent] as em.Group).children, action.payload.layer, belowIndex + 1)
        } as em.Group
      }
    };
  } else {
    return {
      ...state,
      layerById: {
        ...state.layerById,
        [layer.parent]: {
          ...state.layerById[layer.parent],
          children: insertItem(removeItem((state.layerById[layer.parent] as em.Group).children, action.payload.layer), action.payload.layer, belowIndex + 1)
        } as em.Group
      }
    };
  }
}

export const expandGroup = (state: LayersState, action: ExpandGroup): LayersState  => {
  return {
    ...state,
    layerById: {
      ...state.layerById,
      [action.payload.id]: {
        ...state.layerById[action.payload.id],
        expanded: true
      } as em.Group
    }
  };
}

export const collapseGroup = (state: LayersState, action: CollapseGroup): LayersState  => {
  return {
    ...state,
    layerById: {
      ...state.layerById,
      [action.payload.id]: {
        ...state.layerById[action.payload.id],
        expanded: false
      } as em.Group
    }
  };
}

export const selectLayer = (state: LayersState, action: SelectLayer): LayersState  => {
  const layer = state.layerById[action.payload.id] as em.Layer;
  paper.project.getItem({id: layer.paperLayer}).selected = true;
  return {
    ...state,
    layerById: {
      ...state.layerById,
      [action.payload.id]: {
        ...state.layerById[action.payload.id],
        selected: true
      }
    }
  };
}

export const deselectLayer = (state: LayersState, action: DeselectLayer): LayersState  => {
  const layer = state.layerById[action.payload.id] as em.Layer;
  paper.project.getItem({id: layer.paperLayer}).selected = false;
  return {
    ...state,
    layerById: {
      ...state.layerById,
      [action.payload.id]: {
        ...state.layerById[action.payload.id],
        selected: false
      }
    }
  };
}

