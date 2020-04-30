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
  ENABLE_LAYER_HOVER,
  DISABLE_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  EXPAND_LAYER,
  COLLAPSE_LAYER,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  SET_GROUP_SCOPE,
  AddPagePayload,
  AddGroupPayload,
  AddShapePayload,
  RemoveLayerPayload,
  RemoveLayersPayload,
  SelectLayerPayload,
  DeselectLayerPayload,
  EnableLayerHoverPayload,
  DisableLayerHoverPayload,
  AddLayerChildPayload,
  InsertLayerChildPayload,
  InsertLayerAbovePayload,
  InsertLayerBelowPayload,
  ExpandLayerPayload,
  CollapseLayerPayload,
  GroupLayersPayload,
  UngroupLayerPayload,
  UngroupLayersPayload,
  SetGroupScopePayload,
  LayerTypes
} from '../actionTypes/layer';


import store, { StoreDispatch } from '..';

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
    hover: false
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
        onMouseEnter: (e: paper.MouseEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          store.dispatch(enableLayerHover({id: id}));
        },
        onMouseLeave: (e: paper.MouseEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          store.dispatch(disableLayerHover({id: id}));
        }
      }),
      children: [],
      selected: false,
      hover: false,
      expanded: false
    }
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => {
  const id = uuidv4();
  payload.paperLayer.onMouseEnter = (e: paper.MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    store.dispatch(enableLayerHover({id: id}));
  }
  payload.paperLayer.onMouseLeave = (e: paper.MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    store.dispatch(disableLayerHover({id: id}));
  }
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
      hover: false
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

export const enableLayerHover = (payload: EnableLayerHoverPayload): LayerTypes => ({
  type: ENABLE_LAYER_HOVER,
  payload
});

export const disableLayerHover = (payload: DisableLayerHoverPayload): LayerTypes => ({
  type: DISABLE_LAYER_HOVER,
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

// Insert

export const insertLayerAbove = (payload: InsertLayerAbovePayload): LayerTypes => ({
  type: INSERT_LAYER_ABOVE,
  payload
});

export const insertLayerBelow = (payload: InsertLayerBelowPayload): LayerTypes => ({
  type: INSERT_LAYER_BELOW,
  payload
});

// Expand

export const expandLayer = (payload: ExpandLayerPayload): LayerTypes => ({
  type: EXPAND_LAYER,
  payload
});

export const collapseLayer = (payload: CollapseLayerPayload): LayerTypes => ({
  type: COLLAPSE_LAYER,
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

export const setGroupScope = (payload: SetGroupScopePayload): LayerTypes => ({
  type: SET_GROUP_SCOPE,
  payload
});