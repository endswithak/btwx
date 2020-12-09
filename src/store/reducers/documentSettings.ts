import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import { DEFAULT_COLOR_FORMAT, DEFAULT_DEVICE_ORIENTATION } from '../../constants';

import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  SAVE_DOCUMENT,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
  zoom: number;
  matrix: number[];
  artboardPresets: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.ArtboardPreset;
    };
    orientation: Btwx.DeviceOrientationType;
    platform: Btwx.DevicePlatformType;
  };
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
  artboardPresets: {
    allIds: [],
    byId: {},
    orientation: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('artboardPresetDeviceOrientation', 'string') : DEFAULT_DEVICE_ORIENTATION,
    platform: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('artboardPresetDevicePlatform', 'string') : 'Android'
  },
  images: {
    allIds: [],
    byId: {}
  },
  colorFormat: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('colorFormat', 'string') : DEFAULT_COLOR_FORMAT,
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
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
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
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
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
    case SET_ARTBOARD_PRESET_DEVICE_ORIENTATION: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('artboardPresetDeviceOrientation', 'string', action.payload.orientation);
      }
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          orientation: action.payload.orientation
        }
      };
    }
    case SET_ARTBOARD_PRESET_DEVICE_PLATFORM: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('artboardPresetDevicePlatform', 'string', action.payload.platform);
      }
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          platform: action.payload.platform
        }
      };
    }
    default:
      return state;
  }
}
