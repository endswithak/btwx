export const OPEN_EASE_EDITOR = 'OPEN_EASE_EDITOR';
export const CLOSE_EASE_EDITOR = 'CLOSE_EASE_EDITOR';

export interface OpenEaseEditorPayload {
  tween: string;
}

export interface OpenEaseEditor {
  type: typeof OPEN_EASE_EDITOR;
  payload: OpenEaseEditorPayload;
}

export interface CloseEaseEditor {
  type: typeof CLOSE_EASE_EDITOR;
}

export type EaseEditorTypes = OpenEaseEditor | CloseEaseEditor;