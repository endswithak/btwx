import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  SET_PREVIEW_FOCUSING,
  SET_PREVIEW_TWEENING,
  SET_PREVIEW_DEVICE,
  TOGGLE_PREVIEW_DEVICE_ORIENTATION,
  SetPreviewFocusingPayload,
  SetPreviewTweeningPayload,
  SetPreviewDevicePayload,
  PreviewTypes
} from '../actionTypes/preview';

export const openPreview = (): PreviewTypes => ({
  type: OPEN_PREVIEW
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

export const setPreviewFocusing = (payload: SetPreviewFocusingPayload): PreviewTypes => ({
  type: SET_PREVIEW_FOCUSING,
  payload
});

export const setPreviewTweening = (payload: SetPreviewTweeningPayload): PreviewTypes => ({
  type: SET_PREVIEW_TWEENING,
  payload
});

export const setPreviewDevice = (payload: SetPreviewDevicePayload): PreviewTypes => ({
  type: SET_PREVIEW_DEVICE,
  payload
});

export const togglePreviewDeviceOrientation = (): PreviewTypes => ({
  type: TOGGLE_PREVIEW_DEVICE_ORIENTATION
});