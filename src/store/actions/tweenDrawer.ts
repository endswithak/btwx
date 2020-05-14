import {
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SET_TWEEN_DRAWER_EVENT,
  OPEN_TWEEN_EASE_EDITOR,
  CLOSE_TWEEN_EASE_EDITOR,
  SetTweenDrawerEventPayload,
  OpenTweenEaseEditorPayload,
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

export const openTweenEaseEditor = (payload: OpenTweenEaseEditorPayload): TweenDrawerTypes => ({
  type: OPEN_TWEEN_EASE_EDITOR,
  payload
});

export const closeTweenEaseEditor = (): TweenDrawerTypes => ({
  type: CLOSE_TWEEN_EASE_EDITOR
});