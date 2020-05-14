export const OPEN_TWEEN_DRAWER = 'OPEN_TWEEN_DRAWER';
export const CLOSE_TWEEN_DRAWER = 'CLOSE_TWEEN_DRAWER';
export const SET_TWEEN_DRAWER_EVENT = 'SET_TWEEN_DRAWER_EVENT';

export const OPEN_TWEEN_EASE_EDITOR = 'OPEN_TWEEN_EASE_EDITOR';
export const CLOSE_TWEEN_EASE_EDITOR = 'CLOSE_TWEEN_EASE_EDITOR';

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

export interface OpenTweenEaseEditorPayload {
  id: string;
  x: number;
  y: number;
}

export interface OpenTweenEaseEditor {
  type: typeof OPEN_TWEEN_EASE_EDITOR;
  payload: OpenTweenEaseEditorPayload;
}

export interface CloseTweenEaseEditor {
  type: typeof CLOSE_TWEEN_EASE_EDITOR;
}

export type TweenDrawerTypes = OpenTweenDrawer | CloseTweenDrawer | SetTweenDrawerEvent | OpenTweenEaseEditor | CloseTweenEaseEditor;