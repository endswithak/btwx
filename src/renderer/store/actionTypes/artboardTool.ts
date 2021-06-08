export const ENABLE_ARTBOARD_TOOL = 'ENABLE_ARTBOARD_TOOL';
export const DISABLE_ARTBOARD_TOOL = 'DISABLE_ARTBOARD_TOOL';

interface EnableArtboardTool {
  type: typeof ENABLE_ARTBOARD_TOOL;
}

interface DisableArtboardTool {
  type: typeof DISABLE_ARTBOARD_TOOL;
}

export type ArtboardToolTypes = EnableArtboardTool |
                                DisableArtboardTool;