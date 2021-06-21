export const ENABLE_SCROLL_FRAME_TOOL = 'ENABLE_SCROLL_FRAME_TOOL';
export const DISABLE_SCROLL_FRAME_TOOL = 'DISABLE_SCROLL_FRAME_TOOL';
export const SET_SCROLL_FRAME_TOOL_ID = 'SET_SCROLL_FRAME_TOOL_ID';

export interface EnableScrollFrameToolPayload {
  id: string;
}

interface EnableScrollFrameTool {
  type: typeof ENABLE_SCROLL_FRAME_TOOL;
  payload: EnableScrollFrameToolPayload;
}

interface DisableScrollFrameTool {
  type: typeof DISABLE_SCROLL_FRAME_TOOL;
}

export interface SetScrollFrameToolIdPayload {
  id: string;
}

interface SetScrollFrameToolId {
  type: typeof SET_SCROLL_FRAME_TOOL_ID;
  payload: SetScrollFrameToolIdPayload;
}

export type ScrollFrameToolTypes = EnableScrollFrameTool |
                                   DisableScrollFrameTool |
                                   SetScrollFrameToolId;