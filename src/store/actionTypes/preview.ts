import { RootState } from '../reducers';

export const OPEN_PREVIEW = 'OPEN_PREVIEW';
export const HYDRATE_PREVIEW = 'HYDRATE_PREVIEW';
export const CLOSE_PREVIEW = 'CLOSE_PREVIEW';
export const START_PREVIEW_RECORDING = 'START_PREVIEW_RECORDING';
export const STOP_PREVIEW_RECORDING = 'STOP_PREVIEW_RECORDING';
export const ENABLE_TOUCH_CURSOR = 'ENABLE_TOUCH_CURSOR';
export const DISABLE_TOUCH_CURSOR = 'DISABLE_TOUCH_CURSOR';
export const SET_PREVIEW_FOCUSING = 'SET_PREVIEW_FOCUSING';
export const SET_PREVIEW_WINDOW_ID = 'SET_PREVIEW_WINDOW_ID';
export const SET_PREVIEW_DOCUMENT_WINDOW_ID = 'SET_PREVIEW_DOCUMENT_WINDOW_ID';

export interface OpenPreviewPayload {
  windowId?: number;
  documentWindowId?: number;
}

export interface OpenPreview {
  type: typeof OPEN_PREVIEW;
  payload: OpenPreviewPayload;
}

export interface HydratePreviewPayload {
  state: RootState;
}

export interface HydratePreview {
  type: typeof HYDRATE_PREVIEW;
  payload: HydratePreviewPayload;
}

export interface ClosePreview {
  type: typeof CLOSE_PREVIEW;
}

export interface StartPreviewRecording {
  type: typeof START_PREVIEW_RECORDING;
}

export interface StopPreviewRecording {
  type: typeof STOP_PREVIEW_RECORDING;
}

export interface EnableTouchCursor {
  type: typeof ENABLE_TOUCH_CURSOR;
}

export interface DisableTouchCursor {
  type: typeof DISABLE_TOUCH_CURSOR;
}

export interface SetPreviewFocusingPayload {
  focusing: boolean;
}

export interface SetPreviewFocusing {
  type: typeof SET_PREVIEW_FOCUSING;
  payload: SetPreviewFocusingPayload;
}

export interface SetPreviewWindowIdPayload {
  windowId: number;
}

export interface SetPreviewWindowId {
  type: typeof SET_PREVIEW_WINDOW_ID;
  payload: SetPreviewWindowIdPayload;
}

export interface SetPreviewDocumentWindowIdPayload {
  documentWindowId: number;
}

export interface SetPreviewDocumentWindowId {
  type: typeof SET_PREVIEW_DOCUMENT_WINDOW_ID;
  payload: SetPreviewDocumentWindowIdPayload;
}

export type PreviewTypes = OpenPreview |
                           HydratePreview |
                           ClosePreview |
                           StartPreviewRecording |
                           StopPreviewRecording |
                           EnableTouchCursor |
                           DisableTouchCursor |
                           SetPreviewFocusing |
                           SetPreviewWindowId |
                           SetPreviewDocumentWindowId;