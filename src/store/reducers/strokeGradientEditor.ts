import {
  OPEN_STROKE_GRADIENT_EDITOR,
  CLOSE_STROKE_GRADIENT_EDITOR,
  StrokeGradientEditorTypes,
} from '../actionTypes/strokeGradientEditor';

export interface StrokeGradientEditorState {
  isOpen: boolean;
  layer: string;
  gradient: em.Gradient;
  x: number;
  y: number;
}

const initialState: StrokeGradientEditorState = {
  isOpen: false,
  layer: null,
  gradient: null,
  x: null,
  y: null
};

export default (state = initialState, action: StrokeGradientEditorTypes): StrokeGradientEditorState => {
  switch (action.type) {
    case OPEN_STROKE_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        gradient: action.payload.gradient,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_STROKE_GRADIENT_EDITOR: {
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
