import {
  OPEN_STROKE_COLOR_EDITOR,
  CLOSE_STROKE_COLOR_EDITOR,
  OpenStrokeColorEditorPayload,
  StrokeColorEditorTypes
} from '../actionTypes/strokeColorEditor';

export const openStrokeColorEditor = (payload: OpenStrokeColorEditorPayload): StrokeColorEditorTypes => ({
  type: OPEN_STROKE_COLOR_EDITOR,
  payload
});

export const closeStrokeColorEditor = (): StrokeColorEditorTypes => ({
  type: CLOSE_STROKE_COLOR_EDITOR
});