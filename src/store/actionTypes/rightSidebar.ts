export const OPEN_RIGHT_SIDEBAR = 'OPEN_RIGHT_SIDEBAR';
export const CLOSE_RIGHT_SIDEBAR = 'CLOSE_RIGHT_SIDEBAR';

export interface OpenRightSidebar {
  type: typeof OPEN_RIGHT_SIDEBAR;
}

export interface CloseRightSidebar {
  type: typeof CLOSE_RIGHT_SIDEBAR;
}

export type RightSidebarTypes = OpenRightSidebar | CloseRightSidebar;