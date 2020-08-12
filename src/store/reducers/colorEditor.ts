import {
  OPEN_COLOR_EDITOR,
  CLOSE_COLOR_EDITOR,
  ColorEditorTypes,
} from '../actionTypes/colorEditor';

export interface ColorEditorState {
  isOpen: boolean;
  layers: string[];
  prop: 'stroke' | 'fill' | 'shadow';
  x: number;
  y: number;
}

const initialState: ColorEditorState = {
  isOpen: false,
  layers: null,
  prop: null,
  x: null,
  y: null
};

export default (state = initialState, action: ColorEditorTypes): ColorEditorState => {
  switch (action.type) {
    case OPEN_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layers: action.payload.layers,
        prop: action.payload.prop,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: false,
        layers: null,
        x: null,
        y: null,
        prop: null
      };
    }
    default:
      return state;
  }
}
