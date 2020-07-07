export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const ADD_CANVAS_IMAGE = 'ADD_CANVAS_IMAGE';

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

export type CanvasSettingsTypes = SetCanvasMatrix | AddCanvasImage;