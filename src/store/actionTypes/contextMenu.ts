export const OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';
export const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';

export interface OpenContextMenuPayload {
  type: Btwx.ContextMenu;
  id: string;
  x: number;
  y: number;
  paperX: number;
  paperY: number;
  data?: any;
}

export interface OpenContextMenu {
  type: typeof OPEN_CONTEXT_MENU;
  payload: OpenContextMenuPayload;
}

export interface CloseContextMenu {
  type: typeof CLOSE_CONTEXT_MENU;
}

export type ContextMenuTypes = OpenContextMenu | CloseContextMenu;