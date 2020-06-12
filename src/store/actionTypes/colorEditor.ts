export const OPEN_COLOR_EDITOR = 'OPEN_COLOR_EDITOR';
export const CLOSE_COLOR_EDITOR = 'CLOSE_COLOR_EDITOR';

export interface OpenColorEditorPayload {
  layer: string;
  color: string;
  //prop: em.ColorEditorProp;
  x: number;
  y: number;
  onChange?(color: string): void;
  onClose?(color: string): void;
}

export interface OpenColorEditor {
  type: typeof OPEN_COLOR_EDITOR;
  payload: OpenColorEditorPayload;
}

export interface CloseColorEditor {
  type: typeof CLOSE_COLOR_EDITOR;
}

export type ColorEditorTypes = OpenColorEditor | CloseColorEditor;