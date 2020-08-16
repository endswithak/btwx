import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_ZOOMING,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_CANVAS_MEASURING,
  SetCanvasMatrixPayload,
  AddCanvasImagePayload,
  SetCanvasResizingPayload,
  SetCanvasDraggingPayload,
  SetCanvasZoomingPayload,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetLeftSidebarWidthPayload,
  SetRightSidebarWidthPayload,
  SetTweenDrawerHeightPayload,
  SetCanvasMeasuringPayload,
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

export const setLeftSidebarWidth = (payload: SetLeftSidebarWidthPayload): CanvasSettingsTypes => ({
  type: SET_LEFT_SIDEBAR_WIDTH,
  payload
});

export const setRightSidebarWidth = (payload: SetRightSidebarWidthPayload): CanvasSettingsTypes => ({
  type: SET_RIGHT_SIDEBAR_WIDTH,
  payload
});

export const setTweenDrawerHeight = (payload: SetTweenDrawerHeightPayload): CanvasSettingsTypes => ({
  type: SET_TWEEN_DRAWER_HEIGHT,
  payload
});

export const setCanvasMeasuring = (payload: SetCanvasMeasuringPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_MEASURING,
  payload
});