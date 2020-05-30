export const SET_CANVAS_ZOOM = 'SET_CANVAS_ZOOM';

export interface SetCanvasZoomPayload {
  zoom: number;
}

export interface SetCanvasZoom {
  type: typeof SET_CANVAS_ZOOM;
  payload: SetCanvasZoomPayload;
}

export type CanvasSettingsTypes = SetCanvasZoom;