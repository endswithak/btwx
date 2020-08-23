export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const SET_CANVAS_RESIZING = 'SET_CANVAS_RESIZING';
export const SET_CANVAS_SELECTING = 'SET_CANVAS_SELECTING';
export const SET_CANVAS_DRAGGING = 'SET_CANVAS_DRAGGING';
export const SET_CANVAS_ZOOMING = 'SET_CANVAS_ZOOMING';
export const SET_CANVAS_ZOOMING_TYPE = 'SET_CANVAS_ZOOMING_TYPE';
export const ADD_ARTBOARD_PRESET = 'ADD_ARTBOARD_PRESET';
export const REMOVE_ARTBOARD_PRESET = 'REMOVE_ARTBOARD_PRESET';
export const UPDATE_ARTBOARD_PRESET = 'UPDATE_ARTBOARD_PRESET';
export const SET_LEFT_SIDEBAR_WIDTH = 'SET_LEFT_SIDEBAR_WIDTH';
export const SET_RIGHT_SIDEBAR_WIDTH = 'SET_RIGHT_SIDEBAR_WIDTH';
export const SET_TWEEN_DRAWER_HEIGHT = 'SET_TWEEN_DRAWER_HEIGHT';
export const SET_CANVAS_MEASURING = 'SET_CANVAS_MEASURING';

export interface SetCanvasMatrixPayload {
  matrix: number[];
}

export interface SetCanvasMatrix {
  type: typeof SET_CANVAS_MATRIX;
  payload: SetCanvasMatrixPayload;
}

export interface SetCanvasResizingPayload {
  resizing: boolean;
  resizingType?: em.ResizingType;
}

export interface SetCanvasResizing {
  type: typeof SET_CANVAS_RESIZING;
  payload: SetCanvasResizingPayload;
}

export interface SetCanvasSelectingPayload {
  selecting: boolean;
}

export interface SetCanvasSelecting {
  type: typeof SET_CANVAS_SELECTING;
  payload: SetCanvasSelectingPayload;
}

export interface SetCanvasDraggingPayload {
  dragging: boolean;
}

export interface SetCanvasDragging {
  type: typeof SET_CANVAS_DRAGGING;
  payload: SetCanvasDraggingPayload;
}

export interface SetCanvasZoomingPayload {
  zooming: boolean;
  zoomingType?: em.ZoomingType;
}

export interface SetCanvasZooming {
  type: typeof SET_CANVAS_ZOOMING;
  payload: SetCanvasZoomingPayload;
}

export interface SetCanvasZoomingTypePayload {
  zoomingType: em.ZoomingType;
}

export interface SetCanvasZoomingType {
  type: typeof SET_CANVAS_ZOOMING_TYPE;
  payload: SetCanvasZoomingTypePayload;
}

export interface AddArtboardPresetPayload {
  id: string;
  type: string;
  width: number;
  height: number;
}

export interface AddArtboardPreset {
  type: typeof ADD_ARTBOARD_PRESET;
  payload: AddArtboardPresetPayload;
}

export interface RemoveArtboardPresetPayload {
  id: string;
}

export interface RemoveArtboardPreset {
  type: typeof REMOVE_ARTBOARD_PRESET;
  payload: RemoveArtboardPresetPayload;
}

export interface UpdateArtboardPresetPayload {
  id: string;
  type: string;
  width: number;
  height: number;
}

export interface UpdateArtboardPreset {
  type: typeof UPDATE_ARTBOARD_PRESET;
  payload: UpdateArtboardPresetPayload;
}

export interface SetLeftSidebarWidthPayload {
  width: number;
}

export interface SetLeftSidebarWidth {
  type: typeof SET_LEFT_SIDEBAR_WIDTH;
  payload: SetLeftSidebarWidthPayload;
}

export interface SetRightSidebarWidthPayload {
  width: number;
}

export interface SetRightSidebarWidth {
  type: typeof SET_RIGHT_SIDEBAR_WIDTH;
  payload: SetRightSidebarWidthPayload;
}

export interface SetTweenDrawerHeightPayload {
  height: number;
}

export interface SetTweenDrawerHeight {
  type: typeof SET_TWEEN_DRAWER_HEIGHT;
  payload: SetTweenDrawerHeightPayload;
}

export interface SetCanvasMeasuringPayload {
  measuring: boolean;
}

export interface SetCanvasMeasuring {
  type: typeof SET_CANVAS_MEASURING;
  payload: SetCanvasMeasuringPayload;
}

export type CanvasSettingsTypes = SetCanvasMatrix |
                                  SetCanvasResizing |
                                  SetCanvasSelecting |
                                  SetCanvasDragging |
                                  SetCanvasZooming |
                                  SetCanvasZoomingType |
                                  AddArtboardPreset |
                                  RemoveArtboardPreset |
                                  UpdateArtboardPreset |
                                  SetLeftSidebarWidth |
                                  SetRightSidebarWidth |
                                  SetTweenDrawerHeight |
                                  SetCanvasMeasuring;