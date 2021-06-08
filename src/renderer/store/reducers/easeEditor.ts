import {
  OPEN_EASE_EDITOR,
  CLOSE_EASE_EDITOR,
  EaseEditorTypes,
} from '../actionTypes/easeEditor';

export interface EaseEditorState {
  isOpen: boolean;
  tween: string;
}

const initialState: EaseEditorState = {
  isOpen: false,
  tween: null
};

export default (state = initialState, action: EaseEditorTypes): EaseEditorState => {
  switch (action.type) {
    case OPEN_EASE_EDITOR: {
      return {
        ...state,
        isOpen: true,
        tween: action.payload.tween
      };
    }
    case CLOSE_EASE_EDITOR: {
      return {
        ...state,
        isOpen: false,
        tween: null
      };
    }
    default:
      return state;
  }
}
