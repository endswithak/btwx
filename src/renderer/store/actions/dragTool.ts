import {
  ENABLE_DRAG_TOOL,
  DISABLE_DRAG_TOOL,
  SET_DRAG_TOOL_LAYERS,
  SET_DRAG_TOOL_HANDLE,
  EnableDragToolPayload,
  SetDragToolLayersPayload,
  SetDragToolHandlePayload,
  DragToolTypes
} from '../actionTypes/dragTool';

export const enableDragTool = (payload: EnableDragToolPayload): DragToolTypes => ({
  type: ENABLE_DRAG_TOOL,
  payload
});

export const disableDragTool = (): DragToolTypes => ({
  type: DISABLE_DRAG_TOOL
});

export const setDragToolLayers = (payload: SetDragToolLayersPayload): DragToolTypes => ({
  type: SET_DRAG_TOOL_LAYERS,
  payload
});

export const setDragToolHandle = (payload: SetDragToolHandlePayload): DragToolTypes => ({
  type: SET_DRAG_TOOL_HANDLE,
  payload
});