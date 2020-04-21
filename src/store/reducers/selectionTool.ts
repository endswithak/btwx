import { ENABLE_SELECTION_TOOL, DISABLE_SELECTION_TOOL, SelectionToolTypes } from '../actionTypes/selectionTool';
import SelectionTool from '../../canvas/selectionTool';

export interface SelectionToolState {
  selectionTool: SelectionTool;
}

const initialState: SelectionToolState = {
  selectionTool: null
};

export default (state = initialState, action: SelectionToolTypes): SelectionToolState => {
  switch (action.type) {
    case ENABLE_SELECTION_TOOL: {
      return {
        ...state,
        selectionTool: new SelectionTool()
      };
    }
    case DISABLE_SELECTION_TOOL: {
      state.selectionTool.tool.remove();
      return {
        ...state,
        selectionTool: null
      };
    }
    default:
      return state;
  }
}
