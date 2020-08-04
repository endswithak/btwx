import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  SET_TWEEN_DRAWER_TWEEN_HOVER,
  SET_TWEEN_DRAWER_TWEEN_EDITING,
  TweenDrawerTypes,
} from '../actionTypes/tweenDrawer';

export interface TweenDrawerState {
  isOpen: boolean;
  event: string;
  tweenHover: string;
  tweenEditing: string;
}

const initialState: TweenDrawerState = {
  isOpen: false,
  event: null,
  tweenHover: null,
  tweenEditing: null
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
        isOpen: false,
        tweenHover: null,
      };
    }
    case SET_TWEEN_DRAWER_EVENT: {
      return {
        ...state,
        event: action.payload.id,
        tweenHover: null
      };
    }
    case SET_TWEEN_DRAWER_TWEEN_HOVER: {
      return {
        ...state,
        tweenHover: action.payload.id
      };
    }
    case SET_TWEEN_DRAWER_TWEEN_EDITING: {
      return {
        ...state,
        tweenEditing: action.payload.id
      };
    }
    default:
      return state;
  }
}
