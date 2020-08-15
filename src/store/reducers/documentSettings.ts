import {
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  DocumentSettingsTypes,
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
}

const initialState: DocumentSettingsState = {
  id: null,
  name: 'untitled',
  path: null
};

export default (state = initialState, action: DocumentSettingsTypes): DocumentSettingsState => {
  switch (action.type) {
    case SAVE_DOCUMENT: {
      return {
        ...state,
        name: action.payload.name,
        path: action.payload.path
      };
    }
    case SAVE_DOCUMENT_AS: {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path
      };
    }
    default:
      return state;
  }
}
