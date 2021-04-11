export const OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';

export interface OpenContextMenuPayload {
  menuId?: string;
  type: Btwx.ContextMenuType;
  id: string;
}

export interface OpenContextMenu {
  type: typeof OPEN_CONTEXT_MENU;
  payload: OpenContextMenuPayload;
}

export type ContextMenuTypes = OpenContextMenu;