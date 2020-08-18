export const OPEN_PREVIEW = 'OPEN_PREVIEW';
export const CLOSE_PREVIEW = 'CLOSE_PREVIEW';
export const START_PREVIEW_RECORDING = 'START_PREVIEW_RECORDING';
export const STOP_PREVIEW_RECORDING = 'STOP_PREVIEW_RECORDING';

export interface OpenPreview {
  type: typeof OPEN_PREVIEW;
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

export type PreviewTypes = OpenPreview | ClosePreview | StartPreviewRecording | StopPreviewRecording;