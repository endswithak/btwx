export const OPEN_FILL_LINEAR_GRADIENT_EDITOR = 'OPEN_FILL_LINEAR_GRADIENT_EDITOR';
export const CLOSE_FILL_LINEAR_GRADIENT_EDITOR = 'CLOSE_FILL_LINEAR_GRADIENT_EDITOR';

export interface OpenFillLinearGradientEditorPayload {
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

export interface OpenFillLinearGradientEditor {
  type: typeof OPEN_FILL_LINEAR_GRADIENT_EDITOR;
  payload: OpenFillLinearGradientEditorPayload;
}

export interface CloseFillLinearGradientEditor {
  type: typeof CLOSE_FILL_LINEAR_GRADIENT_EDITOR;
}

export type FillLinearGradientEditorTypes = OpenFillLinearGradientEditor | CloseFillLinearGradientEditor;