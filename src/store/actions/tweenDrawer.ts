import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  SET_TWEEN_DRAWER_TWEEN_HOVER,
  SetTweenDrawerEventPayload,
  SetTweenDrawerTweenHoverPayload,
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