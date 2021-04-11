import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { disableShapeTool } from './shapeTool';
import { disableTextTool } from './textTool';

import {
  ENABLE_ARTBOARD_TOOL,
  DISABLE_ARTBOARD_TOOL,
  ArtboardToolTypes
} from '../actionTypes/artboardTool';

export const enableArtboardTool = (): ArtboardToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL,
});

export const disableArtboardTool = (): ArtboardToolTypes => ({
  type: DISABLE_ARTBOARD_TOOL
});

export const toggleArtboardToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Artboard') {
        dispatch(disableArtboardTool());
        dispatch(setCanvasActiveTool({
          activeTool: null,
          drawing: false,
          cursor: state.canvasSettings.cursor.filter(c => c !== 'crosshair')
        }));
      } else {
        if (state.canvasSettings.activeTool === 'Shape') {
          dispatch(disableShapeTool() as any);
        }
        if (state.canvasSettings.activeTool === 'Text') {
          dispatch(disableTextTool() as any);
        }
        dispatch(enableArtboardTool());
        dispatch(setCanvasActiveTool({
          activeTool: 'Artboard',
          cursor: ['crosshair', ...state.canvasSettings.cursor]
        }));
      }
    }
  }
};