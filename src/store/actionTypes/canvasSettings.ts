export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';

export interface SetCanvasMatrixPayload {
  matrix: number[];
}

export interface SetCanvasMatrix {
  type: typeof SET_CANVAS_MATRIX;
  payload: SetCanvasMatrixPayload;
}

export type CanvasSettingsTypes = SetCanvasMatrix;