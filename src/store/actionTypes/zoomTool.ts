export const ENABLE_ZOOM_TOOL = 'ENABLE_ZOOM_TOOL';
export const SET_ZOOM_TOOL_TYPE = 'SET_ZOOM_TOOL_ZOOM_TYPE';
export const DISABLE_ZOOM_TOOL = 'DISABLE_ZOOM_TOOL';

export interface EnableZoomToolPayload {
  zoomType: em.ZoomType;
}

interface EnableZoomTool {
  type: typeof ENABLE_ZOOM_TOOL;
  payload: EnableZoomToolPayload;
}

export interface SetZoomToolTypePayload {
  zoomType: em.ZoomType;
}

interface SetZoomToolType {
  type: typeof SET_ZOOM_TOOL_TYPE;
  payload: SetZoomToolTypePayload;
}

interface DisableZoomTool {
  type: typeof DISABLE_ZOOM_TOOL;
}

export type ZoomToolTypes = EnableZoomTool |
                            SetZoomToolType |
                            DisableZoomTool;