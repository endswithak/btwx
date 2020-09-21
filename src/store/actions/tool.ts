import ShapeTool from '../../canvas/shapeTool';
import SelectionTool from '../../canvas/selectionTool';
import ArtboardTool from '../../canvas/artboardTool';
import TextTool from '../../canvas/textTool';
import { removeActiveTools } from '../../canvas/utils';

import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_LINE_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  ToolTypes
} from '../actionTypes/tool';

export const enableRectangleShapeTool = (): ToolTypes => ({
  type: ENABLE_RECTANGLE_SHAPE_TOOL
});

export const enableRectangleShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Rectangle');
    dispatch(enableRectangleShapeTool());
  }
};

export const enableEllipseShapeTool = (): ToolTypes => ({
  type: ENABLE_ELLIPSE_SHAPE_TOOL
});

export const enableEllipseShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Ellipse');
    dispatch(enableEllipseShapeTool());
  }
};

export const enableStarShapeTool = (): ToolTypes => ({
  type: ENABLE_STAR_SHAPE_TOOL
});

export const enableStarShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Star');
    dispatch(enableStarShapeTool());
  }
};

export const enablePolygonShapeTool = (): ToolTypes => ({
  type: ENABLE_POLYGON_SHAPE_TOOL
});

export const enablePolygonShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Polygon');
    dispatch(enablePolygonShapeTool());
  }
};

export const enableRoundedShapeTool = (): ToolTypes => ({
  type: ENABLE_ROUNDED_SHAPE_TOOL
});

export const enableRoundedShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Rounded');
    dispatch(enableRoundedShapeTool());
  }
};

export const enableLineShapeTool = (): ToolTypes => ({
  type: ENABLE_LINE_SHAPE_TOOL
});

export const enableLineShapeToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ShapeTool('Line');
    dispatch(enableLineShapeTool());
  }
};

export const enableSelectionTool = (): ToolTypes => ({
  type: ENABLE_SELECTION_TOOL
});

export const enableSelectionToolThunk = (e?: any) => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new SelectionTool(e);
    dispatch(enableSelectionTool());
  }
};

export const enableTextTool = (): ToolTypes => ({
  type: ENABLE_TEXT_TOOL
});

export const enableTextToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new TextTool();
    dispatch(enableTextTool());
  }
};

export const enableArtboardTool = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL
});

export const enableArtboardToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    removeActiveTools();
    new ArtboardTool();
    dispatch(enableArtboardTool());
  }
};