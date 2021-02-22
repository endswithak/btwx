import { addItem, removeItem } from '../utils/general';

import {
  ADD_DOCUMENT_WINDOW,
  REMOVE_DOCUMENT_WINDOW,
  ADD_PREVIEW_WINDOW,
  REMOVE_PREVIEW_WINDOW,
  ADD_PREFERENCES_WINDOW,
  REMOVE_PREFERENCES_WINDOW,
  SessionTypes,
} from '../actionTypes/session';

export interface SessionState {
  allIds: number[];
  allPreviewIds: number[];
  allDocumentIds: number[];
  preferencesId: number;
  byId: {
    [id: number]: {
      id: number;
      type: Btwx.WindowType;
      previewId: number;
      documentId: number;
    };
  };
}

export const initialState: SessionState = {
  allIds: [],
  allPreviewIds: [],
  allDocumentIds: [],
  preferencesId: null,
  byId: {}
};

export default (state = initialState, action: SessionTypes): SessionState => {
  switch (action.type) {
    case ADD_DOCUMENT_WINDOW: {
      return {
        ...state,
        allIds: addItem(state.allIds, action.payload.id),
        allDocumentIds: addItem(state.allDocumentIds, action.payload.id),
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            type: 'document',
            previewId: null,
            documentId: action.payload.id
          }
        }
      }
    }
    case REMOVE_DOCUMENT_WINDOW: {
      return {
        ...state,
        allIds: removeItem(state.allIds, action.payload.id),
        allDocumentIds: removeItem(state.allDocumentIds, action.payload.id),
        byId: Object.keys(state.byId).reduce((result: any, current: any) => {
          if (current !== action.payload.id) {
            result = {
              ...result,
              [current]: state.byId[current]
            }
          }
          return result;
        }, {})
      }
    }
    case ADD_PREVIEW_WINDOW: {
      return {
        ...state,
        allIds: addItem(state.allIds, action.payload.id),
        allPreviewIds: addItem(state.allDocumentIds, action.payload.id),
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            type: 'preview',
            previewId: action.payload.id,
            documentId: action.payload.documentId
          },
          [action.payload.documentId]: {
            ...state.byId[action.payload.documentId],
            previewId: action.payload.id
          }
        }
      }
    }
    case REMOVE_PREVIEW_WINDOW: {
      return {
        ...state,
        allIds: removeItem(state.allIds, action.payload.id),
        allPreviewIds: removeItem(state.allDocumentIds, action.payload.id),
        byId: Object.keys(state.byId).reduce((result: any, current: any) => {
          if (current !== action.payload.id) {
            if (current === state.byId[action.payload.id].documentId) {
              result = {
                ...result,
                [current]: {
                  ...state.byId[current],
                  previewId: null
                }
              }
            } else {
              result = {
                ...result,
                [current]: state.byId[current]
              }
            }
          }
          return result;
        }, {})
      }
    }
    case ADD_PREFERENCES_WINDOW: {
      return {
        ...state,
        allIds: addItem(state.allIds, action.payload.id),
        preferencesId: action.payload.id,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            type: 'preferences',
            previewId: null,
            documentId: null
          }
        }
      }
    }
    case REMOVE_PREFERENCES_WINDOW: {
      return {
        ...state,
        allIds: removeItem(state.allIds, action.payload.id),
        preferencesId: null,
        byId: Object.keys(state.byId).reduce((result: any, current: any) => {
          if (current !== action.payload.id) {
            result = {
              ...result,
              [current]: state.byId[current]
            }
          }
          return result;
        }, {})
      }
    }
    default:
      return state;
  }
}
