import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  SetCanvasMatrixPayload,
  AddCanvasImagePayload,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
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