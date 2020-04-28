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
  SELECT_LAYER,
  DESELECT_LAYER,
  HOVER_ENTER,
  HOVER_LEAVE,
  AddPagePayload,
  AddShapePayload,
  AddGroupPayload,
  RemoveLayerPayload,
  InsertChildPayload,
  InsertAbovePayload,
  InsertBelowPayload,
  ShowChildrenPayload,
  SelectionPayload,
  HoverPayload,
  LayersTypes
} from '../actionTypes/layers';

// Add

export const addShape = (content: AddShapePayload): LayersTypes => ({
  type: ADD_SHAPE,
  payload: content
});

export const addGroup = (content: AddGroupPayload): LayersTypes => ({
  type: ADD_GROUP,
  payload: content
});

export const addPage = (content: AddPagePayload): LayersTypes => ({
  type: ADD_PAGE,
  payload: content
});

export const removeLayer = (content: RemoveLayerPayload): LayersTypes => ({
  type: REMOVE_LAYER,
  payload: content
});

// Insert

export const insertChild = (content: InsertChildPayload): LayersTypes => ({
  type: INSERT_CHILD,
  payload: content
});

export const insertAbove = (content: InsertAbovePayload): LayersTypes => ({
  type: INSERT_ABOVE,
  payload: content
});

export const insertBelow = (content: InsertBelowPayload): LayersTypes => ({
  type: INSERT_BELOW,
  payload: content
});

// Other

export const expandGroup = (content: ShowChildrenPayload): LayersTypes => ({
  type: EXPAND_GROUP,
  payload: content
});

export const collapseGroup = (content: ShowChildrenPayload): LayersTypes => ({
  type: COLLAPSE_GROUP,
  payload: content
});

// Select

export const selectLayer = (selection: SelectionPayload): LayersTypes => ({
  type: SELECT_LAYER,
  payload: selection
});

export const deselectLayer = (selection: SelectionPayload): LayersTypes => ({
  type: DESELECT_LAYER,
  payload: selection
});

// Hover

export const hoverEnter = (hover: HoverPayload): LayersTypes => ({
  type: HOVER_ENTER,
  payload: hover
});

export const hoverLeave = (hover: HoverPayload): LayersTypes => ({
  type: HOVER_LEAVE,
  payload: hover
});