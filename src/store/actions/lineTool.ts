import { RootState } from '../reducers';
import LineTool from '../../canvas/lineTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_LINE_TOOL,
  DISABLE_LINE_TOOL,
  EnableLineToolPayload,
  LineToolTypes
} from '../actionTypes/lineTool';

export const enableLineTool = (payload: EnableLineToolPayload): LineToolTypes => ({
  type: ENABLE_LINE_TOOL,
  payload
});

export const disableLineTool = (): LineToolTypes => ({
  type: DISABLE_LINE_TOOL
});

export const toggleLineToolThunk = (handle?: em.LineHandle) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Line') {
        // removeActiveTools();
        dispatch(disableLineTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        // removeActiveTools();
        // new LineTool(handle, nativeEvent);
        dispatch(enableLineTool({handle}));
        dispatch(setCanvasActiveTool({activeTool: 'Line'}));
      }
    }
  }
};