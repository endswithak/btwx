import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import { DEFAULT_LEFT_SIDEBAR_WIDTH, DEFAULT_RIGHT_SIDEBAR_WIDTH, DEFAULT_TWEEN_DRAWER_HEIGHT, DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH } from '../../constants';
console.log(remote.systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer'));
import {
  SET_CANVAS_MATRIX,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_ZOOMING_TYPE,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  SET_CANVAS_MEASURING,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  matrix: number[];
  artboardPresets: {
    allIds: string[];
    byId: {
      [id: string]: em.ArtboardPreset;
    };
    editing: string;
  };
  resizing: boolean;
  resizingType: em.ResizingType;
  dragging: boolean;
  selecting: boolean;
  measuring: boolean;
  zooming: boolean;
  zoomingType: em.ZoomingType;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  tweenDrawerHeight: number;
  tweenDrawerLayersWidth: number;
}

const initialState: CanvasSettingsState = {
  matrix: [1, 0, 0, 1, 0, 0],
  artboardPresets: {
    allIds: [],
    byId: {},
    editing: null
  },
  resizing: false,
  resizingType: null,
  dragging: false,
  selecting: false,
  measuring: false,
  zooming: false,
  zoomingType: null,
  leftSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('leftSidebarWidth', 'integer') : DEFAULT_LEFT_SIDEBAR_WIDTH,
  rightSidebarWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('rightSidebarWidth', 'integer') : DEFAULT_RIGHT_SIDEBAR_WIDTH,
  tweenDrawerHeight: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT,
  tweenDrawerLayersWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer') : DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix
      };
    }
    case SET_CANVAS_RESIZING: {
      return {
        ...state,
        resizing: action.payload.resizing,
        resizingType: action.payload.resizingType ? action.payload.resizingType : null
      };
    }
    case SET_CANVAS_SELECTING: {
      return {
        ...state,
        selecting: action.payload.selecting
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
        zooming: action.payload.zooming,
        zoomingType: action.payload.zoomingType ? action.payload.zoomingType : null
      };
    }
    case SET_CANVAS_ZOOMING_TYPE: {
      return {
        ...state,
        zoomingType: action.payload.zoomingType
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
