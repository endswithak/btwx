export const ADD_DOCUMENT_WINDOW = 'ADD_DOCUMENT_WINDOW';
export const REMOVE_DOCUMENT_WINDOW = 'REMOVE_DOCUMENT_WINDOW';

export const ADD_PREVIEW_WINDOW = 'ADD_PREVIEW_WINDOW';
export const REMOVE_PREVIEW_WINDOW = 'REMOVE_PREVIEW_WINDOW';

export const ADD_PREFERENCES_WINDOW = 'ADD_PREFERENCES_WINDOW';
export const REMOVE_PREFERENCES_WINDOW = 'REMOVE_PREFERENCES_WINDOW';

export interface AddDocumentWindowPayload {
  id: number;
}

export interface AddDocumentWindow {
  type: typeof ADD_DOCUMENT_WINDOW;
  payload: AddDocumentWindowPayload;
}

export interface RemoveDocumentWindowPayload {
  id: number;
}

export interface RemoveDocumentWindow {
  type: typeof REMOVE_DOCUMENT_WINDOW;
  payload: RemoveDocumentWindowPayload;
}

export interface AddPreviewWindowPayload {
  id: number;
  documentId: number;
}

export interface AddPreviewWindow {
  type: typeof ADD_PREVIEW_WINDOW;
  payload: AddPreviewWindowPayload;
}

export interface RemovePreviewWindowPayload {
  id: number;
}

export interface RemovePreviewWindow {
  type: typeof REMOVE_PREVIEW_WINDOW;
  payload: RemovePreviewWindowPayload;
}

export interface AddPreferencesWindowPayload {
  id: number;
}

export interface AddPreferencesWindow {
  type: typeof ADD_PREFERENCES_WINDOW;
  payload: AddPreferencesWindowPayload;
}

export interface RemovePreferencesWindowPayload {
  id: number;
}

export interface RemovePreferencesWindow {
  type: typeof REMOVE_PREFERENCES_WINDOW;
  payload: RemovePreferencesWindowPayload;
}

export type SessionTypes = AddDocumentWindow |
                               RemoveDocumentWindow |
                               AddPreviewWindow |
                               RemovePreviewWindow |
                               AddPreferencesWindow |
                               RemovePreferencesWindow;