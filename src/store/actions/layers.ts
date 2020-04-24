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
  AddPagePayload,
  AddShapePayload,
  AddGroupPayload,
  RemoveLayerPayload,
  InsertChildPayload,
  InsertAbovePayload,
  InsertBelowPayload,
  ShowChildrenPayload,
  SelectionPayload,
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

export const addToSelection = (selection: SelectionPayload): LayersTypes => ({
  type: ADD_TO_SELECTION,
  payload: selection
});

export const removeFromSelection = (selection: SelectionPayload): LayersTypes => ({
  type: REMOVE_FROM_SELECTION,
  payload: selection
});

export const clearSelection = (): LayersTypes => ({
  type: CLEAR_SELECTION
});

export const newSelection = (selection: SelectionPayload): LayersTypes => ({
  type: NEW_SELECTION,
  payload: selection
});

export const groupSelection = (): LayersTypes => ({
  type: GROUP_SELECTION
});

export const ungroupSelection = (): LayersTypes => ({
  type: UNGROUP_SELECTION
});