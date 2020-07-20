export const OPEN_ARTBOARD_PRESET_EDITOR = 'OPEN_ARTBOARD_PRESET_EDITOR';
export const CLOSE_ARTBOARD_PRESET_EDITOR = 'CLOSE_ARTBOARD_PRESET_EDITOR';

export interface OpenArtboardPresetEditor {
  type: typeof OPEN_ARTBOARD_PRESET_EDITOR;
  payload: em.ArtboardPreset;
}

export interface CloseArtboardPresetEditor {
  type: typeof CLOSE_ARTBOARD_PRESET_EDITOR;
}

export type ArtboardPresetEditorTypes = OpenArtboardPresetEditor | CloseArtboardPresetEditor;