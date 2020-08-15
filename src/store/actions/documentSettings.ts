import { v4 as uuidv4 } from 'uuid';

import {
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
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