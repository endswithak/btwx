export const OPEN_FILL_RADIAL_GRADIENT_EDITOR = 'OPEN_FILL_RADIAL_GRADIENT_EDITOR';
export const CLOSE_FILL_RADIAL_GRADIENT_EDITOR = 'CLOSE_FILL_RADIAL_GRADIENT_EDITOR';

export interface OpenFillRadialGradientEditorPayload {
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

export interface OpenFillRadialGradientEditor {
  type: typeof OPEN_FILL_RADIAL_GRADIENT_EDITOR;
  payload: OpenFillRadialGradientEditorPayload;
}

export interface CloseFillRadialGradientEditor {
  type: typeof CLOSE_FILL_RADIAL_GRADIENT_EDITOR;
}

export type FillRadialGradientEditorTypes = OpenFillRadialGradientEditor | CloseFillRadialGradientEditor;