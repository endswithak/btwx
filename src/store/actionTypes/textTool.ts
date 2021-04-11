export const ENABLE_TEXT_TOOL = 'ENABLE_TEXT_TOOL';
export const DISABLE_TEXT_TOOL = 'DISABLE_TEXT_TOOL';

interface EnableTextTool {
  type: typeof ENABLE_TEXT_TOOL;
}

interface DisableTextTool {
  type: typeof DISABLE_TEXT_TOOL;
}

export type TextToolTypes = EnableTextTool |
                            DisableTextTool;