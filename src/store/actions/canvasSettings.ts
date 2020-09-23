import { disableActiveToolThunk } from './tool';

import {
  SET_CANVAS_DRAWING,
  SET_CANVAS_TYPING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_ZOOMING_TYPE,
  SET_CANVAS_MEASURING,
  SET_CANVAS_FOCUSING,
  RESET_CANVAS_SETTINGS,
  SET_CANVAS_MOUSE_POSITION,
  SetCanvasDrawingPayload,
  SetCanvasTypingPayload,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
  SetCanvasSelectingPayload,
  SetCanvasZoomingTypePayload,
  SetCanvasMeasuringPayload,
  SetCanvasFocusingPayload,
  SetCanvasMousePositionPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasDrawing = (payload: SetCanvasDrawingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_DRAWING,
  payload
});

export const setCanvasTyping = (payload: SetCanvasTypingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_TYPING,
  payload
});

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

export const setCanvasMousePosition = (payload: SetCanvasMousePositionPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_MOUSE_POSITION,
  payload
});

export const resetCanvasSettingsThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(disableActiveToolThunk());
    dispatch(resetCanvasSettings());
  }
}