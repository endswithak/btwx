import { setLayerHover } from './layer';
import { scrollToLayer } from '../../utils';
import { RootState } from '../reducers';
import { isPreviewWindow, getPreviewWindow } from '../../utils';

import {
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
import { remote } from 'electron';

export const setTweenDrawerEventHover = (payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT_HOVER,
  payload
});

export const setTweenDrawerEventHoverThunk = (payload: SetTweenDrawerEventHoverPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const eventLayer = payload.id ? state.layer.present.events.byId[payload.id].layer : payload.id;
    scrollToLayer(eventLayer);
    dispatch(setTweenDrawerEventHover(payload));
    dispatch(setLayerHover({ id: eventLayer }));
  }
};

export const setTweenDrawerEvent = (payload: SetTweenDrawerEventPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT,
  payload
});

export const setTweenDrawerEventThunk = (payload: SetTweenDrawerEventPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.preview.isOpen && state.preview.documentWindowId === remote.getCurrentWindow().id) {
      const previewWindow = state.preview.windowId ? remote.BrowserWindow.fromId(state.preview.windowId) : null;
      if (previewWindow) {
        previewWindow.webContents.executeJavaScript(`setTweenDrawerEvent(${payload.id})`);
      }
    }
    dispatch(setTweenDrawerEvent(payload));
  }
};

export const setTweenDrawerTweenHover = (payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_TWEEN_HOVER,
  payload
});

export const setTweenDrawerTweenHoverThunk = (payload: SetTweenDrawerEventHoverPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (!state.tweenDrawer.tweenEditing) {
      const tweenLayer = payload.id ? state.layer.present.tweens.byId[payload.id].layer : payload.id;
      // scrollToLayer(tweenLayer);
      dispatch(setTweenDrawerTweenHover(payload));
      if (state.layer.present.hover !== tweenLayer) {
        dispatch(setLayerHover({ id: tweenLayer }));
      }
    }
  }
};

export const setTweenDrawerTweenEditing = (payload: SetTweenDrawerTweenEditingPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_TWEEN_EDITING,
  payload
});

export const setTweenDrawerEventSort = (payload: SetTweenDrawerEventSortPayload): TweenDrawerTypes => ({
  type: SET_TWEEN_DRAWER_EVENT_SORT,
  payload
});