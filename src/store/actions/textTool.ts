import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';

import {
  ENABLE_TEXT_TOOL,
  DISABLE_TEXT_TOOL,
  TextToolTypes
} from '../actionTypes/textTool';

export const enableTextTool = (): TextToolTypes => ({
  type: ENABLE_TEXT_TOOL,
});

export const disableTextTool = (): TextToolTypes => ({
  type: DISABLE_TEXT_TOOL
});

export const toggleTextToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Text') {
        dispatch(disableTextTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        dispatch(enableTextTool());
        dispatch(setCanvasActiveTool({activeTool: 'Text'}));
      }
    }
  }
};