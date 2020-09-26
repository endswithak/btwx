import {
  ENABLE_LINE_TOOL,
  DISABLE_LINE_TOOL,
  LineToolTypes,
} from '../actionTypes/lineTool';

export interface LineToolState {
  isEnabled: boolean;
  handle: em.LineHandle;
  cursor: em.ResizeType;
}

const initialState: LineToolState = {
  isEnabled: false,
  handle: null,
  cursor: null
};

export default (state = initialState, action: LineToolTypes): LineToolState => {
  switch (action.type) {
    case ENABLE_LINE_TOOL: {
      return {
        ...state,
        isEnabled: true,
        handle: action.payload.handle,
        cursor: 'ew'
      };
    }
    case DISABLE_LINE_TOOL: {
      return {
        ...state,
        isEnabled: false,
        handle: null,
        cursor: null
      };
    }
    default:
      return state;
  }
}
