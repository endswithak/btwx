export const SAVE_DOCUMENT_AS = 'SAVE_DOCUMENT_AS';
export const SAVE_DOCUMENT = 'SAVE_DOCUMENT';
export const ADD_DOCUMENT_IMAGE = 'ADD_DOCUMENT_IMAGE';

export interface SaveDocumentAsPayload {
  id?: string;
  name: string;
  path: string;
  edit: string;
}

export interface SaveDocumentAs {
  type: typeof SAVE_DOCUMENT_AS;
  payload: SaveDocumentAsPayload;
}

export interface SaveDocumentPayload {
  edit: string;
}

export interface SaveDocument {
  type: typeof SAVE_DOCUMENT;
  payload: SaveDocumentPayload;
}

export interface AddDocumentImagePayload {
  id: string;
  buffer: Buffer;
}

export interface AddDocumentImage {
  type: typeof ADD_DOCUMENT_IMAGE;
  payload: AddDocumentImagePayload;
}

export type DocumentSettingsTypes = SaveDocumentAs | SaveDocument | AddDocumentImage;