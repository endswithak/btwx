export const ENABLE_SELECTION_TOOL = 'ENABLE_SELECTION_TOOL';
export const DISABLE_SELECTION_TOOL = 'DISABLE_SELECTION_TOOL';

interface EnableSelectionTool {
  type: typeof ENABLE_SELECTION_TOOL;
}

interface DisableSelectionTool {
  type: typeof DISABLE_SELECTION_TOOL;
}

export type SelectionToolTypes = EnableSelectionTool | DisableSelectionTool;