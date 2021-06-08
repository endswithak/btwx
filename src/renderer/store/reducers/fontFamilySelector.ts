import {
  OPEN_FONT_FAMILY_SELECTOR,
  CLOSE_FONT_FAMILY_SELECTOR,
  FontFamilySelectorTypes,
} from '../actionTypes/fontFamilySelector';

export interface FontFamilySelectorState {
  isOpen: boolean;
  x: number;
  y: number;
}

const initialState: FontFamilySelectorState = {
  isOpen: false,
  x: null,
  y: null
};

export default (state = initialState, action: FontFamilySelectorTypes): FontFamilySelectorState => {
  switch (action.type) {
    case OPEN_FONT_FAMILY_SELECTOR: {
      return {
        ...state,
        isOpen: true,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case CLOSE_FONT_FAMILY_SELECTOR: {
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
