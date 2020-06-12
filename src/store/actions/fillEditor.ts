import {
  OPEN_FILL_EDITOR,
  CLOSE_FILL_EDITOR,
  OpenFillEditorPayload,
  FillEditorTypes
} from '../actionTypes/fillEditor';

export const openFillEditor = (payload: OpenFillEditorPayload): FillEditorTypes => ({
  type: OPEN_FILL_EDITOR,
  payload
});

export const closeFillEditor = (): FillEditorTypes => ({
  type: CLOSE_FILL_EDITOR
});