import {
  OPEN_ARTBOARD_PRESET_EDITOR,
  CLOSE_ARTBOARD_PRESET_EDITOR,
  OpenArtboardPresetEditorPayload,
  ArtboardPresetEditorTypes
} from '../actionTypes/artboardPresetEditor';

export const openArtboardPresetEditor = (payload: OpenArtboardPresetEditorPayload): ArtboardPresetEditorTypes => ({
  type: OPEN_ARTBOARD_PRESET_EDITOR,
  payload
});

export const closeArtboardPresetEditor = (): ArtboardPresetEditorTypes => ({
  type: CLOSE_ARTBOARD_PRESET_EDITOR
});