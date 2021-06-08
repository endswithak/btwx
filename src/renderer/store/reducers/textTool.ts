import {
  ENABLE_TEXT_TOOL,
  DISABLE_TEXT_TOOL,
  TextToolTypes,
} from '../actionTypes/textTool';

export interface TextToolState {
  isEnabled: boolean;
}

const initialState: TextToolState = {
  isEnabled: false,
};

export default (state = initialState, action: TextToolTypes): TextToolState => {
  switch (action.type) {
    case ENABLE_TEXT_TOOL: {
      return {
        ...state,
        isEnabled: true
      };
    }
    case DISABLE_TEXT_TOOL: {
      return {
        ...state,
        isEnabled: false
      };
    }
    default:
      return state;
  }
}
