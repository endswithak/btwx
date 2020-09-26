import {
  ENABLE_RESIZE_TOOL,
  DISABLE_RESIZE_TOOL,
  ResizeToolTypes,
} from '../actionTypes/resizeTool';

export interface ResizeToolState {
  isEnabled: boolean;
  handle: em.ResizeHandle;
  cursor: em.ResizeType;
}

const initialState: ResizeToolState = {
  isEnabled: false,
  handle: null,
  cursor: null
};

export default (state = initialState, action: ResizeToolTypes): ResizeToolState => {
  switch (action.type) {
    case ENABLE_RESIZE_TOOL: {
      return {
        ...state,
        isEnabled: true,
        handle: action.payload.handle,
        cursor: (() => {
          switch(action.payload.handle) {
            case 'topLeft':
            case 'bottomRight':
              return 'nwse';
            case 'topRight':
            case 'bottomLeft':
              return 'nesw';
            case 'topCenter':
            case 'bottomCenter':
              return 'ns';
            case 'leftCenter':
            case 'rightCenter':
              return 'ew';
          }
        })() as em.ResizeType
      };
    }
    case DISABLE_RESIZE_TOOL: {
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
