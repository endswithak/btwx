import {
  OPEN_FILL_COLOR_EDITOR,
  CLOSE_FILL_COLOR_EDITOR,
  FillColorEditorTypes,
} from '../actionTypes/fillColorEditor';

export interface FillColorEditorState {
  isOpen: boolean;
  layer: string;
  color: string;
  x: number;
  y: number;
}

const initialState: FillColorEditorState = {
  isOpen: false,
  layer: null,
  color: null,
  x: null,
  y: null
};

export default (state = initialState, action: FillColorEditorTypes): FillColorEditorState => {
  switch (action.type) {
    case OPEN_FILL_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        color: action.payload.color,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FILL_COLOR_EDITOR: {
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
