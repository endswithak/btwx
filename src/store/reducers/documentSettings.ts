import { remote } from 'electron';
import { DEFAULT_COLOR_FORMAT } from '../../constants';

import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  SAVE_DOCUMENT,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
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
  path: null,
  zoom: 1,
  matrix: [1, 0, 0, 1, 0, 0],
  images: {
    allIds: [],
    byId: {}
  },
  colorFormat: DEFAULT_COLOR_FORMAT,
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
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix,
        zoom: action.payload.matrix[0]
      };
    }
    case SET_CANVAS_COLOR_FORMAT: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('colorFormat', 'string', action.payload.colorFormat);
      }
      return {
        ...state,
        colorFormat: action.payload.colorFormat
      };
    }
    default:
      return state;
  }
}
