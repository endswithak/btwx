export const OPEN_TWEEN_DRAWER = 'OPEN_TWEEN_DRAWER';
export const CLOSE_TWEEN_DRAWER = 'CLOSE_TWEEN_DRAWER';
export const SET_TWEEN_DRAWER_EVENT = 'SET_TWEEN_DRAWER_EVENT';
export const SET_TWEEN_DRAWER_TWEEN_HOVER = 'SET_TWEEN_DRAWER_TWEEN_HOVER';
export const SET_TWEEN_DRAWER_TWEEN_EDITING = 'SET_TWEEN_DRAWER_TWEEN_EDITING';

export interface OpenTweenDrawer {
  type: typeof OPEN_TWEEN_DRAWER;
}

export interface CloseTweenDrawer {
  type: typeof CLOSE_TWEEN_DRAWER;
}

export interface SetTweenDrawerEventPayload {
  id: string;
}

export interface SetTweenDrawerEvent {
  type: typeof SET_TWEEN_DRAWER_EVENT;
  payload: SetTweenDrawerEventPayload;
}

export interface SetTweenDrawerTweenHoverPayload {
  id: string;
}

export interface SetTweenDrawerTweenHover {
  type: typeof SET_TWEEN_DRAWER_TWEEN_HOVER;
  payload: SetTweenDrawerTweenHoverPayload;
}

export interface SetTweenDrawerTweenEditingPayload {
  id: string;
}

export interface SetTweenDrawerTweenEditing {
  type: typeof SET_TWEEN_DRAWER_TWEEN_EDITING;
  payload: SetTweenDrawerTweenEditingPayload;
}

export type TweenDrawerTypes = OpenTweenDrawer | CloseTweenDrawer | SetTweenDrawerEvent | SetTweenDrawerTweenHover | SetTweenDrawerTweenEditing;