import {
  OPEN_FILL_LINEAR_GRADIENT_EDITOR,
  CLOSE_FILL_LINEAR_GRADIENT_EDITOR,
  FillLinearGradientEditorTypes,
} from '../actionTypes/fillLinearGradientEditor';

export interface FillLinearGradientEditorState {
  isOpen: boolean;
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

const initialState: FillLinearGradientEditorState = {
  isOpen: false,
  layer: null,
  gradient: null,
  x: null,
  y: null
};

export default (state = initialState, action: FillLinearGradientEditorTypes): FillLinearGradientEditorState => {
  switch (action.type) {
    case OPEN_FILL_LINEAR_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        gradient: action.payload.gradient,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FILL_LINEAR_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layer: null,
        gradient: null,
        x: null,
        y: null
      };
    }
    default:
      return state;
  }
}
