import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import { DEFAULT_LEFT_SIDEBAR_WIDTH, DEFAULT_RIGHT_SIDEBAR_WIDTH, DEFAULT_TWEEN_DRAWER_HEIGHT, DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH, DEFAULT_COLOR_FORMAT } from '../../constants';

import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  SAVE_DOCUMENT,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  DocumentSettingsTypes,
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
  matrix: number[];
  artboardPresets: {
    allIds: string[];
    byId: {
      [id: string]: em.ArtboardPreset;
    };
  };
  images: {
    allIds: string[];
    byId: {
      [id: string]: em.DocumentImage;
    };
  };
  colorFormat: em.ColorFormat;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  tweenDrawerHeight: number;
  tweenDrawerLayersWidth: number;
  edit: string;
}

const initialState: DocumentSettingsState = {
  id: null,
  name: 'Untitled',
  path: null,
  matrix: [1, 0, 0, 1, 0, 0],
  artboardPresets: {
    allIds: [],
    byId: {}
  },
  images: {
    allIds: [],
    byId: {}
  },
  colorFormat: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('colorFormat', 'string') : DEFAULT_COLOR_FORMAT,
  leftSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('leftSidebarWidth', 'integer') : DEFAULT_LEFT_SIDEBAR_WIDTH,
  rightSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('rightSidebarWidth', 'integer') : DEFAULT_RIGHT_SIDEBAR_WIDTH,
  tweenDrawerHeight: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT,
  tweenDrawerLayersWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer') : DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
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
        matrix: action.payload.matrix
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
    case ADD_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          allIds: addItem(state.artboardPresets.allIds, action.payload.id),
          byId: {
            ...state.artboardPresets.byId,
            [action.payload.id]: {
              ...action.payload,
              category: 'Custom'
            }
          }
        }
      };
    }
    case REMOVE_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          allIds: removeItem(state.artboardPresets.allIds, action.payload.id),
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: em.ArtboardPreset }, id) => {
            if (id !== action.payload.id) {
              result[id] = state.artboardPresets.byId[id];
            }
            return result;
          }, {})
        }
      };
    }
    case UPDATE_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: em.ArtboardPreset }, id) => {
            if (id !== action.payload.id) {
              result[id] = state.artboardPresets.byId[id];
            } else {
              result[id] = {
                ...action.payload,
                category: 'Custom'
              };
            }
            return result;
          }, {})
        }
      };
    }
    case SET_LEFT_SIDEBAR_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('leftSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        leftSidebarWidth: action.payload.width
      };
    }
    case SET_RIGHT_SIDEBAR_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('rightSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        rightSidebarWidth: action.payload.width
      };
    }
    case SET_TWEEN_DRAWER_HEIGHT: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', parseInt(action.payload.height as any) as any);
      }
      return {
        ...state,
        tweenDrawerHeight: action.payload.height
      };
    }
    case SET_TWEEN_DRAWER_LAYERS_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('tweenDrawerLayersWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        tweenDrawerLayersWidth: action.payload.width
      };
    }
    default:
      return state;
  }
}
