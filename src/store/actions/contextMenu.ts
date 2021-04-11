import { v4 as uuidv4 } from 'uuid';

import {
  OPEN_CONTEXT_MENU,
  OpenContextMenuPayload,
  ContextMenuTypes
} from '../actionTypes/contextMenu';

export const openContextMenu = (payload: OpenContextMenuPayload): ContextMenuTypes => ({
  type: OPEN_CONTEXT_MENU,
  payload: {
    ...payload,
    menuId: uuidv4()
  }
});