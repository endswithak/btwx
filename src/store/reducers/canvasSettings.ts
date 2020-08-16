import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import { DEFAULT_LEFT_SIDEBAR_WIDTH, DEFAULT_RIGHT_SIDEBAR_WIDTH, DEFAULT_TWEEN_DRAWER_HEIGHT } from '../../constants';

import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_CANVAS_MEASURING,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  matrix: number[];
  images: {
    allIds: string[];
    byId: {
      [id: string]: em.CanvasImage;
    };
  };
  artboardPresets: {
    allIds: string[];
    byId: {
      [id: string]: em.ArtboardPreset;
    };
    editing: string;
  };
  resizing: boolean;
  dragging: boolean;
  measuring: boolean;
  zooming: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  tweenDrawerHeight: number;
}

const initialState: CanvasSettingsState = {
  matrix: [1, 0, 0, 1, 0, 0],
  artboardPresets: {
    allIds: [],
    byId: {},
    editing: null
  },
  images: {
    allIds: [],
    byId: {}
  },
  resizing: false,
  dragging: false,
  measuring: false,
  zooming: false,
  leftSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('leftSidebarWidth', 'integer') : DEFAULT_LEFT_SIDEBAR_WIDTH,
  rightSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('rightSidebarWidth', 'integer') : DEFAULT_RIGHT_SIDEBAR_WIDTH,
  tweenDrawerHeight: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix
      };
    }
    case ADD_CANVAS_IMAGE: {
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
    case SET_CANVAS_RESIZING: {
      return {
        ...state,
        resizing: action.payload.resizing
      };
    }
    case SET_CANVAS_DRAGGING: {
      return {
        ...state,
        dragging: action.payload.dragging
      };
    }
    case SET_CANVAS_ZOOMING: {
      return {
        ...state,
        zooming: action.payload.zooming
      };
    }
    case SET_CANVAS_MEASURING: {
      return {
        ...state,
        measuring: action.payload.measuring
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
          editing: null,
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
    default:
      return state;
  }
}
