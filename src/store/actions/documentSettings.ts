import { v4 as uuidv4 } from 'uuid';

import {
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  ADD_DOCUMENT_IMAGE,
  SET_CANVAS_MATRIX,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
  AddDocumentImagePayload,
  SetCanvasMatrixPayload,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetLeftSidebarWidthPayload,
  SetRightSidebarWidthPayload,
  SetTweenDrawerHeightPayload,
  SetTweenDrawerLayersWidthPayload,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export const saveDocumentAs = (payload: SaveDocumentAsPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT_AS,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const saveDocument = (payload: SaveDocumentPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT,
  payload
});

export const addDocumentImage = (payload: AddDocumentImagePayload): DocumentSettingsTypes => ({
  type: ADD_DOCUMENT_IMAGE,
  payload
});

export const setCanvasMatrix = (payload: SetCanvasMatrixPayload): DocumentSettingsTypes => ({
  type: SET_CANVAS_MATRIX,
  payload
});

export const addArtboardPreset = (payload: AddArtboardPresetPayload): DocumentSettingsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): DocumentSettingsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): DocumentSettingsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});

export const setLeftSidebarWidth = (payload: SetLeftSidebarWidthPayload): DocumentSettingsTypes => ({
  type: SET_LEFT_SIDEBAR_WIDTH,
  payload
});

export const setRightSidebarWidth = (payload: SetRightSidebarWidthPayload): DocumentSettingsTypes => ({
  type: SET_RIGHT_SIDEBAR_WIDTH,
  payload
});

export const setTweenDrawerHeight = (payload: SetTweenDrawerHeightPayload): DocumentSettingsTypes => ({
  type: SET_TWEEN_DRAWER_HEIGHT,
  payload
});

export const setTweenDrawerLayersWidth = (payload: SetTweenDrawerLayersWidthPayload): DocumentSettingsTypes => ({
  type: SET_TWEEN_DRAWER_LAYERS_WIDTH,
  payload
});