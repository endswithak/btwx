import {
  SET_SELECTION_TOOL_BOUNDS,
  SET_SELECTION_TOOL_HANDLE,
  SET_SELECTION_TOOL,
  SET_SELECTION_TOOL_LINE_FROM_POINT,
  SET_SELECTION_TOOL_LINE_TO_POINT,
  SelectionToolTypes,
} from '../actionTypes/selectionTool';

export interface SelectionToolState {
  bounds: number[];
  handle: Btwx.SelectionToolHandle;
  lineFromPoint: number[];
  lineToPoint: number[];
}

const initialState: SelectionToolState = {
  bounds: null,
  handle: null,
  lineFromPoint: null,
  lineToPoint: null
};

export default (state = initialState, action: SelectionToolTypes): SelectionToolState => {
  switch (action.type) {
    case SET_SELECTION_TOOL_BOUNDS: {
      return {
        ...state,
        bounds: action.payload.bounds
      };
    }
    case SET_SELECTION_TOOL_HANDLE: {
      return {
        ...state,
        handle: action.payload.handle
      };
    }
    case SET_SELECTION_TOOL: {
      return {
        ...state,
        ...action.payload
      };
    }
    case SET_SELECTION_TOOL_LINE_FROM_POINT: {
      return {
        ...state,
        lineFromPoint: action.payload.lineFromPoint
      };
    }
    case SET_SELECTION_TOOL_LINE_TO_POINT: {
      return {
        ...state,
        lineToPoint: action.payload.lineToPoint
      };
    }
    default:
      return state;
  }
}
