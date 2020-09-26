export const ENABLE_RESIZE_TOOL = 'ENABLE_RESIZE_TOOL';
export const DISABLE_RESIZE_TOOL = 'DISABLE_RESIZE_TOOL';

export interface EnableResizeToolPayload {
  handle: em.ResizeHandle;
}

interface EnableResizeTool {
  type: typeof ENABLE_RESIZE_TOOL;
  payload: EnableResizeToolPayload;
}

interface DisableResizeTool {
  type: typeof DISABLE_RESIZE_TOOL;
}

export type ResizeToolTypes = EnableResizeTool |
                              DisableResizeTool;