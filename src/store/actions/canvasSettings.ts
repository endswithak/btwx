import {
  SET_CANVAS_ACTIVE_TOOL,
  SET_CANVAS_DRAWING,
  SET_CANVAS_TYPING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_MEASURING,
  SET_CANVAS_FOCUSING,
  RESET_CANVAS_SETTINGS,
  SET_CANVAS_MOUSE_POSITION,
  SET_CANVAS_TRANSLATING,
  SET_CANVAS_ZOOM_TYPE,
  SET_CANVAS_CURSOR,
  SET_CANVAS_READY,
  SetCanvasActiveToolPayload,
  SetCanvasDrawingPayload,
  SetCanvasTypingPayload,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
  SetCanvasSelectingPayload,
  SetCanvasMeasuringPayload,
  SetCanvasFocusingPayload,
  SetCanvasMousePositionPayload,
  SetCanvasTranslatingPayload,
  SetCanvasZoomTypePayload,
  SetCanvasCursorPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasActiveTool = (payload: SetCanvasActiveToolPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_ACTIVE_TOOL,
  payload
});

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

export const setCanvasTranslating = (payload: SetCanvasTranslatingPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_TRANSLATING,
  payload
});

export const setCanvasZoomType = (payload: SetCanvasZoomTypePayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_ZOOM_TYPE,
  payload
});

export const setCanvasCursor = (payload: SetCanvasCursorPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_CURSOR,
  payload
});

export const setCanvasReady = (): CanvasSettingsTypes => ({
  type: SET_CANVAS_READY
});