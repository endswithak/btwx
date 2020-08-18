export const OPEN_PREVIEW = 'OPEN_PREVIEW';
export const CLOSE_PREVIEW = 'CLOSE_PREVIEW';
export const START_PREVIEW_RECORD = 'START_PREVIEW_RECORD';
export const STOP_PREVIEW_RECORD = 'STOP_PREVIEW_RECORD';

export interface OpenPreview {
  type: typeof OPEN_PREVIEW;
}

export interface ClosePreview {
  type: typeof CLOSE_PREVIEW;
}

export interface StartPreviewRecord {
  type: typeof START_PREVIEW_RECORD;
}

export interface StopPreviewRecord {
  type: typeof STOP_PREVIEW_RECORD;
}

export type PreviewTypes = OpenPreview | ClosePreview | StartPreviewRecord | StopPreviewRecord;