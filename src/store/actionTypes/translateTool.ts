export const ENABLE_TRANSLATE_TOOL = 'ENABLE_TRANSLATE_TOOL';
export const DISABLE_TRANSLATE_TOOL = 'DISABLE_TRANSLATE_TOOL';

interface EnableTranslateTool {
  type: typeof ENABLE_TRANSLATE_TOOL;
}

interface DisableTranslateTool {
  type: typeof DISABLE_TRANSLATE_TOOL;
}

export type TranslateToolTypes = EnableTranslateTool |
                                 DisableTranslateTool;