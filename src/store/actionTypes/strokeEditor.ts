export const OPEN_STROKE_EDITOR = 'OPEN_STROKE_EDITOR';
export const CLOSE_STROKE_EDITOR = 'CLOSE_STROKE_EDITOR';

export interface OpenStrokeEditorPayload {
  layer: string;
  stroke: em.Stroke;
  x: number;
  y: number;
  onChange?(stroke: em.Stroke): void;
  onClose?(stroke: em.Stroke): void;
}

export interface OpenStrokeEditor {
  type: typeof OPEN_STROKE_EDITOR;
  payload: OpenStrokeEditorPayload;
}

export interface CloseStrokeEditor {
  type: typeof CLOSE_STROKE_EDITOR;
}

export type StrokeEditorTypes = OpenStrokeEditor | CloseStrokeEditor;