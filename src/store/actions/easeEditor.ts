import { ipcRenderer } from 'electron';
import { RootState } from '../reducers';

import {
  OPEN_EASE_EDITOR,
  CLOSE_EASE_EDITOR,
  OpenEaseEditorPayload,
  EaseEditorTypes
} from '../actionTypes/easeEditor';

export const openEaseEditor = (payload: OpenEaseEditorPayload): EaseEditorTypes => ({
  type: OPEN_EASE_EDITOR,
  payload
});

export const openEaseEditorThunk = (payload: OpenEaseEditorPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    dispatch(openEaseEditor(payload));
    ipcRenderer.send('stickPreview', JSON.stringify({
      instanceId: state.session.instance
    }));
  }
};

export const closeEaseEditor = (): EaseEditorTypes => ({
  type: CLOSE_EASE_EDITOR
});

export const closeEaseEditorThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    dispatch(closeEaseEditor());
    ipcRenderer.send('unStickPreview', JSON.stringify({
      instanceId: state.session.instance
    }));
  }
};