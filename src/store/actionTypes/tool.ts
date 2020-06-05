export const ENABLE_RECTANGLE_SHAPE_TOOL = 'ENABLE_RECTANGLE_SHAPE_TOOL';
export const ENABLE_ELLIPSE_SHAPE_TOOL = 'ENABLE_ELLIPSE_SHAPE_TOOL';
export const ENABLE_STAR_SHAPE_TOOL = 'ENABLE_STAR_SHAPE_TOOL';
export const ENABLE_POLYGON_SHAPE_TOOL = 'ENABLE_POLYGON_SHAPE_TOOL';
export const ENABLE_ROUNDED_SHAPE_TOOL = 'ENABLE_ROUNDED_SHAPE_TOOL';

export const ENABLE_SELECTION_TOOL = 'ENABLE_SELECTION_TOOL';
export const DISABLE_SELECTION_TOOL = 'DISABLE_SELECTION_TOOL';

export const ENABLE_DRAG_TOOL = 'ENABLE_DRAG_TOOL';

export const ENABLE_ARTBOARD_TOOL = 'ENABLE_ARTBOARD_TOOL';
export const ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION = 'ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION';
export const ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION = 'ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION';

export const ENABLE_TEXT_TOOL = 'ENABLE_TEXT_TOOL';

interface EnableRectangleShapeTool {
  type: typeof ENABLE_RECTANGLE_SHAPE_TOOL;
}

interface EnableEllipseShapeTool {
  type: typeof ENABLE_ELLIPSE_SHAPE_TOOL;
}

interface EnableStarShapeTool {
  type: typeof ENABLE_STAR_SHAPE_TOOL;
}

interface EnablePolygonShapeTool {
  type: typeof ENABLE_POLYGON_SHAPE_TOOL;
}

interface EnableRoundedShapeTool {
  type: typeof ENABLE_ROUNDED_SHAPE_TOOL;
}

interface EnableSelectionTool {
  type: typeof ENABLE_SELECTION_TOOL;
}

interface DisableSelectionTool {
  type: typeof DISABLE_SELECTION_TOOL;
}

interface EnableDragTool {
  type: typeof ENABLE_DRAG_TOOL;
}

interface EnableArtboardTool {
  type: typeof ENABLE_ARTBOARD_TOOL;
}

interface EnableArtboardToolPortaitOrientation {
  type: typeof ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION;
}

interface EnableArtboardToolLandscapeOrientation {
  type: typeof ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION;
}

interface EnableTextTool {
  type: typeof ENABLE_TEXT_TOOL;
}

export type ToolTypes = EnableRectangleShapeTool | EnableEllipseShapeTool | EnableStarShapeTool | EnablePolygonShapeTool | EnableRoundedShapeTool | EnableSelectionTool | DisableSelectionTool | EnableDragTool | EnableArtboardTool | EnableArtboardToolPortaitOrientation | EnableArtboardToolLandscapeOrientation | EnableTextTool;