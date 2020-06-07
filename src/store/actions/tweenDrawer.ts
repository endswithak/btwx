import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  SET_TWEEN_DRAWER_TWEEN_HOVER,
  SET_TWEEN_DRAWER_TWEEN_EDITING,
  SET_TWEEN_DRAWER_SCROLL,
  SetTweenDrawerEventPayload,
  SetTweenDrawerTweenHoverPayload,
  SetTweenDrawerTweenEditingPayload,
  SetTweenDrawerScrollPayload,
  TweenDrawerTypes
} from '../actionTypes/tweenDrawer';

export const openTweenDrawer = (): TweenDrawerTypes => ({
  type: OPEN_TWEEN_DRAWER
});

export const closeTweenDrawer = (): TweenDrawerTypes => ({
  type: CLOSE_TWEEN_DRAWER
});

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

export const setTweenDrawerScroll = (payload: SetTweenDrawerScrollPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_SCROLL,
  payload
});