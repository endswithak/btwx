import {
  OPEN_FILL_GRADIENT_EDITOR,
  CLOSE_FILL_GRADIENT_EDITOR,
  FillGradientEditorTypes,
} from '../actionTypes/fillGradientEditor';

export interface FillGradientEditorState {
  isOpen: boolean;
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

const initialState: FillGradientEditorState = {
  isOpen: false,
  layer: null,
  gradient: null,
  x: null,
  y: null
};

export default (state = initialState, action: FillGradientEditorTypes): FillGradientEditorState => {
  switch (action.type) {
    case OPEN_FILL_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        gradient: action.payload.gradient,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FILL_GRADIENT_EDITOR: {
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
