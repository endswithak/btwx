export const SET_EVENT_DRAWER_EVENT_HOVER = 'SET_EVENT_DRAWER_EVENT_HOVER';
export const SET_EVENT_DRAWER_EVENT = 'SET_EVENT_DRAWER_EVENT';
export const SET_EVENT_DRAWER_TWEEN_HOVER = 'SET_EVENT_DRAWER_TWEEN_HOVER';
export const SET_EVENT_DRAWER_TWEEN_EDITING = 'SET_EVENT_DRAWER_TWEEN_EDITING';
export const SET_EVENT_DRAWER_EVENT_SORT = 'SET_EVENT_DRAWER_EVENT_SORT';

export interface SetEventDrawerEventHoverPayload {
  id: string;
}

export interface SetEventDrawerEventHover {
  type: typeof SET_EVENT_DRAWER_EVENT_HOVER;
  payload: SetEventDrawerEventHoverPayload;
}

export interface SetEventDrawerEventPayload {
  id: string;
}

export interface SetEventDrawerEvent {
  type: typeof SET_EVENT_DRAWER_EVENT;
  payload: SetEventDrawerEventPayload;
}

export interface SetEventDrawerTweenHoverPayload {
  id: string;
}

export interface SetEventDrawerTweenHover {
  type: typeof SET_EVENT_DRAWER_TWEEN_HOVER;
  payload: SetEventDrawerTweenHoverPayload;
}

export interface SetEventDrawerTweenEditingPayload {
  id: string;
}

export interface SetEventDrawerTweenEditing {
  type: typeof SET_EVENT_DRAWER_TWEEN_EDITING;
  payload: SetEventDrawerTweenEditingPayload;
}

export interface SetEventDrawerEventSortPayload {
  eventSort: Btwx.TweenEventSort;
}

export interface SetEventDrawerEventSort {
  type: typeof SET_EVENT_DRAWER_EVENT_SORT;
  payload: SetEventDrawerEventSortPayload;
}

export type EventDrawerTypes = SetEventDrawerEventHover | SetEventDrawerEvent | SetEventDrawerTweenHover | SetEventDrawerTweenEditing | SetEventDrawerEventSort;