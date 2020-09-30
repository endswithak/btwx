import { setCanvasActiveTool } from './canvasSettings';

import {
  ENABLE_AREA_SELECT_TOOL,
  DISABLE_AREA_SELECT_TOOL,
  AreaSelectToolTypes
} from '../actionTypes/areaSelectTool';

export const enableAreaSelectTool = (): AreaSelectToolTypes => ({
  type: ENABLE_AREA_SELECT_TOOL
});

export const enableAreaSelectToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableAreaSelectTool());
    dispatch(setCanvasActiveTool({activeTool: 'AreaSelect', selecting: true}));
  }
};

export const disableAreaSelectTool = (): AreaSelectToolTypes => ({
  type: DISABLE_AREA_SELECT_TOOL
});

export const disableAreaSelectToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(disableAreaSelectTool());
    dispatch(setCanvasActiveTool({activeTool: null, selecting: false}));
  }
};