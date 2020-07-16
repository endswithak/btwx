import {
  OPEN_FILL_GRADIENT_EDITOR,
  CLOSE_FILL_GRADIENT_EDITOR,
  OpenFillGradientEditorPayload,
  FillGradientEditorTypes
} from '../actionTypes/fillGradientEditor';

export const openFillGradientEditor = (payload: OpenFillGradientEditorPayload): FillGradientEditorTypes => ({
  type: OPEN_FILL_GRADIENT_EDITOR,
  payload
});

export const closeFillGradientEditor = (): FillGradientEditorTypes => ({
  type: CLOSE_FILL_GRADIENT_EDITOR
});