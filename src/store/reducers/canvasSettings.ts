import { addItem, removeItem } from '../utils/general';

import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
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
  zooming: boolean;
}

const initialState: CanvasSettingsState = {
  matrix: null,
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
  zooming: false
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
    case ADD_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          allIds: addItem(state.artboardPresets.allIds, action.payload.id),
          byId: {
            ...state.artboardPresets.byId,
            [action.payload.id]: action.payload
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
              result[id] = action.payload;
            }
            return result;
          }, {})
        }
      };
    }
    default:
      return state;
  }
}
