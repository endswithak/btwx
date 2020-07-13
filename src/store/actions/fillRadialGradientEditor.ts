import {
  OPEN_FILL_RADIAL_GRADIENT_EDITOR,
  CLOSE_FILL_RADIAL_GRADIENT_EDITOR,
  OpenFillRadialGradientEditorPayload,
  FillRadialGradientEditorTypes
} from '../actionTypes/fillRadialGradientEditor';

export const openFillRadialGradientEditor = (payload: OpenFillRadialGradientEditorPayload): FillRadialGradientEditorTypes => ({
  type: OPEN_FILL_RADIAL_GRADIENT_EDITOR,
  payload
});

export const closeFillRadialGradientEditor = (): FillRadialGradientEditorTypes => ({
  type: CLOSE_FILL_RADIAL_GRADIENT_EDITOR
});