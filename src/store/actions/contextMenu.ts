import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OpenContextMenuPayload,
  ContextMenuTypes
} from '../actionTypes/contextMenu';

export const openContextMenu = (payload: OpenContextMenuPayload): ContextMenuTypes => ({
  type: OPEN_CONTEXT_MENU,
  payload
});

export const closeContextMenu = (): ContextMenuTypes => ({
  type: CLOSE_CONTEXT_MENU
});