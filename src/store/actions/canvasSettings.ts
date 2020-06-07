import {
  SET_CANVAS_MATRIX,
  SetCanvasMatrixPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasMatrix = (payload: SetCanvasMatrixPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_MATRIX,
  payload
});