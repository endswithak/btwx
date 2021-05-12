import { DEFAULT_COLOR_FORMAT } from '../../constants';
import { removeItem, addItem } from '../utils/general';

import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  REMOVE_DOCUMENT_IMAGE,
  REMOVE_DOCUMENT_IMAGES,
  SAVE_DOCUMENT,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

import { RemoveDocumentImage } from '../actionTypes/documentSettings';
import { removeDocumentImage as removeDocumentImageAction } from '../actions/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  zoom: number;
  matrix: number[];
  images: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.DocumentImage;
    };
  };
  colorFormat: Btwx.ColorFormat;
  edit: string;
}

export const initialState: DocumentSettingsState = {
  id: null,
  name: 'Untitled',
  zoom: 1,
  matrix: [1, 0, 0, 1, 0, 0],
  images: {
    allIds: [],
    byId: {}
  },
  colorFormat: DEFAULT_COLOR_FORMAT,
  edit: null
};

const removeDocumentImage = (state: DocumentSettingsState, action: RemoveDocumentImage): DocumentSettingsState => {
  return {
    ...state,
    images: {
      ...state.images,
      allIds: removeItem(state.images.allIds, action.payload.id),
      byId: Object.keys(state.images.byId).reduce((result, current) => {
        if (current !== action.payload.id) {
          result = {
            ...result,
            [current]: state.images.byId[current]
          }
        }
        return result;
      }, {})
    }
  };
}

export default (state = initialState, action: DocumentSettingsTypes): DocumentSettingsState => {
  switch (action.type) {
    case SAVE_DOCUMENT_AS: {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
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
          allIds: addItem(state.images.allIds, action.payload.id),
          byId: {
            ...state.images.byId,
            [action.payload.id]: action.payload
          }
        }
      };
    }
    case REMOVE_DOCUMENT_IMAGE: {
      return removeDocumentImage(state, action);
    }
    case REMOVE_DOCUMENT_IMAGES: {
      return action.payload.images.reduce((result, current) => {
        return removeDocumentImage(result, removeDocumentImageAction({
          id: current
        }) as RemoveDocumentImage);
      }, state);
    }
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix,
        zoom: action.payload.matrix[0]
      };
    }
    case SET_CANVAS_COLOR_FORMAT: {
      return {
        ...state,
        colorFormat: action.payload.colorFormat
      };
    }
    default:
      return state;
  }
}
