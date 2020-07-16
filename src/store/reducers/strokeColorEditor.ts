import {
  OPEN_STROKE_COLOR_EDITOR,
  CLOSE_STROKE_COLOR_EDITOR,
  StrokeColorEditorTypes,
} from '../actionTypes/strokeColorEditor';

export interface StrokeColorEditorState {
  isOpen: boolean;
  layer: string;
  color: em.Color;
  x: number;
  y: number;
}

const initialState: StrokeColorEditorState = {
  isOpen: false,
  layer: null,
  color: null,
  x: null,
  y: null
};

export default (state = initialState, action: StrokeColorEditorTypes): StrokeColorEditorState => {
  switch (action.type) {
    case OPEN_STROKE_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        color: action.payload.color,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_STROKE_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layer: null,
        color: null,
        x: null,
        y: null
      };
    }
    default:
      return state;
  }
}
