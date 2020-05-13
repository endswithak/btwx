import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  TweenDrawerTypes,
} from '../actionTypes/tweenDrawer';

export interface TweenDrawerState {
  isOpen: boolean;
  event: string;
}

const initialState: TweenDrawerState = {
  isOpen: false,
  event: null
};

export default (state = initialState, action: TweenDrawerTypes): TweenDrawerState => {
  switch (action.type) {
    case OPEN_TWEEN_DRAWER: {
      return {
        ...state,
        isOpen: true
      };
    }
    case CLOSE_TWEEN_DRAWER: {
      return {
        ...state,
        isOpen: false
      };
    }
    case SET_TWEEN_DRAWER_EVENT: {
      return {
        ...state,
        event: action.payload.id
      };
    }
    default:
      return state;
  }
}
