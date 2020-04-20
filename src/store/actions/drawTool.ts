import { ENABLE_DRAW_TOOL, DISABLE_DRAW_TOOL } from '../actionTypes/drawTool';

export const enableDrawTool = (content: {drawShapeType: em.ShapeType}) => ({
  type: ENABLE_DRAW_TOOL,
  payload: content
});

export const disableDrawTool = () => ({
  type: DISABLE_DRAW_TOOL
});