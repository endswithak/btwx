import {
  ADD_SHAPE,
  REMOVE_SHAPE,
  SELECT_SHAPE,
  DESELECT_SHAPE,
  ENABLE_SHAPE_HOVER,
  DISABLE_SHAPE_HOVER,
  AddShapePayload,
  RemoveShapePayload,
  SelectShapePayload,
  DeselectShapePayload,
  EnableShapeHoverPayload,
  DisableShapeHoverPayload,
  ShapeTypes,
} from '../actionTypes/shape';

// Add / remove

export const addShape = (payload: AddShapePayload): ShapeTypes => ({
  type: ADD_SHAPE,
  payload
});

export const removePage = (payload: RemoveShapePayload): ShapeTypes => ({
  type: REMOVE_SHAPE,
  payload
});

// Select

export const selectShape = (payload: SelectShapePayload): ShapeTypes => ({
  type: SELECT_SHAPE,
  payload
});

export const deselectPage = (payload: DeselectShapePayload): ShapeTypes => ({
  type: DESELECT_SHAPE,
  payload
});

// Hover

export const enableShapeHover = (payload: EnableShapeHoverPayload): ShapeTypes => ({
  type: ENABLE_SHAPE_HOVER,
  payload
});

export const removePageChild = (payload: DisableShapeHoverPayload): ShapeTypes => ({
  type: DISABLE_SHAPE_HOVER,
  payload
});