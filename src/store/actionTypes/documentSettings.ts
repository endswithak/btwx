export const SAVE_DOCUMENT_AS = 'SAVE_DOCUMENT_AS';
export const SAVE_DOCUMENT = 'SAVE_DOCUMENT';

export interface SaveDocumentAsPayload {
  id?: string;
  name: string;
  path: string;
}

export interface SaveDocumentAs {
  type: typeof SAVE_DOCUMENT_AS;
  payload: SaveDocumentAsPayload;
}

export interface SaveDocumentPayload {
  name: string;
  path: string;
}

export interface SaveDocument {
  type: typeof SAVE_DOCUMENT;
  payload: SaveDocumentPayload;
}

export type DocumentSettingsTypes = SaveDocument | SaveDocumentAs;