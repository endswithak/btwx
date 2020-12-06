import {
  OPEN_PREVIEW,
  HYDRATE_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  SET_PREVIEW_FOCUSING,
  SET_PREVIEW_WINDOW_ID,
  SET_PREVIEW_DOCUMENT_WINDOW_ID,
  HydratePreviewPayload,
  OpenPreviewPayload,
  SetPreviewFocusingPayload,
  SetPreviewWindowIdPayload,
  SetPreviewDocumentWindowIdPayload,
  PreviewTypes
} from '../actionTypes/preview';

export const openPreview = (payload: OpenPreviewPayload): PreviewTypes => ({
  type: OPEN_PREVIEW,
  payload
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

export const setPreviewFocusing = (payload: SetPreviewFocusingPayload): PreviewTypes => ({
  type: SET_PREVIEW_FOCUSING,
  payload
});

export const setPreviewWindowId = (payload: SetPreviewWindowIdPayload): PreviewTypes => ({
  type: SET_PREVIEW_WINDOW_ID,
  payload
});

export const setPreviewDocumentWindowId = (payload: SetPreviewDocumentWindowIdPayload): PreviewTypes => ({
  type: SET_PREVIEW_DOCUMENT_WINDOW_ID,
  payload
});