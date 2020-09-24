import {
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  SET_SELECTION_TOOL_RESIZE_TYPE,
  SelectionToolTypes,
} from '../actionTypes/selectionTool';

export interface SelectionToolState {
  isEnabled: boolean;
  resizeType: em.ResizeType;
}

const initialState: SelectionToolState = {
  isEnabled: false,
  resizeType: null
};

export default (state = initialState, action: SelectionToolTypes): SelectionToolState => {
  switch (action.type) {
    case ENABLE_SELECTION_TOOL: {
      return {
        ...state,
        isEnabled: true,
        resizeType: action.payload.resizeType ? action.payload.resizeType : state.resizeType
      };
    }
    case DISABLE_SELECTION_TOOL: {
      return {
        ...state,
        isEnabled: false,
        resizeType: null
      };
    }
    case SET_SELECTION_TOOL_RESIZE_TYPE: {
      return {
        ...state,
        resizeType: action.payload.resizeType
      };
    }
    default:
      return state;
  }
}
