import {
  SET_CANVAS_ZOOM,
  SetCanvasZoomPayload,
  CanvasSettingsTypes
} from '../actionTypes/canvasSettings';

export const setCanvasZoom = (payload: SetCanvasZoomPayload): CanvasSettingsTypes => ({
  type: SET_CANVAS_ZOOM,
  payload
});