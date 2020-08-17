import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  SAVE_DOCUMENT,
  DocumentSettingsTypes,
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
  images: {
    allIds: string[];
    byId: {
      [id: string]: em.DocumentImage;
    };
  };
  edit: string;
}

const initialState: DocumentSettingsState = {
  id: null,
  name: 'Untitled',
  path: null,
  images: {
    allIds: [],
    byId: {}
  },
  edit: null
};

export default (state = initialState, action: DocumentSettingsTypes): DocumentSettingsState => {
  switch (action.type) {
    case SAVE_DOCUMENT_AS: {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        edit: action.payload.edit
      };
    }
    case SAVE_DOCUMENT: {
      return {
        ...state,
        edit: action.payload.edit
      };
    }
    case ADD_DOCUMENT_IMAGE: {
      return {
        ...state,
        images: {
          ...state.images,
          allIds: [...state.images.allIds, action.payload.id],
          byId: {
            ...state.images.byId,
            [action.payload.id]: action.payload
          }
        }
      };
    }
    default:
      return state;
  }
}
