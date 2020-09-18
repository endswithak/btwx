import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT_HOVER,
  SET_TWEEN_DRAWER_EVENT,
  SET_TWEEN_DRAWER_TWEEN_HOVER,
  SET_TWEEN_DRAWER_TWEEN_EDITING,
  SET_TWEEN_DRAWER_EVENT_SORT,
  TweenDrawerTypes,
} from '../actionTypes/tweenDrawer';

export interface TweenDrawerState {
  isOpen: boolean;
  event: string;
  eventHover: string;
  tweenHover: string;
  tweenEditing: string;
  eventSort: em.TweenEventSort;
}

const initialState: TweenDrawerState = {
  isOpen: true,
  event: null,
  eventHover: null,
  tweenHover: null,
  tweenEditing: null,
  eventSort: 'none'
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
        eventHover: null
      };
    }
    case SET_TWEEN_DRAWER_EVENT_HOVER: {
      return {
        ...state,
        eventHover: action.payload.id
      };
    }
    case SET_TWEEN_DRAWER_EVENT: {
      return {
        ...state,
        event: action.payload.id,
        tweenHover: null,
        eventHover: null
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
    case SET_TWEEN_DRAWER_EVENT_SORT: {
      return {
        ...state,
        eventSort: action.payload.eventSort
      };
    }
    default:
      return state;
  }
}
