export const ENABLE_SHAPE_TOOL = 'ENABLE_SHAPE_TOOL';
export const DISABLE_SHAPE_TOOL = 'DISABLE_SHAPE_TOOL';

export const ENABLE_SELECTION_TOOL = 'ENABLE_SELECTION_TOOL';
export const DISABLE_SELECTION_TOOL = 'DISABLE_SELECTION_TOOL';

export const ENABLE_ARTBOARD_TOOL = 'ENABLE_ARTBOARD_TOOL';
export const DISABLE_ARTBOARD_TOOL = 'DISABLE_ARTBOARD_TOOL';

export const ENABLE_TEXT_TOOL = 'ENABLE_TEXT_TOOL';
export const DISABLE_TEXT_TOOL = 'DISABLE_TEXT_TOOL';

export const DISABLE_ACTIVE_TOOL = 'DISABLE_ACTIVE_TOOL';

export interface EnableShapeToolPayload {
  shapeType: em.ShapeType;
}

interface EnableShapeTool {
  type: typeof ENABLE_SHAPE_TOOL;
  payload: EnableShapeToolPayload;
}

interface DisableShapeTool {
  type: typeof DISABLE_SHAPE_TOOL;
}

interface EnableSelectionTool {
  type: typeof ENABLE_SELECTION_TOOL;
}

interface DisableSelectionTool {
  type: typeof DISABLE_SELECTION_TOOL;
}

interface EnableArtboardTool {
  type: typeof ENABLE_ARTBOARD_TOOL;
}

interface DisableArtboardTool {
  type: typeof DISABLE_ARTBOARD_TOOL;
}

interface EnableTextTool {
  type: typeof ENABLE_TEXT_TOOL;
}

interface DisableTextTool {
  type: typeof DISABLE_TEXT_TOOL;
}

interface DisableActiveTool {
  type: typeof DISABLE_ACTIVE_TOOL;
}

export type ToolTypes = EnableShapeTool |
                        DisableShapeTool |
                        EnableSelectionTool |
                        DisableSelectionTool |
                        EnableArtboardTool |
                        DisableArtboardTool |
                        EnableTextTool |
                        DisableTextTool |
                        DisableActiveTool;