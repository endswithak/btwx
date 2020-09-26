import {
  ENABLE_AREA_SELECT_TOOL,
  DISABLE_AREA_SELECT_TOOL,
  AreaSelectToolTypes,
} from '../actionTypes/areaSelectTool';

export interface AreaSelectToolState {
  isEnabled: boolean;
}

const initialState: AreaSelectToolState = {
  isEnabled: false
};

export default (state = initialState, action: AreaSelectToolTypes): AreaSelectToolState => {
  switch (action.type) {
    case ENABLE_AREA_SELECT_TOOL: {
      return {
        ...state,
        isEnabled: true
      };
    }
    case DISABLE_AREA_SELECT_TOOL: {
      return {
        ...state,
        isEnabled: false
      };
    }
    default:
      return state;
  }
}
