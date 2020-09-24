import {
  ENABLE_ZOOM_TOOL,
  DISABLE_ZOOM_TOOL,
  SET_ZOOM_TOOL_TYPE,
  ZoomToolTypes,
} from '../actionTypes/zoomTool';

export interface ZoomToolState {
  isEnabled: boolean;
  zoomType: em.ZoomType;
}

const initialState: ZoomToolState = {
  isEnabled: false,
  zoomType: null
};

export default (state = initialState, action: ZoomToolTypes): ZoomToolState => {
  switch (action.type) {
    case ENABLE_ZOOM_TOOL: {
      return {
        ...state,
        isEnabled: true,
        zoomType: action.payload.zoomType
      };
    }
    case DISABLE_ZOOM_TOOL: {
      return {
        ...state,
        isEnabled: false,
        zoomType: null
      };
    }
    case SET_ZOOM_TOOL_TYPE: {
      return {
        ...state,
        zoomType: action.payload.zoomType
      };
    }
    default:
      return state;
  }
}
