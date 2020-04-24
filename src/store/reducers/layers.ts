import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import {
  ADD_SHAPE,
  ADD_GROUP,
  ADD_PAGE,
  REMOVE_LAYER,
  INSERT_CHILD,
  INSERT_ABOVE,
  INSERT_BELOW,
  EXPAND_GROUP,
  COLLAPSE_GROUP,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  CLEAR_SELECTION,
  NEW_SELECTION,
  GROUP_SELECTION,
  UNGROUP_SELECTION,
  LayersTypes
} from '../actionTypes/layers';
import { removeItem, insertItem } from '../utils/layers';
import { getLayerIndex, getParentLayer, getTopParentGroup } from '../selectors/layers';

export interface LayersState {
  activePage: string;
  activeGroup: string;
  layerById: {
    [id: string]: em.Shape | em.Group | em.Page;
  };
  allIds: string[];
  selection: string[];
}

const initialState: LayersState = {
  activePage: null,
  activeGroup: null,
  layerById: {},
  allIds: [],
  selection: []
};

export default (state = initialState, action: LayersTypes): LayersState => {
  switch (action.type) {
    case ADD_SHAPE: {
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
    case ADD_GROUP: {
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
    case ADD_PAGE: {
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
    case REMOVE_LAYER: {
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
    case INSERT_CHILD: {
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
    case INSERT_ABOVE: {
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
    case INSERT_BELOW: {
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
    case EXPAND_GROUP: {
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
    case COLLAPSE_GROUP: {
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
    case ADD_TO_SELECTION: {
      const layer = state.layerById[action.payload.id] as em.Layer;
      layer.selected = true;
      paper.project.getItem({id: layer.paperLayer}).selected = true;
      return {
        ...state,
        selection: [...state.selection, action.payload.id]
      };
    }
    case REMOVE_FROM_SELECTION: {
      const layer = state.layerById[action.payload.id] as em.Layer;
      layer.selected = false;
      paper.project.getItem({id: layer.paperLayer}).selected = false;
      return {
        ...state,
        selection: state.selection.filter(id => id !== action.payload.id)
      };
    }
    case CLEAR_SELECTION: {
      state.selection.forEach((id) => {
        const layer = state.layerById[id] as em.Layer;
        layer.selected = false;
        paper.project.getItem({id: layer.paperLayer}).selected = false;
      });
      return {
        ...state,
        selection: []
      };
    }
    case NEW_SELECTION: {
      state.selection.forEach((id) => {
        const layer = state.layerById[id] as em.Layer;
        layer.selected = false;
        paper.project.getItem({id: layer.paperLayer}).selected = false;
      });
      const layer = state.layerById[action.payload.id] as em.Layer;
      layer.selected = true;
      paper.project.getItem({id: layer.paperLayer}).selected = true;
      return {
        ...state,
        selection: [action.payload.id]
      };
    }
    case GROUP_SELECTION: {
      const topSelection = [...state.selection].reduce((total, current) => {
        const topGroup = getTopParentGroup(state, current);
        return getLayerIndex(state, topGroup.id) <= getLayerIndex(state, total) ? current : total;
      }, state.selection[0]);
      const groupId = uuidv4();
      const layerParentId = state.layerById[topSelection].parent;
      const paperParentId = state.layerById[layerParentId].paperLayer;
      const paperParentLayer = paper.project.getItem({id: paperParentId});
      const paperGroup = new paper.Group({
        parent: paperParentLayer,
        selected: true
      });
      state.selection.forEach((id) => {
        const layer = state.layerById[id] as em.Layer;
        const paperLayer = paper.project.getItem({id: layer.paperLayer});
        paperLayer.selected = false;
        paperGroup.addChild(paperLayer);
      });
      return {
        ...state,
        allIds: [...state.allIds, groupId],
        layerById: {
          ...state.layerById,
          ...Object.keys(state.layerById).reduce((result: any, key) => {
            if (state.selection.includes(key)) {
              result[key] = {
                ...state.layerById[key],
                parent: groupId,
                selected: false
              };
            }
            return result;
          }, {}),
          [layerParentId]: {
            ...state.layerById[layerParentId],
            children: insertItem((state.layerById[layerParentId] as em.Group).children, groupId, getLayerIndex(state, topSelection)).filter((id) => {
              return !state.selection.includes(id);
            })
          },
          [groupId]: {
            type: 'Group',
            id: groupId,
            name: 'Group',
            parent: layerParentId,
            paperParent: paperParentId,
            paperLayer: paperGroup.id,
            children: [...state.selection],
            selected: true,
            expanded: false
          }
        },
        selection: [groupId]
      };
    }
    // case UNGROUP_SELECTION: {
    //   //let newSelection = [];
    //   state.selection.forEach((id) => {
    //     const layer = state.layerById[id] as em.Layer;
    //     //const parent = state.layerById[layer.parent];
    //     const paperLayer = paper.project.getItem({id: layer.paperLayer});
    //     //const paperLayerParent = paper.project.getItem({id: parent.paperLayer});
    //     if (layer.type === 'Group') {
    //       layer.children.forEach((child) => {
    //         const childLayer = state.layerById[child] as em.Layer;
    //         const paperChildLayer = paper.project.getItem({id: childLayer.paperLayer});
    //         paperChildLayer.insertAbove(paperLayer);
    //         //newSelection.push(childLayer.id);
    //       });
    //     }
    //   });
    //   return {
    //     ...state,
    //     allIds: [...state.allIds].filter((id) => {
    //       if (state.selection.includes(id) && state.layerById[id].type === 'Group') {
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     }),
    //     layerById: {
    //       ...state.layerById,
    //       ...state.selection.reduce((result, selection) => {
    //         if (state.layerById[selection].type === 'Group') {

    //         }
    //         return result;
    //       }, {}),
    //       ...Object.keys(state.layerById).reduce((result: any, key) => {
    //         if (state.selection.includes(key)) {
    //           result[key] = {
    //             ...state.layerById[key],
    //             parent: groupId,
    //             selected: false
    //           };
    //         }
    //         return result;
    //       }, {})
    //     }
    //   };
    // }
    default:
      return state;
  }
}
