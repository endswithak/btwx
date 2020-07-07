import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SetCanvasMatrixPayload,
  AddCanvasImagePayload,
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