import {
  OPEN_FILL_LINEAR_GRADIENT_EDITOR,
  CLOSE_FILL_LINEAR_GRADIENT_EDITOR,
  OpenFillLinearGradientEditorPayload,
  FillLinearGradientEditorTypes
} from '../actionTypes/fillLinearGradientEditor';

export const openFillLinearGradientEditor = (payload: OpenFillLinearGradientEditorPayload): FillLinearGradientEditorTypes => ({
  type: OPEN_FILL_LINEAR_GRADIENT_EDITOR,
  payload
});

export const closeFillLinearGradientEditor = (): FillLinearGradientEditorTypes => ({
  type: CLOSE_FILL_LINEAR_GRADIENT_EDITOR
});