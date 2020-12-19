import { remote } from 'electron';
import { setLayerHover } from './layer';
import { scrollToLayer } from '../../utils';
import { RootState } from '../reducers';

import {
  SET_EVENT_DRAWER_EVENT_HOVER,
  SET_EVENT_DRAWER_EVENT,
  SET_EVENT_DRAWER_TWEEN_HOVER,
  SET_EVENT_DRAWER_TWEEN_EDITING,
  SET_EVENT_DRAWER_EVENT_SORT,
  SetEventDrawerEventPayload,
  SetEventDrawerEventHoverPayload,
  SetEventDrawerTweenHoverPayload,
  SetEventDrawerTweenEditingPayload,
  SetEventDrawerEventSortPayload,
  EventDrawerTypes
} from '../actionTypes/eventDrawer';

export const setEventDrawerEventHover = (payload: SetEventDrawerEventHoverPayload): EventDrawerTypes => ({
  type: SET_EVENT_DRAWER_EVENT_HOVER,
  payload
});

export const setEventDrawerEventHoverThunk = (payload: SetEventDrawerEventHoverPayload) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const eventLayer = payload.id ? state.layer.present.events.byId[payload.id].layer : payload.id;
    scrollToLayer(eventLayer);
    dispatch(setEventDrawerEventHover(payload));
    dispatch(setLayerHover({ id: eventLayer }));
  }
};

export const setEventDrawerEvent = (payload: SetEventDrawerEventPayload): EventDrawerTypes => ({
  type: SET_EVENT_DRAWER_EVENT,
  payload
});

export const setEventDrawerEventThunk = (payload: SetEventDrawerEventPayload) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.preview.isOpen && state.preview.documentWindowId === remote.getCurrentWindow().id) {
      const previewWindow = state.preview.windowId ? remote.BrowserWindow.fromId(state.preview.windowId) : null;
      if (previewWindow) {
        previewWindow.webContents.executeJavaScript(`setEventDrawerEvent(${payload.id})`);
      }
    }
    dispatch(setEventDrawerEvent(payload));
  }
};

export const setEventDrawerTweenHover = (payload: SetEventDrawerTweenHoverPayload): EventDrawerTypes => ({
  type: SET_EVENT_DRAWER_TWEEN_HOVER,
  payload
});

export const setEventDrawerTweenHoverThunk = (payload: SetEventDrawerEventHoverPayload) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (!state.eventDrawer.tweenEditing) {
      const tweenLayer = payload.id ? state.layer.present.tweens.byId[payload.id].layer : payload.id;
      // scrollToLayer(tweenLayer);
      dispatch(setEventDrawerTweenHover(payload));
      if (state.layer.present.hover !== tweenLayer) {
        dispatch(setLayerHover({ id: tweenLayer }));
      }
    }
  }
};

export const setEventDrawerTweenEditing = (payload: SetEventDrawerTweenEditingPayload): EventDrawerTypes => ({
  type: SET_EVENT_DRAWER_TWEEN_EDITING,
  payload
});

export const setEventDrawerEventSort = (payload: SetEventDrawerEventSortPayload): EventDrawerTypes => ({
  type: SET_EVENT_DRAWER_EVENT_SORT,
  payload
});