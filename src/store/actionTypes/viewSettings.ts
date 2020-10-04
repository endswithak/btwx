export const SET_LEFT_SIDEBAR_WIDTH = 'SET_LEFT_SIDEBAR_WIDTH';
export const SET_RIGHT_SIDEBAR_WIDTH = 'SET_RIGHT_SIDEBAR_WIDTH';
export const SET_TWEEN_DRAWER_HEIGHT = 'SET_TWEEN_DRAWER_HEIGHT';
export const SET_TWEEN_DRAWER_LAYERS_WIDTH = 'SET_TWEEN_DRAWER_LAYERS_WIDTH';

export const OPEN_LEFT_SIDEBAR = 'OPEN_LEFT_SIDEBAR';
export const CLOSE_LEFT_SIDEBAR = 'CLOSE_LEFT_SIDEBAR';

export const OPEN_RIGHT_SIDEBAR = 'OPEN_RIGHT_SIDEBAR';
export const CLOSE_RIGHT_SIDEBAR = 'CLOSE_RIGHT_SIDEBAR';

export const OPEN_TWEEN_DRAWER = 'OPEN_TWEEN_DRAWER';
export const CLOSE_TWEEN_DRAWER = 'CLOSE_TWEEN_DRAWER';

export const ENABLE_DARK_THEME = 'ENABLE_DARK_THEME';
export const ENABLE_LIGHT_THEME = 'ENABLE_LIGHT_THEME';

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

export interface SetTweenDrawerHeightPayload {
  height: number;
}

export interface SetTweenDrawerHeight {
  type: typeof SET_TWEEN_DRAWER_HEIGHT;
  payload: SetTweenDrawerHeightPayload;
}

export interface SetTweenDrawerLayersWidthPayload {
  width: number;
}

export interface SetTweenDrawerLayersWidth {
  type: typeof SET_TWEEN_DRAWER_LAYERS_WIDTH;
  payload: SetTweenDrawerLayersWidthPayload;
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

export interface OpenTweenDrawer {
  type: typeof OPEN_TWEEN_DRAWER;
}

export interface CloseTweenDrawer {
  type: typeof CLOSE_TWEEN_DRAWER;
}

export interface EnableDarkTheme {
  type: typeof ENABLE_DARK_THEME;
}

export interface EnableLightTheme {
  type: typeof ENABLE_LIGHT_THEME;
}

export type ViewSettingsTypes = SetLeftSidebarWidth |
                                SetRightSidebarWidth |
                                SetTweenDrawerHeight |
                                SetTweenDrawerLayersWidth |
                                OpenLeftSidebar |
                                CloseLeftSidebar |
                                OpenRightSidebar |
                                CloseRightSidebar |
                                OpenTweenDrawer |
                                CloseTweenDrawer |
                                EnableDarkTheme |
                                EnableLightTheme;