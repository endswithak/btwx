import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { paperMain } from '../../canvas';

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
        const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
        const preview = paperMain.project.getItem({ data: { id: 'ArtboardToolPreview' } });
        if (tooltip) {
          tooltip.remove();
        }
        if (preview) {
          preview.remove();
        }
        dispatch(disableArtboardTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        dispatch(enableArtboardTool());
        dispatch(setCanvasActiveTool({activeTool: 'Artboard'}));
      }
    }
  }
};