import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
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