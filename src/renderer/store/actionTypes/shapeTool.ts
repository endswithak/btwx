export const ENABLE_SHAPE_TOOL = 'ENABLE_SHAPE_TOOL';
export const SET_SHAPE_TOOL_TYPE = 'SET_SHAPE_TOOL_TYPE';
export const DISABLE_SHAPE_TOOL = 'DISABLE_SHAPE_TOOL';

export interface EnableShapeToolPayload {
  shapeType: Btwx.ShapeType;
}

interface EnableShapeTool {
  type: typeof ENABLE_SHAPE_TOOL;
  payload: EnableShapeToolPayload;
}

export interface SetShapeToolTypePayload {
  shapeType: Btwx.ShapeType;
}

interface SetShapeToolType {
  type: typeof SET_SHAPE_TOOL_TYPE;
  payload: SetShapeToolTypePayload;
}

interface DisableShapeTool {
  type: typeof DISABLE_SHAPE_TOOL;
}

export type ShapeToolTypes = EnableShapeTool |
                             SetShapeToolType |
                             DisableShapeTool;