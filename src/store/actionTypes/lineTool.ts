export const ENABLE_LINE_TOOL = 'ENABLE_LINE_TOOL';
export const DISABLE_LINE_TOOL = 'DISABLE_LINE_TOOL';

export interface EnableLineToolPayload {
  handle: em.LineHandle;
}

interface EnableLineTool {
  type: typeof ENABLE_LINE_TOOL;
  payload: EnableLineToolPayload;
}

interface DisableLineTool {
  type: typeof DISABLE_LINE_TOOL;
}

export type LineToolTypes = EnableLineTool |
                            DisableLineTool;