import { ENABLE_SELECTION_TOOL, DISABLE_SELECTION_TOOL, SelectionToolTypes } from '../actionTypes/selectionTool';

export const enableSelectionTool = (): SelectionToolTypes => ({
  type: ENABLE_SELECTION_TOOL
});

export const disableSelectionTool = (): SelectionToolTypes => ({
  type: DISABLE_SELECTION_TOOL
});