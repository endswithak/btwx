import {
  OPEN_PREVIEW,
  HYDRATE_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  ENABLE_TOUCH_CURSOR,
  DISABLE_TOUCH_CURSOR,
  HydratePreviewPayload,
  PreviewTypes
} from '../actionTypes/preview';

export const openPreview = (): PreviewTypes => ({
  type: OPEN_PREVIEW
});

export const hydratePreview = (payload: HydratePreviewPayload): PreviewTypes => ({
  type: HYDRATE_PREVIEW,
  payload
});

export const closePreview = (): PreviewTypes => ({
  type: CLOSE_PREVIEW
});

export const startPreviewRecording = (): PreviewTypes => ({
  type: START_PREVIEW_RECORDING
});

export const stopPreviewRecording = (): PreviewTypes => ({
  type: STOP_PREVIEW_RECORDING
});

export const enableTouchCursor = (): PreviewTypes => ({
  type: ENABLE_TOUCH_CURSOR
});

export const disableTouchCursor = (): PreviewTypes => ({
  type: DISABLE_TOUCH_CURSOR
});