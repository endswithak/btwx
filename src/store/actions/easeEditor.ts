import {
  OPEN_EASE_EDITOR,
  CLOSE_EASE_EDITOR,
  OpenEaseEditorPayload,
  EaseEditorTypes
} from '../actionTypes/easeEditor';

export const openEaseEditor = (payload: OpenEaseEditorPayload): EaseEditorTypes => ({
  type: OPEN_EASE_EDITOR,
  payload
});

export const closeEaseEditor = (): EaseEditorTypes => ({
  type: CLOSE_EASE_EDITOR
});