import { RootState } from '../reducers';
import DragTool from '../../canvas/dragTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_DRAG_TOOL,
  DISABLE_DRAG_TOOL,
  EnableDragToolPayload,
  DragToolTypes
} from '../actionTypes/dragTool';

export const enableDragTool = (payload: EnableDragToolPayload): DragToolTypes => ({
  type: ENABLE_DRAG_TOOL,
  payload
});

export const disableDragTool = (): DragToolTypes => ({
  type: DISABLE_DRAG_TOOL
});

export const toggleDragToolThunk = (handle: boolean, nativeEvent: any) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Drag') {
        removeActiveTools();
        dispatch(disableDragTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        removeActiveTools();
        new DragTool(handle, nativeEvent);
        dispatch(enableDragTool({handle}));
        dispatch(setCanvasActiveTool({activeTool: 'Drag'}));
      }
    }
  }
};