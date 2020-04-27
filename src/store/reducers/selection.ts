import {
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  SelectionTypes
} from '../actionTypes/selection';

export type SelectionState = string[];

const initialState: SelectionState = [];

export default (state = initialState, action: SelectionTypes): SelectionState => {
  switch (action.type) {
    case ADD_TO_SELECTION: {
      return [...state, action.payload.id];
    }
    case REMOVE_FROM_SELECTION: {
      return state.filter(id => id !== action.payload.id);
    }
    default:
      return state;
  }
}
