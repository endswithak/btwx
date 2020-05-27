export const ENABLE_RECTANGLE_DRAW_TOOL = 'ENABLE_RECTANGLE_DRAW_TOOL';
export const ENABLE_ELLIPSE_DRAW_TOOL = 'ENABLE_ELLIPSE_DRAW_TOOL';
export const ENABLE_STAR_DRAW_TOOL = 'ENABLE_STAR_DRAW_TOOL';
export const ENABLE_POLYGON_DRAW_TOOL = 'ENABLE_POLYGON_DRAW_TOOL';
export const ENABLE_ROUNDED_DRAW_TOOL = 'ENABLE_ROUNDED_DRAW_TOOL';

export const ENABLE_SELECTION_TOOL = 'ENABLE_SELECTION_TOOL';
export const DISABLE_SELECTION_TOOL = 'DISABLE_SELECTION_TOOL';

export const ENABLE_DRAG_TOOL = 'ENABLE_DRAG_TOOL';

export const ENABLE_ARTBOARD_TOOL = 'ENABLE_ARTBOARD_TOOL';

export const ENABLE_TEXT_TOOL = 'ENABLE_TEXT_TOOL';

interface EnableRectangleDrawTool {
  type: typeof ENABLE_RECTANGLE_DRAW_TOOL;
}

interface EnableEllipseDrawTool {
  type: typeof ENABLE_ELLIPSE_DRAW_TOOL;
}

interface EnableStarDrawTool {
  type: typeof ENABLE_STAR_DRAW_TOOL;
}

interface EnablePolygonDrawTool {
  type: typeof ENABLE_POLYGON_DRAW_TOOL;
}

interface EnableRoundedDrawTool {
  type: typeof ENABLE_ROUNDED_DRAW_TOOL;
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

interface EnableTextTool {
  type: typeof ENABLE_TEXT_TOOL;
}

export type ToolTypes = EnableRectangleDrawTool | EnableEllipseDrawTool | EnableStarDrawTool | EnablePolygonDrawTool | EnableRoundedDrawTool | EnableSelectionTool | DisableSelectionTool | EnableDragTool | EnableArtboardTool | EnableTextTool;