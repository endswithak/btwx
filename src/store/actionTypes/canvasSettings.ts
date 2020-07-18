export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const ADD_CANVAS_IMAGE = 'ADD_CANVAS_IMAGE';
export const SET_CANVAS_RESIZING = 'SET_CANVAS_RESIZING';
export const SET_CANVAS_DRAGGING = 'SET_CANVAS_DRAGGING';
export const SET_CANVAS_ZOOMING = 'SET_CANVAS_ZOOMING';

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

export type CanvasSettingsTypes = SetCanvasMatrix | AddCanvasImage | SetCanvasResizing | SetCanvasDragging | SetCanvasZooming;