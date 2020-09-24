export const ENABLE_SELECTION_TOOL = 'ENABLE_SELECTION_TOOL';
export const SET_SELECTION_TOOL_RESIZE_TYPE = 'SET_SELECTION_TOOL_RESIZE_TYPE';
export const DISABLE_SELECTION_TOOL = 'DISABLE_SELECTION_TOOL';

export interface EnableSelectionToolPayload {
  resizeType?: em.ResizeType;
}

interface EnableSelectionTool {
  type: typeof ENABLE_SELECTION_TOOL;
  payload: EnableSelectionToolPayload;
}

export interface SetSelectionToolResizeTypePayload {
  resizeType: em.ResizeType;
}

interface SetSelectionToolResizeType {
  type: typeof SET_SELECTION_TOOL_RESIZE_TYPE;
  payload: SetSelectionToolResizeTypePayload;
}

interface DisableSelectionTool {
  type: typeof DISABLE_SELECTION_TOOL;
}

export type SelectionToolTypes = EnableSelectionTool |
                                 SetSelectionToolResizeType |
                                 DisableSelectionTool;