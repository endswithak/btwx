/* eslint-disable @typescript-eslint/no-use-before-define */
import ShapeTool from '../../canvas/shapeTool';
import SelectionTool from '../../canvas/selectionTool';
import ArtboardTool from '../../canvas/artboardTool';
import TextTool from '../../canvas/textTool';
import { removeActiveTools } from '../../canvas/utils';
import { RootState } from '../reducers';

import {
  ENABLE_SHAPE_TOOL,
  DISABLE_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  DISABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  DISABLE_TEXT_TOOL,
  DISABLE_ACTIVE_TOOL,
  EnableShapeToolPayload,
  ToolTypes
} from '../actionTypes/tool';

export const enableShapeTool = (payload: EnableShapeToolPayload): ToolTypes => ({
  type: ENABLE_SHAPE_TOOL,
  payload
});

export const toggleShapeToolThunk = (shapeType: em.ShapeType) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.tool.type === 'Shape' && state.tool.shapeToolType === shapeType) {
        dispatch(disableActiveToolThunk() as any);
      } else {
        removeActiveTools();
        new ShapeTool(shapeType);
        dispatch(enableShapeTool({shapeType}));
      }
    }
  }
};

export const disableShapeTool = (): ToolTypes => ({
  type: DISABLE_SHAPE_TOOL
});

export const enableSelectionTool = (): ToolTypes => ({
  type: ENABLE_SELECTION_TOOL
});

export const toggleSelectionToolThunk = (nativeEvent: any, hitResult: em.HitResult) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.tool.type === 'Selection') {
        dispatch(disableActiveToolThunk() as any);
      } else {
        removeActiveTools();
        new SelectionTool(nativeEvent, hitResult);
        dispatch(enableSelectionTool());
      }
    }
  }
};

export const disableSelectionTool = (): ToolTypes => ({
  type: DISABLE_SELECTION_TOOL
});

export const enableTextTool = (): ToolTypes => ({
  type: ENABLE_TEXT_TOOL
});

export const toggleTextToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.tool.type === 'Text') {
        dispatch(disableActiveToolThunk() as any);
      } else {
        removeActiveTools();
        new TextTool();
        dispatch(enableTextTool());
      }
    }
  }
};

export const disableTextTool = (): ToolTypes => ({
  type: DISABLE_TEXT_TOOL
});

export const enableArtboardTool = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL
});

export const toggleArtboardToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing) {
      if (state.tool.type === 'Artboard') {
        dispatch(disableActiveToolThunk() as any);
      } else {
        removeActiveTools();
        new ArtboardTool();
        dispatch(enableArtboardTool());
      }
    }
  }
};

export const disableArtboardTool = (): ToolTypes => ({
  type: DISABLE_ARTBOARD_TOOL
});

export const disableActiveTool = (): ToolTypes => ({
  type: DISABLE_ACTIVE_TOOL
});

export const disableActiveToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    dispatch(disableActiveTool());
  }
}