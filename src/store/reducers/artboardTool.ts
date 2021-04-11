import {
  ENABLE_ARTBOARD_TOOL,
  DISABLE_ARTBOARD_TOOL,
  ArtboardToolTypes,
} from '../actionTypes/artboardTool';

export interface ArtboardToolState {
  isEnabled: boolean;
}

const initialState: ArtboardToolState = {
  isEnabled: false,
};

export default (state = initialState, action: ArtboardToolTypes): ArtboardToolState => {
  switch (action.type) {
    case ENABLE_ARTBOARD_TOOL: {
      return {
        ...state,
        isEnabled: true
      };
    }
    case DISABLE_ARTBOARD_TOOL: {
      return {
        ...state,
        isEnabled: false
      };
    }
    default:
      return state;
  }
}
