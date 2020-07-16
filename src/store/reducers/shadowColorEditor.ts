import {
  OPEN_SHADOW_COLOR_EDITOR,
  CLOSE_SHADOW_COLOR_EDITOR,
  ShadowColorEditorTypes,
} from '../actionTypes/shadowColorEditor';

export interface ShadowColorEditorState {
  isOpen: boolean;
  layer: string;
  color: em.Color;
  x: number;
  y: number;
}

const initialState: ShadowColorEditorState = {
  isOpen: false,
  layer: null,
  color: null,
  x: null,
  y: null
};

export default (state = initialState, action: ShadowColorEditorTypes): ShadowColorEditorState => {
  switch (action.type) {
    case OPEN_SHADOW_COLOR_EDITOR: {
      return {
        ...state,
        isOpen: true,
        layer: action.payload.layer,
        color: action.payload.color,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_SHADOW_COLOR_EDITOR: {
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
