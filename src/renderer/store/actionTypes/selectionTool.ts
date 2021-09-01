export const SET_SELECTION_TOOL_BOUNDS = 'SET_SELECTION_TOOL_BOUNDS';
export const SET_SELECTION_TOOL_HANDLE = 'SET_SELECTION_TOOL_HANDLE';
export const SET_SELECTION_TOOL = 'SET_SELECTION_TOOL';
export const SET_SELECTION_TOOL_LINE_FROM_POINT = 'SET_SELECTION_TOOL_LINE_FROM_POINT';
export const SET_SELECTION_TOOL_LINE_TO_POINT = 'SET_SELECTION_TOOL_LINE_TO_POINT';

export interface SetSelectionToolBoundsPayload {
  bounds: number[];
}

interface SetSelectionToolBounds {
  type: typeof SET_SELECTION_TOOL_BOUNDS;
  payload: SetSelectionToolBoundsPayload;
}

export interface SetSelectionToolHandlePayload {
  handle: Btwx.SelectionToolHandle;
}

interface SetSelectionToolHandle {
  type: typeof SET_SELECTION_TOOL_HANDLE;
  payload: SetSelectionToolHandlePayload;
}

export interface SetSelectionToolPayload {
  bounds?: number[];
  handle?: Btwx.SelectionToolHandle;
  lineFromPoint?: number[];
  lineToPoint?: number[];
}

interface SetSelectionTool {
  type: typeof SET_SELECTION_TOOL;
  payload: SetSelectionToolPayload;
}

export interface SetSelectionToolLineFromPointPayload {
  lineFromPoint: number[];
}

interface SetSelectionToolLineFromPoint {
  type: typeof SET_SELECTION_TOOL_LINE_FROM_POINT;
  payload: SetSelectionToolLineFromPointPayload;
}

export interface SetSelectionToolLineToPointPayload {
  lineToPoint: number[];
}

interface SetSelectionToolLineToPoint {
  type: typeof SET_SELECTION_TOOL_LINE_TO_POINT;
  payload: SetSelectionToolLineToPointPayload;
}

export type SelectionToolTypes = SetSelectionToolBounds |
                                 SetSelectionToolHandle |
                                 SetSelectionTool |
                                 SetSelectionToolLineFromPoint |
                                 SetSelectionToolLineToPoint;