import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import { DEFAULT_DEVICE_ORIENTATION } from '../../constants';

import {
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  ArtboardPresetsTypes
} from '../actionTypes/artboardPresets';

export interface ArtboardPresetsState {
  allIds: string[];
  byId: {
    [id: string]: Btwx.ArtboardPreset;
  };
  orientation: Btwx.DeviceOrientationType;
  platform: Btwx.DevicePlatformType;
}

export const initialState: ArtboardPresetsState = {
  allIds: [],
  byId: {},
  orientation: DEFAULT_DEVICE_ORIENTATION,
  platform: remote.process.platform === 'darwin' ? 'Apple' : 'Android'
};

export default (state = initialState, action: ArtboardPresetsTypes): ArtboardPresetsState => {
  switch (action.type) {
    case ADD_ARTBOARD_PRESET: {
      return {
        ...state,
        allIds: addItem(state.allIds, action.payload.id),
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload,
            category: 'Custom'
          }
        }
      };
    }
    case REMOVE_ARTBOARD_PRESET: {
      return {
        ...state,
        allIds: removeItem(state.allIds, action.payload.id),
        byId: Object.keys(state.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
          if (id !== action.payload.id) {
            result[id] = state.byId[id];
          }
          return result;
        }, {})
      };
    }
    case UPDATE_ARTBOARD_PRESET: {
      return {
        ...state,
        byId: Object.keys(state.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
          if (id !== action.payload.id) {
            result[id] = state.byId[id];
          } else {
            result[id] = {
              ...action.payload,
              category: 'Custom'
            };
          }
          return result;
        }, {})
      };
    }
    case SET_ARTBOARD_PRESET_DEVICE_ORIENTATION: {
      return {
        ...state,
        orientation: action.payload.orientation
      };
    }
    case SET_ARTBOARD_PRESET_DEVICE_PLATFORM: {
      return {
        ...state,
        platform: action.payload.platform
      };
    }
    default:
      return state;
  }
}
