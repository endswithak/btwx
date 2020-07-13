import {
  OPEN_FILL_RADIAL_GRADIENT_EDITOR,
  CLOSE_FILL_RADIAL_GRADIENT_EDITOR,
  FillRadialGradientEditorTypes,
} from '../actionTypes/fillRadialGradientEditor';

export interface FillRadialGradientEditorState {
  isOpen: boolean;
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

const initialState: FillRadialGradientEditorState = {
  isOpen: false,
  layer: null,
  gradient: null,
  x: null,
  y: null
};

export default (state = initialState, action: FillRadialGradientEditorTypes): FillRadialGradientEditorState => {
  switch (action.type) {
    case OPEN_FILL_RADIAL_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        gradient: action.payload.gradient,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FILL_RADIAL_GRADIENT_EDITOR: {
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
