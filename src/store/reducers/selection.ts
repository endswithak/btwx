import {
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  SET_GROUP_SCOPE,
  SelectionTypes
} from '../actionTypes/selection';

export interface SelectionState {
  allIds: string[];
  groupScope: string;
}

const initialState: SelectionState = {
  allIds: [],
  groupScope: null
};

export default (state = initialState, action: SelectionTypes): SelectionState => {
  switch (action.type) {
    case ADD_TO_SELECTION: {
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id]
      };
    }
    case REMOVE_FROM_SELECTION: {
      return {
        ...state,
        allIds: state.allIds.filter(id => id !== action.payload.id)
      };
    }
    case SET_GROUP_SCOPE: {
      return {
        ...state,
        groupScope: action.payload.id
      };
    }
    default:
      return state;
  }
}
