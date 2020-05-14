import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  OPEN_TWEEN_EASE_EDITOR,
  CLOSE_TWEEN_EASE_EDITOR,
  TweenDrawerTypes,
} from '../actionTypes/tweenDrawer';

export interface TweenDrawerState {
  isOpen: boolean;
  event: string;
  easeEdit: {
    isOpen: boolean;
    x: number;
    y: number;
    id: string;
  };
}

const initialState: TweenDrawerState = {
  isOpen: false,
  event: null,
  easeEdit: {
    isOpen: false,
    x: null,
    y: null,
    id: null
  }
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
        easeEdit: initialState.easeEdit
      };
    }
    case SET_TWEEN_DRAWER_EVENT: {
      return {
        ...state,
        event: action.payload.id
      };
    }
    case OPEN_TWEEN_EASE_EDITOR: {
      return {
        ...state,
        easeEdit: {
          ...action.payload,
          isOpen: true
        }
      };
    }
    case CLOSE_TWEEN_EASE_EDITOR: {
      return {
        ...state,
        easeEdit: initialState.easeEdit
      };
    }
    default:
      return state;
  }
}
