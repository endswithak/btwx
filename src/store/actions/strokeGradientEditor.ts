import {
  OPEN_STROKE_GRADIENT_EDITOR,
  CLOSE_STROKE_GRADIENT_EDITOR,
  OpenStrokeGradientEditorPayload,
  StrokeGradientEditorTypes
} from '../actionTypes/strokeGradientEditor';

export const openStrokeGradientEditor = (payload: OpenStrokeGradientEditorPayload): StrokeGradientEditorTypes => ({
  type: OPEN_STROKE_GRADIENT_EDITOR,
  payload
});

export const closeStrokeGradientEditor = (): StrokeGradientEditorTypes => ({
  type: CLOSE_STROKE_GRADIENT_EDITOR
});