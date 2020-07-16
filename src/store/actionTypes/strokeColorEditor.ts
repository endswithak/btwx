export const OPEN_STROKE_COLOR_EDITOR = 'OPEN_STROKE_COLOR_EDITOR';
export const CLOSE_STROKE_COLOR_EDITOR = 'CLOSE_STROKE_COLOR_EDITOR';

export interface OpenStrokeColorEditorPayload {
  layer: string;
  color: em.Color;
  x: number;
  y: number;
}

export interface OpenStrokeColorEditor {
  type: typeof OPEN_STROKE_COLOR_EDITOR;
  payload: OpenStrokeColorEditorPayload;
}

export interface CloseStrokeColorEditor {
  type: typeof CLOSE_STROKE_COLOR_EDITOR;
}

export type StrokeColorEditorTypes = OpenStrokeColorEditor | CloseStrokeColorEditor;