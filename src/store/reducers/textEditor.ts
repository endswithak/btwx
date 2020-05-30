import {
  OPEN_TEXT_EDITOR,
  CLOSE_TEXT_EDITOR,
  TextEditorTypes,
} from '../actionTypes/textEditor';

export interface TextEditorState {
  isOpen: boolean;
  layer: string;
  x: number;
  y: number;
}

const initialState: TextEditorState = {
  isOpen: false,
  layer: null,
  x: null,
  y: null
};

export default (state = initialState, action: TextEditorTypes): TextEditorState => {
  switch (action.type) {
    case OPEN_TEXT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_TEXT_EDITOR: {
      return {
        ...state,
        ...initialState
      };
    }
    default:
      return state;
  }
}
