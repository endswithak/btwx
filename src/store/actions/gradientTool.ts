import { RootState } from '../reducers';
import GradientTool from '../../canvas/gradientTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_GRADIENT_TOOL,
  DISABLE_GRADIENT_TOOL,
  EnableGradientToolPayload,
  GradientToolTypes
} from '../actionTypes/gradientTool';

export const enableGradientTool = (payload: EnableGradientToolPayload): GradientToolTypes => ({
  type: ENABLE_GRADIENT_TOOL,
  payload
});

export const disableGradientTool = (): GradientToolTypes => ({
  type: DISABLE_GRADIENT_TOOL
});

export const toggleGradientToolThunk = (handle?: em.GradientHandle) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Gradient') {
        // removeActiveTools();
        dispatch(disableGradientTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        // removeActiveTools();
        // new GradientTool(handle, state.gradientEditor.prop as em.GradientProp, nativeEvent);
        dispatch(enableGradientTool({handle}));
        dispatch(setCanvasActiveTool({activeTool: 'Gradient'}));
      }
    }
  }
};