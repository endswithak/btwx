import {
  OPEN_ANIMATION_DRAWER,
  CLOSE_ANIMATION_DRAWER,
  AnimationDrawerTypes,
} from '../actionTypes/animationDrawer';

export interface AnimationDrawerState {
  isOpen: boolean;
}

const initialState: AnimationDrawerState = {
  isOpen: false
};

export default (state = initialState, action: AnimationDrawerTypes): AnimationDrawerState => {
  switch (action.type) {
    case OPEN_ANIMATION_DRAWER: {
      return {
        ...state,
        isOpen: true
      };
    }
    case CLOSE_ANIMATION_DRAWER: {
      return {
        ...state,
        isOpen: false
      };
    }
    default:
      return state;
  }
}
