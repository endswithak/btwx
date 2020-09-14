export const OPEN_PREVIEW = 'OPEN_PREVIEW';
export const CLOSE_PREVIEW = 'CLOSE_PREVIEW';
export const START_PREVIEW_RECORDING = 'START_PREVIEW_RECORDING';
export const STOP_PREVIEW_RECORDING = 'STOP_PREVIEW_RECORDING';
export const ENABLE_TOUCH_CURSOR = 'ENABLE_TOUCH_CURSOR';
export const DISABLE_TOUCH_CURSOR = 'DISABLE_TOUCH_CURSOR';

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

export interface EnableTouchCursor {
  type: typeof ENABLE_TOUCH_CURSOR;
}

export interface DisableTouchCursor {
  type: typeof DISABLE_TOUCH_CURSOR;
}

export type PreviewTypes = OpenPreview | ClosePreview | StartPreviewRecording | StopPreviewRecording | EnableTouchCursor | DisableTouchCursor;