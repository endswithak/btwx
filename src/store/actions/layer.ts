import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';

import {
  ADD_PAGE,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  SELECT_LAYER,
  DESELECT_LAYER,
  ENABLE_LAYER_HOVER,
  DISABLE_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  EXPAND_LAYER,
  COLLAPSE_LAYER,
  AddPagePayload,
  AddGroupPayload,
  AddShapePayload,
  RemoveLayerPayload,
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
  LayerTypes
} from '../actionTypes/layer';
import { StoreGetState } from '..';

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

export const addGroup = (payload: AddGroupPayload): LayerTypes => ({
  type: ADD_GROUP,
  payload: {
    type: 'Group',
    id: uuidv4(),
    name: payload.name ? payload.name : 'Group',
    parent: payload.parent ? payload.parent : null,
    paperLayer: new paper.Group(),
    children: [],
    selected: false,
    hover: false,
    expanded: false
  }
});

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => ({
  type: ADD_SHAPE,
  payload: {
    type: 'Shape',
    id: uuidv4(),
    name: payload.name ? payload.name : payload.shapeType,
    parent: payload.parent ? payload.parent : null,
    shapeType: payload.shapeType,
    paperLayer: payload.paperLayer,
    selected: false,
    hover: false
  }
});

// Remove

export const removeLayer = (payload: RemoveLayerPayload): LayerTypes => ({
  type: REMOVE_LAYER,
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