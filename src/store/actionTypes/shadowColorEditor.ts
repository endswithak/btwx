export const OPEN_SHADOW_COLOR_EDITOR = 'OPEN_SHADOW_COLOR_EDITOR';
export const CLOSE_SHADOW_COLOR_EDITOR = 'CLOSE_SHADOW_COLOR_EDITOR';

export interface OpenShadowColorEditorPayload {
  layer: string;
  color: em.Color;
  x: number;
  y: number;
}

export interface OpenShadowColorEditor {
  type: typeof OPEN_SHADOW_COLOR_EDITOR;
  payload: OpenShadowColorEditorPayload;
}

export interface CloseShadowColorEditor {
  type: typeof CLOSE_SHADOW_COLOR_EDITOR;
}

export type ShadowColorEditorTypes = OpenShadowColorEditor | CloseShadowColorEditor;