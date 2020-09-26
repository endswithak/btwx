export const ENABLE_AREA_SELECT_TOOL = 'ENABLE_AREA_SELECT_TOOL';
export const SET_AREA_SELECT_TOOL_TYPE = 'SET_AREA_SELECT_TOOL_TYPE';
export const DISABLE_AREA_SELECT_TOOL = 'DISABLE_AREA_SELECT_TOOL';

interface EnableAreaSelectTool {
  type: typeof ENABLE_AREA_SELECT_TOOL;
}

interface DisableAreaSelectTool {
  type: typeof DISABLE_AREA_SELECT_TOOL;
}

export type AreaSelectToolTypes = EnableAreaSelectTool |
                                  DisableAreaSelectTool;