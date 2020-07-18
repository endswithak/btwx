import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  matrix: number[];
  allImageIds: string[];
  imageById: {
    [id: string]: em.CanvasImage;
  };
  resizing: boolean;
  dragging: boolean;
  zooming: boolean;
}

const initialState: CanvasSettingsState = {
  matrix: null,
  allImageIds: [],
  imageById: {},
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
        allImageIds: [...state.allImageIds, action.payload.id],
        imageById: {
          ...state.imageById,
          [action.payload.id]: {
            id: action.payload.id,
            buffer: action.payload.buffer
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
    default:
      return state;
  }
}
