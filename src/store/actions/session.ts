import {
  ADD_DOCUMENT_WINDOW,
  REMOVE_DOCUMENT_WINDOW,
  ADD_PREVIEW_WINDOW,
  REMOVE_PREVIEW_WINDOW,
  ADD_PREFERENCES_WINDOW,
  REMOVE_PREFERENCES_WINDOW,
  AddDocumentWindowPayload,
  RemoveDocumentWindowPayload,
  AddPreviewWindowPayload,
  RemovePreviewWindowPayload,
  AddPreferencesWindowPayload,
  RemovePreferencesWindowPayload,
  SessionTypes
} from '../actionTypes/session';

export const addDocumentWindow = (payload: AddDocumentWindowPayload): SessionTypes => ({
  type: ADD_DOCUMENT_WINDOW,
  payload
});

export const removeDocumentWindow = (payload: RemoveDocumentWindowPayload): SessionTypes => ({
  type: REMOVE_DOCUMENT_WINDOW,
  payload
});

export const addPreviewWindow = (payload: AddPreviewWindowPayload): SessionTypes => ({
  type: ADD_PREVIEW_WINDOW,
  payload
});

export const removePreviewWindow = (payload: RemovePreviewWindowPayload): SessionTypes => ({
  type: REMOVE_PREVIEW_WINDOW,
  payload
});

export const addPreferencesWindow = (payload: AddPreferencesWindowPayload): SessionTypes => ({
  type: ADD_PREFERENCES_WINDOW,
  payload
});

export const removePreferencesWindow = (payload: RemovePreferencesWindowPayload): SessionTypes => ({
  type: REMOVE_PREFERENCES_WINDOW,
  payload
});