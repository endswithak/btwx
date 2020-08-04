import {
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  RightSidebarTypes
} from '../actionTypes/rightSidebar';

export const openRightSidebar = (): RightSidebarTypes => ({
  type: OPEN_RIGHT_SIDEBAR
});

export const closeRightSidebar = (): RightSidebarTypes => ({
  type: CLOSE_RIGHT_SIDEBAR
});