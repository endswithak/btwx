import {
  OPEN_TEXT_EDITOR,
  CLOSE_TEXT_EDITOR,
  TextEditorTypes,
} from '../actionTypes/textEditor';

export interface TextEditorState {
  isOpen: boolean;
  layer: string;
  text: string;
  scale: number;
  x: number;
  y: number;
  textStyle: em.TextStyle;
}

const initialState: TextEditorState = {
  isOpen: false,
  layer: null,
  text: null,
  scale: null,
  x: null,
  y: null,
  textStyle: {
    fillColor: '#000000',
    fontSize: 12,
    leading: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    justification: 'left'
  }
};

export default (state = initialState, action: TextEditorTypes): TextEditorState => {
  switch (action.type) {
    case OPEN_TEXT_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        text: action.payload.text,
        scale: action.payload.scale,
        x: action.payload.x,
        y: action.payload.y,
        textStyle: {
          ...state.textStyle,
          ...action.payload.textStyle
        }
      };
    }
    case CLOSE_TEXT_EDITOR: {
      return {
        ...state,
        isOpen: false
      };
    }
    default:
      return state;
  }
}
