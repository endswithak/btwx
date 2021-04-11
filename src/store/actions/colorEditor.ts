import {
  OPEN_COLOR_EDITOR,
  CLOSE_COLOR_EDITOR,
  OpenColorEditorPayload,
  ColorEditorTypes
} from '../actionTypes/colorEditor';

export const openColorEditor = (payload: OpenColorEditorPayload): ColorEditorTypes => ({
  type: OPEN_COLOR_EDITOR,
  payload
});

export const closeColorEditor = (): ColorEditorTypes => ({
  type: CLOSE_COLOR_EDITOR
});