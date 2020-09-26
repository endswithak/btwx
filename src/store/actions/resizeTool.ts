import { RootState } from '../reducers';
import ResizeTool from '../../canvas/resizeTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

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

export const disableResizeTool = (): ResizeToolTypes => ({
  type: DISABLE_RESIZE_TOOL
});

export const toggleResizeToolThunk = (handle: em.ResizeHandle, nativeEvent: any) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Resize') {
        removeActiveTools();
        dispatch(disableResizeTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        removeActiveTools();
        new ResizeTool(handle, nativeEvent);
        dispatch(enableResizeTool({handle}));
        dispatch(setCanvasActiveTool({activeTool: 'Resize'}));
      }
    }
  }
};