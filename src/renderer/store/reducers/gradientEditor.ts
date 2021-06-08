import {
  OPEN_GRADIENT_EDITOR,
  CLOSE_GRADIENT_EDITOR,
  GradientEditorTypes,
} from '../actionTypes/gradientEditor';

export interface GradientEditorState {
  isOpen: boolean;
  prop: 'stroke' | 'fill';
  x: number;
  y: number;
}

const initialState: GradientEditorState = {
  isOpen: false,
  prop: null,
  x: null,
  y: null
};

export default (state = initialState, action: GradientEditorTypes): GradientEditorState => {
  switch (action.type) {
    case OPEN_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        prop: action.payload.prop,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_GRADIENT_EDITOR: {
      return {
        ...state,
        isOpen: false,
        prop: null,
        x: null,
        y: null
      };
    }
    default:
      return state;
  }
}
