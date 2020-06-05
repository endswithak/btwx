import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_DRAG_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION,
  ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION,
  ENABLE_TEXT_TOOL,
  ToolTypes
} from '../actionTypes/tool';

export const enableRectangleShapeTool = (): ToolTypes => ({
  type: ENABLE_RECTANGLE_SHAPE_TOOL
});

export const enableEllipseShapeTool = (): ToolTypes => ({
  type: ENABLE_ELLIPSE_SHAPE_TOOL
});

export const enableStarShapeTool = (): ToolTypes => ({
  type: ENABLE_STAR_SHAPE_TOOL
});

export const enablePolygonShapeTool = (): ToolTypes => ({
  type: ENABLE_POLYGON_SHAPE_TOOL
});

export const enableRoundedShapeTool = (): ToolTypes => ({
  type: ENABLE_ROUNDED_SHAPE_TOOL
});

export const enableSelectionTool = (): ToolTypes => ({
  type: ENABLE_SELECTION_TOOL
});

export const disableSelectionTool = (): ToolTypes => ({
  type: DISABLE_SELECTION_TOOL
});

export const enableDragTool = (): ToolTypes => ({
  type: ENABLE_DRAG_TOOL
});

export const enableArtboardTool = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL
});

export const enableArtboardToolPortaitOrientation = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION
});

export const enableArtboardToolLandscapeOrientation = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION
});

export const enableTextTool = (): ToolTypes => ({
  type: ENABLE_TEXT_TOOL
});