export const OPEN_FILL_EDITOR = 'OPEN_FILL_EDITOR';
export const CLOSE_FILL_EDITOR = 'CLOSE_FILL_EDITOR';

export interface OpenFillEditorPayload {
  layer: string;
  fill: em.Fill;
  x: number;
  y: number;
  onChange?(fill: em.Fill): void;
  onClose?(fill: em.Fill): void;
}

export interface OpenFillEditor {
  type: typeof OPEN_FILL_EDITOR;
  payload: OpenFillEditorPayload;
}

export interface CloseFillEditor {
  type: typeof CLOSE_FILL_EDITOR;
}

export type FillEditorTypes = OpenFillEditor | CloseFillEditor;