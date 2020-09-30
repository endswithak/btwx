import { setCanvasActiveTool } from './canvasSettings';

import {
  ENABLE_DRAG_TOOL,
  DISABLE_DRAG_TOOL,
  EnableDragToolPayload,
  DragToolTypes
} from '../actionTypes/dragTool';

export const enableDragTool = (payload: EnableDragToolPayload): DragToolTypes => ({
  type: ENABLE_DRAG_TOOL,
  payload
});

export const enableDragToolThunk = (handle?: boolean) => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableDragTool({handle}));
    dispatch(setCanvasActiveTool({activeTool: 'Drag', dragging: true}));
  }
};

export const disableDragTool = (): DragToolTypes => ({
  type: DISABLE_DRAG_TOOL
});

export const disableDragToolThunk = (handle?: boolean) => {
  return (dispatch: any, getState: any): void => {
    dispatch(disableDragTool());
    dispatch(setCanvasActiveTool({activeTool: null, dragging: false}));
  }
};