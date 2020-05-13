export const OPEN_TWEEN_DRAWER = 'OPEN_TWEEN_DRAWER';
export const CLOSE_TWEEN_DRAWER = 'CLOSE_TWEEN_DRAWER';
export const SET_TWEEN_DRAWER_EVENT = 'SET_TWEEN_DRAWER_EVENT';

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

export type TweenDrawerTypes = OpenTweenDrawer | CloseTweenDrawer | SetTweenDrawerEvent;