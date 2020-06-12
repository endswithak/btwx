import {
  OPEN_COLOR_EDITOR,
  CLOSE_COLOR_EDITOR,
  ColorEditorTypes,
} from '../actionTypes/colorEditor';

export interface ColorEditorState {
  isOpen: boolean;
  layer: string;
  color: string;
  //prop: em.ColorEditorProp;
  x: number;
  y: number;
  onChange?(color: string): void;
  onClose?(color: string): void;
}

const initialState: ColorEditorState = {
  isOpen: false,
  layer: null,
  color: null,
  //prop: null,
  x: null,
  y: null,
  onChange: null,
  onClose: null
};

export default (state = initialState, action: ColorEditorTypes): ColorEditorState => {
  switch (action.type) {
    case OPEN_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        color: action.payload.color,
        //prop: action.payload.prop,
        x: action.payload.x,
        y: action.payload.y,
        onChange: action.payload.onChange,
        onClose: action.payload.onClose
      };
    }
    case CLOSE_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layer: null,
        color: null,
        x: null,
        y: null,
        //prop: null
      };
    }
    default:
      return state;
  }
}
