export const OPEN_GRADIENT_EDITOR = 'OPEN_GRADIENT_EDITOR';
export const CLOSE_GRADIENT_EDITOR = 'CLOSE_GRADIENT_EDITOR';

export interface OpenGradientEditorPayload {
  layers: string[];
  prop: 'fill' | 'stroke' | 'shadow';
  gradient: em.Gradient | 'multi';
  x: number;
  y: number;
}

export interface OpenGradientEditor {
  type: typeof OPEN_GRADIENT_EDITOR;
  payload: OpenGradientEditorPayload;
}

export interface CloseGradientEditor {
  type: typeof CLOSE_GRADIENT_EDITOR;
}

export type GradientEditorTypes = OpenGradientEditor | CloseGradientEditor;