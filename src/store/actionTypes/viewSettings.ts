export const SET_LEFT_SIDEBAR_WIDTH = 'SET_LEFT_SIDEBAR_WIDTH';
export const SET_RIGHT_SIDEBAR_WIDTH = 'SET_RIGHT_SIDEBAR_WIDTH';
export const SET_EVENT_DRAWER_HEIGHT = 'SET_EVENT_DRAWER_HEIGHT';
export const SET_EVENT_DRAWER_LAYERS_WIDTH = 'SET_EVENT_DRAWER_LAYERS_WIDTH';

export const OPEN_LEFT_SIDEBAR = 'OPEN_LEFT_SIDEBAR';
export const CLOSE_LEFT_SIDEBAR = 'CLOSE_LEFT_SIDEBAR';

export const OPEN_RIGHT_SIDEBAR = 'OPEN_RIGHT_SIDEBAR';
export const CLOSE_RIGHT_SIDEBAR = 'CLOSE_RIGHT_SIDEBAR';

export const OPEN_EVENT_DRAWER = 'OPEN_EVENT_DRAWER';
export const CLOSE_EVENT_DRAWER = 'CLOSE_EVENT_DRAWER';

export interface SetLeftSidebarWidthPayload {
  width: number;
}

export interface SetLeftSidebarWidth {
  type: typeof SET_LEFT_SIDEBAR_WIDTH;
  payload: SetLeftSidebarWidthPayload;
}

export interface SetRightSidebarWidthPayload {
  width: number;
}

export interface SetRightSidebarWidth {
  type: typeof SET_RIGHT_SIDEBAR_WIDTH;
  payload: SetRightSidebarWidthPayload;
}

export interface SetEventDrawerHeightPayload {
  height: number;
}

export interface SetEventDrawerHeight {
  type: typeof SET_EVENT_DRAWER_HEIGHT;
  payload: SetEventDrawerHeightPayload;
}

export interface SetEventDrawerLayersWidthPayload {
  width: number;
}

export interface SetEventDrawerLayersWidth {
  type: typeof SET_EVENT_DRAWER_LAYERS_WIDTH;
  payload: SetEventDrawerLayersWidthPayload;
}

export interface OpenRightSidebar {
  type: typeof OPEN_RIGHT_SIDEBAR;
}

export interface CloseRightSidebar {
  type: typeof CLOSE_RIGHT_SIDEBAR;
}

export interface OpenLeftSidebar {
  type: typeof OPEN_LEFT_SIDEBAR;
}

export interface CloseLeftSidebar {
  type: typeof CLOSE_LEFT_SIDEBAR;
}

export interface OpenEventDrawer {
  type: typeof OPEN_EVENT_DRAWER;
}

export interface CloseEventDrawer {
  type: typeof CLOSE_EVENT_DRAWER;
}

export type ViewSettingsTypes = SetLeftSidebarWidth |
                                SetRightSidebarWidth |
                                SetEventDrawerHeight |
                                SetEventDrawerLayersWidth |
                                OpenLeftSidebar |
                                CloseLeftSidebar |
                                OpenRightSidebar |
                                CloseRightSidebar |
                                OpenEventDrawer |
                                CloseEventDrawer;