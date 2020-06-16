import {
  OPEN_STROKE_EDITOR,
  CLOSE_STROKE_EDITOR,
  OpenStrokeEditorPayload,
  StrokeEditorTypes
} from '../actionTypes/strokeEditor';

export const openStrokeEditor = (payload: OpenStrokeEditorPayload): StrokeEditorTypes => ({
  type: OPEN_STROKE_EDITOR,
  payload
});

export const closeStrokeEditor = (): StrokeEditorTypes => ({
  type: CLOSE_STROKE_EDITOR
});