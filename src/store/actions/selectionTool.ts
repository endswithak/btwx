import { RootState } from '../reducers';
import SelectionTool from '../../canvas/selectionTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_SELECTION_TOOL,
  SET_SELECTION_TOOL_RESIZE_TYPE,
  DISABLE_SELECTION_TOOL,
  EnableSelectionToolPayload,
  SetSelectionToolResizeTypePayload,
  SelectionToolTypes
} from '../actionTypes/selectionTool';

export const enableSelectionTool = (payload: EnableSelectionToolPayload): SelectionToolTypes => ({
  type: ENABLE_SELECTION_TOOL,
  payload
});

export const setSelectionToolResizeType = (payload: SetSelectionToolResizeTypePayload): SelectionToolTypes => ({
  type: SET_SELECTION_TOOL_RESIZE_TYPE,
  payload
});

export const disableSelectionTool = (): SelectionToolTypes => ({
  type: DISABLE_SELECTION_TOOL
});

export const toggleSelectionToolThunk = (nativeEvent: any, hitResult: em.HitResult, resizeType?: em.ResizeType) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Selection') {
        removeActiveTools();
        dispatch(disableSelectionTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        removeActiveTools();
        new SelectionTool(nativeEvent, hitResult);
        dispatch(enableSelectionTool({resizeType}));
        dispatch(setCanvasActiveTool({activeTool: 'Selection'}));
      }
    }
  }
};