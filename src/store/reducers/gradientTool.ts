import {
  ENABLE_GRADIENT_TOOL,
  DISABLE_GRADIENT_TOOL,
  GradientToolTypes,
} from '../actionTypes/gradientTool';

export interface GradientToolState {
  isEnabled: boolean;
  handle: em.GradientHandle;
}

const initialState: GradientToolState = {
  isEnabled: false,
  handle: null
};

export default (state = initialState, action: GradientToolTypes): GradientToolState => {
  switch (action.type) {
    case ENABLE_GRADIENT_TOOL: {
      return {
        ...state,
        isEnabled: true,
        handle: action.payload.handle
      };
    }
    case DISABLE_GRADIENT_TOOL: {
      return {
        ...state,
        isEnabled: false,
        handle: null
      };
    }
    default:
      return state;
  }
}
