export const OPEN_FILL_GRADIENT_EDITOR = 'OPEN_FILL_GRADIENT_EDITOR';
export const CLOSE_FILL_GRADIENT_EDITOR = 'CLOSE_FILL_GRADIENT_EDITOR';

export interface OpenFillGradientEditorPayload {
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

export interface OpenFillGradientEditor {
  type: typeof OPEN_FILL_GRADIENT_EDITOR;
  payload: OpenFillGradientEditorPayload;
}

export interface CloseFillGradientEditor {
  type: typeof CLOSE_FILL_GRADIENT_EDITOR;
}

export type FillGradientEditorTypes = OpenFillGradientEditor | CloseFillGradientEditor;