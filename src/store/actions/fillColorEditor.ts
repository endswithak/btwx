import {
  OPEN_FILL_COLOR_EDITOR,
  CLOSE_FILL_COLOR_EDITOR,
  OpenFillColorEditorPayload,
  FillColorEditorTypes
} from '../actionTypes/fillColorEditor';

export const openFillColorEditor = (payload: OpenFillColorEditorPayload): FillColorEditorTypes => ({
  type: OPEN_FILL_COLOR_EDITOR,
  payload
});

export const closeFillColorEditor = (): FillColorEditorTypes => ({
  type: CLOSE_FILL_COLOR_EDITOR
});