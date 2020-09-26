export const ENABLE_DRAG_TOOL = 'ENABLE_DRAG_TOOL';
export const DISABLE_DRAG_TOOL = 'DISABLE_DRAG_TOOL';

export interface EnableDragToolPayload {
  handle: boolean;
}

interface EnableDragTool {
  type: typeof ENABLE_DRAG_TOOL;
  payload: EnableDragToolPayload;
}

interface DisableDragTool {
  type: typeof DISABLE_DRAG_TOOL;
}

export type DragToolTypes = EnableDragTool |
                            DisableDragTool;