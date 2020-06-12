import {
  OPEN_FILL_EDITOR,
  CLOSE_FILL_EDITOR,
  FillEditorTypes,
} from '../actionTypes/fillEditor';

export interface FillEditorState {
  isOpen: boolean;
  layer: string;
  fill: em.Fill;
  x: number;
  y: number;
  onChange?(fill: em.Fill): void;
  onClose?(fill: em.Fill): void;
}

const initialState: FillEditorState = {
  isOpen: false,
  layer: null,
  fill: null,
  x: null,
  y: null,
  onChange: null,
  onClose: null
};

export default (state = initialState, action: FillEditorTypes): FillEditorState => {
  switch (action.type) {
    case OPEN_FILL_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        fill: action.payload.fill,
        x: action.payload.x,
        y: action.payload.y,
        onChange: action.payload.onChange,
        onClose: action.payload.onClose
      };
    }
    case CLOSE_FILL_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layer: null,
        fill: null,
        x: null,
        y: null
      };
    }
    default:
      return state;
  }
}
