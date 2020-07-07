import {
  SET_CANVAS_MATRIX,
  ADD_CANVAS_IMAGE,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  matrix: number[];
  allImageIds: string[];
  imageById: {
    [id: string]: em.CanvasImage;
  };
}

const initialState: CanvasSettingsState = {
  matrix: null,
  allImageIds: [],
  imageById: {}
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
    default:
      return state;
  }
}
