import { ENABLE_DRAW_TOOL, DISABLE_DRAW_TOOL, EnableDrawToolPayload, DrawToolTypes } from '../actionTypes/drawTool';

export const enableDrawTool = (content: EnableDrawToolPayload): DrawToolTypes => ({
  type: ENABLE_DRAW_TOOL,
  payload: content
});

export const disableDrawTool = (): DrawToolTypes => ({
  type: DISABLE_DRAW_TOOL
});