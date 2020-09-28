import {
  ENABLE_TRANSLATE_TOOL,
  DISABLE_TRANSLATE_TOOL,
  TranslateToolTypes,
} from '../actionTypes/translateTool';

export interface TranslateToolState {
  isEnabled: boolean;
}

const initialState: TranslateToolState = {
  isEnabled: false
};

export default (state = initialState, action: TranslateToolTypes): TranslateToolState => {
  switch (action.type) {
    case ENABLE_TRANSLATE_TOOL: {
      return {
        ...state,
        isEnabled: true
      };
    }
    case DISABLE_TRANSLATE_TOOL: {
      return {
        ...state,
        isEnabled: false
      };
    }
    default:
      return state;
  }
}
