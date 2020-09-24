import { RootState } from '../reducers';
import ShapeTool from '../../canvas/shapeTool';
import { setCanvasActiveTool } from './canvasSettings';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_SHAPE_TOOL,
  SET_SHAPE_TOOL_TYPE,
  DISABLE_SHAPE_TOOL,
  EnableShapeToolPayload,
  SetShapeToolTypePayload,
  ShapeToolTypes
} from '../actionTypes/shapeTool';

export const enableShapeTool = (payload: EnableShapeToolPayload): ShapeToolTypes => ({
  type: ENABLE_SHAPE_TOOL,
  payload
});

export const setShapeToolType = (payload: SetShapeToolTypePayload): ShapeToolTypes => ({
  type: SET_SHAPE_TOOL_TYPE,
  payload
});

export const disableShapeTool = (): ShapeToolTypes => ({
  type: DISABLE_SHAPE_TOOL
});

export const toggleShapeToolThunk = (shapeType: em.ShapeType) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === shapeType) {
        removeActiveTools();
        dispatch(disableShapeTool());
        dispatch(setCanvasActiveTool({activeTool: null}));
      } else {
        removeActiveTools();
        new ShapeTool(shapeType);
        dispatch(enableShapeTool({shapeType}));
        dispatch(setCanvasActiveTool({activeTool: 'Shape'}));
      }
    }
  }
};