import {
  OPEN_SHADOW_COLOR_EDITOR,
  CLOSE_SHADOW_COLOR_EDITOR,
  OpenShadowColorEditorPayload,
  ShadowColorEditorTypes
} from '../actionTypes/shadowColorEditor';

export const openShadowColorEditor = (payload: OpenShadowColorEditorPayload): ShadowColorEditorTypes => ({
  type: OPEN_SHADOW_COLOR_EDITOR,
  payload
});

export const closeShadowColorEditor = (): ShadowColorEditorTypes => ({
  type: CLOSE_SHADOW_COLOR_EDITOR
});