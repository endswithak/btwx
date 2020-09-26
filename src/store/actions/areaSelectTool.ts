import { RootState } from '../reducers';
import AreaSelectTool from '../../canvas/areaSelectTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_AREA_SELECT_TOOL,
  DISABLE_AREA_SELECT_TOOL,
  AreaSelectToolTypes
} from '../actionTypes/areaSelectTool';

export const enableAreaSelectTool = (): AreaSelectToolTypes => ({
  type: ENABLE_AREA_SELECT_TOOL
});

export const disableAreaSelectTool = (): AreaSelectToolTypes => ({
  type: DISABLE_AREA_SELECT_TOOL
});

export const toggleAreaSelectToolThunk = (nativeEvent: any) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'AreaSelect') {
        removeActiveTools();
        dispatch(disableAreaSelectTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        removeActiveTools();
        new AreaSelectTool(nativeEvent);
        dispatch(enableAreaSelectTool());
        dispatch(setCanvasActiveTool({activeTool: 'AreaSelect'}));
      }
    }
  }
};