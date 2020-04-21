export const ENABLE_DRAW_TOOL = 'ENABLE_DRAW_TOOL';
export const DISABLE_DRAW_TOOL = 'DISABLE_DRAW_TOOL';

export interface EnableDrawToolPayload {
  drawShapeType: em.ShapeType;
}

interface EnableDrawTool {
  type: typeof ENABLE_DRAW_TOOL;
  payload: EnableDrawToolPayload;
}

interface DisableDrawTool {
  type: typeof DISABLE_DRAW_TOOL;
}

export type DrawToolTypes = EnableDrawTool | DisableDrawTool;