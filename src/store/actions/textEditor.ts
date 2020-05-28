import {
  OPEN_TEXT_EDITOR,
  CLOSE_TEXT_EDITOR,
  OpenTextEditorPayload,
  TextEditorTypes
} from '../actionTypes/textEditor';

export const openTextEditor = (payload: OpenTextEditorPayload): TextEditorTypes => ({
  type: OPEN_TEXT_EDITOR,
  payload
});

export const closeTextEditor = (): TextEditorTypes => ({
  type: CLOSE_TEXT_EDITOR
});