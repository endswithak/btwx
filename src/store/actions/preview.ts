import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORD,
  STOP_PREVIEW_RECORD,
  PreviewTypes
} from '../actionTypes/preview';

export const openPreview = (): PreviewTypes => ({
  type: OPEN_PREVIEW
});

export const closePreview = (): PreviewTypes => ({
  type: CLOSE_PREVIEW
});

export const startPreviewRecord = (): PreviewTypes => ({
  type: START_PREVIEW_RECORD
});

export const stopPreviewRecord = (): PreviewTypes => ({
  type: STOP_PREVIEW_RECORD
});