import {
  OPEN_GRADIENT_EDITOR,
  CLOSE_GRADIENT_EDITOR,
  OpenGradientEditorPayload,
  GradientEditorTypes
} from '../actionTypes/gradientEditor';

export const openGradientEditor = (payload: OpenGradientEditorPayload): GradientEditorTypes => ({
  type: OPEN_GRADIENT_EDITOR,
  payload
});

export const closeGradientEditor = (): GradientEditorTypes => ({
  type: CLOSE_GRADIENT_EDITOR
});