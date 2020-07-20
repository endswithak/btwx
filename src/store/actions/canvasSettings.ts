import { v4 as uuidv4 } from 'uuid';

import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SetCanvasMatrixPayload,
  AddCanvasImagePayload,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasMatrix = (payload: SetCanvasMatrixPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_MATRIX,
  payload
});

export const addCanvasImage = (payload: AddCanvasImagePayload): CanvasSettingsTypes => ({
  type: ADD_CANVAS_IMAGE,
  payload
});

export const setCanvasResizing = (payload: SetCanvasResizingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_RESIZING,
  payload
});

export const setCanvasDragging = (payload: SetCanvasDraggingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_DRAGGING,
  payload
});

export const setCanvasZooming = (payload: SetCanvasZoomingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_ZOOMING,
  payload
});

export const addArtboardPreset = (payload: AddArtboardPresetPayload): CanvasSettingsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): CanvasSettingsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): CanvasSettingsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});