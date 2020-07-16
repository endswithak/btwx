export const OPEN_STROKE_GRADIENT_EDITOR = 'OPEN_STROKE_GRADIENT_EDITOR';
export const CLOSE_STROKE_GRADIENT_EDITOR = 'CLOSE_STROKE_GRADIENT_EDITOR';

export interface OpenStrokeGradientEditorPayload {
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

export interface OpenStrokeGradientEditor {
  type: typeof OPEN_STROKE_GRADIENT_EDITOR;
  payload: OpenStrokeGradientEditorPayload;
}

export interface CloseStrokeGradientEditor {
  type: typeof CLOSE_STROKE_GRADIENT_EDITOR;
}

export type StrokeGradientEditorTypes = OpenStrokeGradientEditor | CloseStrokeGradientEditor;