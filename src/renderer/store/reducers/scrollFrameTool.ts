import {
  ENABLE_SCROLL_FRAME_TOOL,
  DISABLE_SCROLL_FRAME_TOOL,
  SET_SCROLL_FRAME_TOOL_ID,
  ScrollFrameToolTypes,
} from '../actionTypes/scrollFrameTool';

export interface ScrollFrameToolState {
  isEnabled: boolean;
  id: string;
}

const initialState: ScrollFrameToolState = {
  isEnabled: false,
  id: null
};

export default (state = initialState, action: ScrollFrameToolTypes): ScrollFrameToolState => {
  switch (action.type) {
    case ENABLE_SCROLL_FRAME_TOOL: {
      return {
        ...state,
        isEnabled: true,
        id: action.payload.id
      };
    }
    case DISABLE_SCROLL_FRAME_TOOL: {
      return {
        ...state,
        isEnabled: false,
        id: null
      };
    }
    case SET_SCROLL_FRAME_TOOL_ID: {
      return {
        ...state,
        id: action.payload.id
      };
    }
    default:
      return state;
  }
}
