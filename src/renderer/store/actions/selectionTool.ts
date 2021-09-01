import {
  SET_SELECTION_TOOL_BOUNDS,
  SET_SELECTION_TOOL_HANDLE,
  SET_SELECTION_TOOL,
  SET_SELECTION_TOOL_LINE_FROM_POINT,
  SET_SELECTION_TOOL_LINE_TO_POINT,
  SetSelectionToolBoundsPayload,
  SetSelectionToolHandlePayload,
  SetSelectionToolPayload,
  SetSelectionToolLineFromPointPayload,
  SetSelectionToolLineToPointPayload,
  SelectionToolTypes
} from '../actionTypes/selectionTool';

export const setSelectionToolBounds = (payload: SetSelectionToolBoundsPayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL_BOUNDS,
  payload
});

export const setSelectionToolHandle = (payload: SetSelectionToolHandlePayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL_HANDLE,
  payload
});

export const setSelectionTool = (payload: SetSelectionToolPayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL,
  payload
});

export const setSelectionToolLineFromPoint = (payload: SetSelectionToolLineFromPointPayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL_LINE_FROM_POINT,
  payload
});

export const setSelectionToolLineToPoint = (payload: SetSelectionToolLineToPointPayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL_LINE_TO_POINT,
  payload
});