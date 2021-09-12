export const ENABLE_DRAG_TOOL = 'ENABLE_DRAG_TOOL';
export const DISABLE_DRAG_TOOL = 'DISABLE_DRAG_TOOL';
export const SET_DRAG_TOOL_LAYERS = 'SET_DRAG_TOOL_LAYERS';
export const SET_DRAG_TOOL_HANDLE = 'SET_DRAG_TOOL_HANDLE';

export interface EnableDragToolPayload {
  layers: string[];
  handle?: boolean;
}

interface EnableDragTool {
  type: typeof ENABLE_DRAG_TOOL;
  payload: EnableDragToolPayload;
}

interface DisableDragTool {
  type: typeof DISABLE_DRAG_TOOL;
}

export interface SetDragToolLayersPayload {
  layers: string[];
}

interface SetDragToolLayers {
  type: typeof SET_DRAG_TOOL_LAYERS;
  payload: SetDragToolLayersPayload;
}

export interface SetDragToolHandlePayload {
  handle: boolean;
}

interface SetDragToolHandle {
  type: typeof SET_DRAG_TOOL_HANDLE;
  payload: SetDragToolHandlePayload;
}

export type DragToolTypes = EnableDragTool |
                            DisableDragTool |
                            SetDragToolLayers |
                            SetDragToolHandle;