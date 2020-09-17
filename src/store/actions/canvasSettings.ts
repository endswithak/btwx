import {
  SET_CANVAS_RESIZING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_ZOOMING_TYPE,
  SET_CANVAS_MEASURING,
  SET_CANVAS_FOCUSING,
  RESET_CANVAS_SETTINGS,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
  SetCanvasSelectingPayload,
  SetCanvasZoomingTypePayload,
  SetCanvasMeasuringPayload,
  SetCanvasFocusingPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasResizing = (payload: SetCanvasResizingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_RESIZING,
  payload
});

export const setCanvasSelecting = (payload: SetCanvasSelectingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_SELECTING,
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

export const setCanvasZoomingType = (payload: SetCanvasZoomingTypePayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_ZOOMING_TYPE,
  payload
});

export const setCanvasMeasuring = (payload: SetCanvasMeasuringPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_MEASURING,
  payload
});

export const setCanvasFocusing = (payload: SetCanvasFocusingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_FOCUSING,
  payload
});

export const resetCanvasSettings = (): CanvasSettingsTypes => ({
  type: RESET_CANVAS_SETTINGS
});