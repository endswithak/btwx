export const OPEN_FILL_COLOR_EDITOR = 'OPEN_FILL_COLOR_EDITOR';
export const CLOSE_FILL_COLOR_EDITOR = 'CLOSE_FILL_COLOR_EDITOR';

export interface OpenFillColorEditorPayload {
  layer: string;
  color: string;
  x: number;
  y: number;
}

export interface OpenFillColorEditor {
  type: typeof OPEN_FILL_COLOR_EDITOR;
  payload: OpenFillColorEditorPayload;
}

export interface CloseFillColorEditor {
  type: typeof CLOSE_FILL_COLOR_EDITOR;
}

export type FillColorEditorTypes = OpenFillColorEditor | CloseFillColorEditor;