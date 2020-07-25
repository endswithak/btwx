export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const ADD_CANVAS_IMAGE = 'ADD_CANVAS_IMAGE';
export const SET_CANVAS_RESIZING = 'SET_CANVAS_RESIZING';
export const SET_CANVAS_DRAGGING = 'SET_CANVAS_DRAGGING';
export const SET_CANVAS_ZOOMING = 'SET_CANVAS_ZOOMING';
export const ADD_ARTBOARD_PRESET = 'ADD_ARTBOARD_PRESET';
export const REMOVE_ARTBOARD_PRESET = 'REMOVE_ARTBOARD_PRESET';
export const UPDATE_ARTBOARD_PRESET = 'UPDATE_ARTBOARD_PRESET';
export const SET_LEFT_SIDEBAR_WIDTH = 'SET_LEFT_SIDEBAR_WIDTH';
export const SET_RIGHT_SIDEBAR_WIDTH = 'SET_RIGHT_SIDEBAR_WIDTH';
export const SET_TWEEN_DRAWER_HEIGHT = 'SET_TWEEN_DRAWER_HEIGHT';

export interface SetCanvasMatrixPayload {
  matrix: number[];
}

export interface SetCanvasMatrix {
  type: typeof SET_CANVAS_MATRIX;
  payload: SetCanvasMatrixPayload;
}

export interface AddCanvasImagePayload {
  id: string;
  buffer: Buffer;
}

export interface AddCanvasImage {
  type: typeof ADD_CANVAS_IMAGE;
  payload: AddCanvasImagePayload;
}

export interface SetCanvasResizingPayload {
  resizing: boolean;
}

export interface SetCanvasResizing {
  type: typeof SET_CANVAS_RESIZING;
  payload: SetCanvasResizingPayload;
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
}

export interface SetCanvasZooming {
  type: typeof SET_CANVAS_ZOOMING;
  payload: SetCanvasZoomingPayload;
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

export type CanvasSettingsTypes = SetCanvasMatrix |
                                  AddCanvasImage |
                                  SetCanvasResizing |
                                  SetCanvasDragging |
                                  SetCanvasZooming |
                                  AddArtboardPreset |
                                  RemoveArtboardPreset |
                                  UpdateArtboardPreset |
                                  SetLeftSidebarWidth |
                                  SetRightSidebarWidth |
                                  SetTweenDrawerHeight;