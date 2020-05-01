import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';

import {
  ADD_PAGE,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  SELECT_LAYER,
  DESELECT_LAYER,
  DESELECT_ALL_LAYERS,
  SET_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  SHOW_LAYER_CHILDREN,
  HIDE_LAYER_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  AddPagePayload,
  AddGroupPayload,
  AddShapePayload,
  RemoveLayerPayload,
  RemoveLayersPayload,
  SelectLayerPayload,
  DeselectLayerPayload,
  SetLayerHoverPayload,
  AddLayerChildPayload,
  InsertLayerChildPayload,
  ShowLayerChildrenPayload,
  HideLayerChildrenPayload,
  InsertLayerAbovePayload,
  InsertLayerBelowPayload,
  IncreaseLayerScopePayload,
  NewLayerScopePayload,
  GroupLayersPayload,
  UngroupLayerPayload,
  UngroupLayersPayload,
  LayerTypes
} from '../actionTypes/layer';

// Page

export const addPage = (payload: AddPagePayload): LayerTypes => ({
  type: ADD_PAGE,
  payload: {
    type: 'Page',
    id: uuidv4(),
    name: payload.name ? payload.name : 'Page',
    parent: null,
    paperLayer: new paper.Group(),
    children: [],
    selected: false,
    active: false,
    selectedLayers: []
  }
});

// Group

export const addGroup = (payload: AddGroupPayload): LayerTypes => {
  const id = uuidv4();
  return {
    type: ADD_GROUP,
    payload: {
      type: 'Group',
      id: id,
      name: payload.name ? payload.name : 'Group',
      parent: payload.parent ? payload.parent : null,
      paperLayer: new paper.Group({
        // onMouseEnter: (e: paper.MouseEvent) => {
        //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
        //   paper.tools[0].emit('mouseenter', e);
        // },
        // onMouseLeave: (e: paper.MouseEvent) => {
        //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
        //   paper.tools[0].emit('mouseleave', e);
        // }
      }),
      children: [],
      selected: false,
      showChildren: false
    }
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => {
  const id = uuidv4();
  return {
    type: ADD_SHAPE,
    payload: {
      type: 'Shape',
      id: id,
      name: payload.name ? payload.name : payload.shapeType,
      parent: payload.parent ? payload.parent : null,
      shapeType: payload.shapeType,
      paperLayer: payload.paperLayer,
      selected: false,
    }
  }
};

// Remove

export const removeLayer = (payload: RemoveLayerPayload): LayerTypes => ({
  type: REMOVE_LAYER,
  payload
});

export const removeLayers = (payload: RemoveLayersPayload): LayerTypes => ({
  type: REMOVE_LAYERS,
  payload
});

// Select

export const selectLayer = (payload: SelectLayerPayload): LayerTypes => ({
  type: SELECT_LAYER,
  payload
});

export const deselectLayer = (payload: DeselectLayerPayload): LayerTypes => ({
  type: DESELECT_LAYER,
  payload
});

export const deselectAllLayers = (): LayerTypes => ({
  type: DESELECT_ALL_LAYERS
});

// Hover

export const setLayerHover = (payload: SetLayerHoverPayload): LayerTypes => ({
  type: SET_LAYER_HOVER,
  payload
});

// Children

export const addLayerChild = (payload: AddLayerChildPayload): LayerTypes => ({
  type: ADD_LAYER_CHILD,
  payload
});

export const insertLayerChild = (payload: InsertLayerChildPayload): LayerTypes => ({
  type: INSERT_LAYER_CHILD,
  payload
});

export const showLayerChildren = (payload: ShowLayerChildrenPayload): LayerTypes => ({
  type: SHOW_LAYER_CHILDREN,
  payload
});

export const hideLayerChildren = (payload: HideLayerChildrenPayload): LayerTypes => ({
  type: HIDE_LAYER_CHILDREN,
  payload
});

// Insert

export const insertLayerAbove = (payload: InsertLayerAbovePayload): LayerTypes => ({
  type: INSERT_LAYER_ABOVE,
  payload
});

export const insertLayerBelow = (payload: InsertLayerBelowPayload): LayerTypes => ({
  type: INSERT_LAYER_BELOW,
  payload
});

// Scope

export const increaseLayerScope = (payload: IncreaseLayerScopePayload): LayerTypes => ({
  type: INCREASE_LAYER_SCOPE,
  payload
});

export const decreaseLayerScope = (): LayerTypes => ({
  type: DECREASE_LAYER_SCOPE
});

export const clearLayerScope = (): LayerTypes => ({
  type: CLEAR_LAYER_SCOPE
});

export const newLayerScope = (payload: NewLayerScopePayload): LayerTypes => ({
  type: NEW_LAYER_SCOPE,
  payload
});

// Group

export const groupLayers = (payload: GroupLayersPayload): LayerTypes => ({
  type: GROUP_LAYERS,
  payload
});

export const ungroupLayer = (payload: UngroupLayerPayload): LayerTypes => ({
  type: UNGROUP_LAYER,
  payload
});

export const ungroupLayers = (payload: UngroupLayersPayload): LayerTypes => ({
  type: UNGROUP_LAYERS,
  payload
});