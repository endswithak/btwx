import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';

import {
  ENABLE_SCROLL_FRAME_TOOL,
  DISABLE_SCROLL_FRAME_TOOL,
  SET_SCROLL_FRAME_TOOL_ID,
  EnableScrollFrameToolPayload,
  SetScrollFrameToolIdPayload,
  ScrollFrameToolTypes
} from '../actionTypes/scrollFrameTool';

export const enableScrollFrameTool = (payload: EnableScrollFrameToolPayload): ScrollFrameToolTypes => ({
  type: ENABLE_SCROLL_FRAME_TOOL,
  payload
});

export const disableScrollFrameTool = (): ScrollFrameToolTypes => ({
  type: DISABLE_SCROLL_FRAME_TOOL
});

export const setScrollFrameToolId = (payload: SetScrollFrameToolIdPayload): ScrollFrameToolTypes => ({
  type: SET_SCROLL_FRAME_TOOL_ID,
  payload
});

export const disableScrollFrameToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(disableScrollFrameTool());
    dispatch(setCanvasActiveTool({
      activeTool: null,
      resizing: false,
      cursor: ['auto']
    }));
  }
};