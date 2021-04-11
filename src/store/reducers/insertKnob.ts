import {
  ACTIVATE_INSERT_KNOB,
  DEACTIVATE_INSERT_KNOB,
  SET_INSERT_KNOB_INDEX,
  InsertKnobTypes,
} from '../actionTypes/insertKnob';

export interface InsertKnobState {
  isActive: boolean;
  index: number;
}

const initialState: InsertKnobState = {
  isActive: false,
  index: 0
};

export default (state = initialState, action: InsertKnobTypes): InsertKnobState => {
  switch (action.type) {
    case ACTIVATE_INSERT_KNOB: {
      return {
        ...state,
        isActive: true
      };
    }
    case DEACTIVATE_INSERT_KNOB: {
      return {
        ...state,
        isActive: false
      };
    }
    case SET_INSERT_KNOB_INDEX: {
      return {
        ...state,
        index: action.payload.index
      };
    }
    default:
      return state;
  }
}
