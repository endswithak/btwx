import {
  ENABLE_DRAG_TOOL,
  DISABLE_DRAG_TOOL,
  DragToolTypes,
} from '../actionTypes/dragTool';

export interface DragToolState {
  isEnabled: boolean;
  handle: boolean;
}

const initialState: DragToolState = {
  isEnabled: false,
  handle: false
};

export default (state = initialState, action: DragToolTypes): DragToolState => {
  switch (action.type) {
    case ENABLE_DRAG_TOOL: {
      return {
        ...state,
        isEnabled: true,
        handle: action.payload.handle
      };
    }
    case DISABLE_DRAG_TOOL: {
      return {
        ...state,
        isEnabled: false,
        handle: false
      };
    }
    default:
      return state;
  }
}
