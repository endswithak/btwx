import { setCanvasActiveTool } from './canvasSettings';

import {
  ENABLE_RESIZE_TOOL,
  DISABLE_RESIZE_TOOL,
  EnableResizeToolPayload,
  ResizeToolTypes
} from '../actionTypes/resizeTool';

export const enableResizeTool = (payload: EnableResizeToolPayload): ResizeToolTypes => ({
  type: ENABLE_RESIZE_TOOL,
  payload
});

export const enableResizeToolThunk = (handle?: em.ResizeHandle) => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableResizeTool({handle}));
    dispatch(setCanvasActiveTool({activeTool: 'Resize', resizing: true}));
  }
};

export const disableResizeTool = (): ResizeToolTypes => ({
  type: DISABLE_RESIZE_TOOL
});

export const disableResizeToolThunk = (handle?: em.ResizeHandle) => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableResizeTool({handle}));
    dispatch(setCanvasActiveTool({activeTool: null, resizing: false}));
  }
};