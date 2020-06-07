import {
  SET_CANVAS_MATRIX,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  matrix: number[];
}

const initialState: CanvasSettingsState = {
  matrix: null
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix
      };
    }
    default:
      return state;
  }
}
