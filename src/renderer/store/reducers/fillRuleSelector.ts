import {
  OPEN_FILL_RULE_SELECTOR,
  CLOSE_FILL_RULE_SELECTOR,
  FillRuleSelectorTypes,
} from '../actionTypes/fillRuleSelector';

export interface FillRuleSelectorState {
  isOpen: boolean;
  x: number;
  y: number;
}

const initialState: FillRuleSelectorState = {
  isOpen: false,
  x: null,
  y: null
};

export default (state = initialState, action: FillRuleSelectorTypes): FillRuleSelectorState => {
  switch (action.type) {
    case OPEN_FILL_RULE_SELECTOR: {
      return {
        ...state,
        isOpen: true,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FILL_RULE_SELECTOR: {
      return {
        ...state,
        isOpen: false,
        x: null,
        y: null
      };
    }
    default:
      return state;
  }
}
