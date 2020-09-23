import { setLayerHover } from './layer';

import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT_HOVER,
  SET_TWEEN_DRAWER_EVENT,
  SET_TWEEN_DRAWER_TWEEN_HOVER,
  SET_TWEEN_DRAWER_TWEEN_EDITING,
  SET_TWEEN_DRAWER_EVENT_SORT,
  SetTweenDrawerEventPayload,
  SetTweenDrawerEventHoverPayload,
  SetTweenDrawerTweenHoverPayload,
  SetTweenDrawerTweenEditingPayload,
  SetTweenDrawerEventSortPayload,
  TweenDrawerTypes
} from '../actionTypes/tweenDrawer';
import { RootState } from '../reducers';

export const openTweenDrawer = (): TweenDrawerTypes => ({
  type: OPEN_TWEEN_DRAWER
});

export const closeTweenDrawer = (): TweenDrawerTypes => ({
  type: CLOSE_TWEEN_DRAWER
});

export const setTweenDrawerEventHover = (payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT_HOVER,
  payload
});

export const setTweenDrawerEventHoverThunk = (payload: SetTweenDrawerEventHoverPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const eventLayer = payload.id ? state.layer.present.tweenEventById[payload.id].layer : payload.id;
    dispatch(setTweenDrawerEventHover(payload));
    dispatch(setLayerHover({ id: eventLayer }));
  }
}

export const setTweenDrawerEvent = (payload: SetTweenDrawerEventPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT,
  payload
});

export const setTweenDrawerTweenHover = (payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_TWEEN_HOVER,
  payload
});

export const setTweenDrawerTweenEditing = (payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_TWEEN_EDITING,
  payload
});

export const setTweenDrawerEventSort = (payload: SetTweenDrawerEventSortPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT_SORT,
  payload
});