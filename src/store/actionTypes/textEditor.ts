export const OPEN_TEXT_EDITOR = 'OPEN_TEXT_EDITOR';
export const CLOSE_TEXT_EDITOR = 'CLOSE_TEXT_EDITOR';

export interface OpenTextEditorPayload {
  layer: string;
  paperScope: number;
  x: number;
  y: number;
}

export interface OpenTextEditor {
  type: typeof OPEN_TEXT_EDITOR;
  payload: OpenTextEditorPayload;
}

export interface CloseTextEditor {
  type: typeof CLOSE_TEXT_EDITOR;
}

export type TextEditorTypes = OpenTextEditor | CloseTextEditor;