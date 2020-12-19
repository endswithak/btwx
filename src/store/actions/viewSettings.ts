import { uiPaperScope } from '../../canvas';
import { RootState } from '../reducers';
import { setCanvasMatrix } from './documentSettings';
import { getAllProjectIndices } from '../selectors/layer';

import {
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_EVENT_DRAWER_HEIGHT,
  SET_EVENT_DRAWER_LAYERS_WIDTH,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_EVENT_DRAWER,
  CLOSE_EVENT_DRAWER,
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  SetLeftSidebarWidthPayload,
  SetRightSidebarWidthPayload,
  SetEventDrawerHeightPayload,
  SetEventDrawerLayersWidthPayload,
  ViewSettingsTypes
} from '../actionTypes/viewSettings';

export const setLeftSidebarWidth = (payload: SetLeftSidebarWidthPayload): ViewSettingsTypes => ({
  type: SET_LEFT_SIDEBAR_WIDTH,
  payload
});

export const setRightSidebarWidth = (payload: SetRightSidebarWidthPayload): ViewSettingsTypes => ({
  type: SET_RIGHT_SIDEBAR_WIDTH,
  payload
});

export const setEventDrawerHeight = (payload: SetEventDrawerHeightPayload): ViewSettingsTypes => ({
  type: SET_EVENT_DRAWER_HEIGHT,
  payload
});

export const setEventDrawerLayersWidth = (payload: SetEventDrawerLayersWidthPayload): ViewSettingsTypes => ({
  type: SET_EVENT_DRAWER_LAYERS_WIDTH,
  payload
});

export const openRightSidebar = (): ViewSettingsTypes => ({
  type: OPEN_RIGHT_SIDEBAR
});

export const closeRightSidebar = (): ViewSettingsTypes => ({
  type: CLOSE_RIGHT_SIDEBAR
});

export const toggleRightSidebarThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    if (state.viewSettings.rightSidebar.isOpen) {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width + state.viewSettings.rightSidebar.width, project.view.viewSize.height);
      });
      dispatch(closeRightSidebar());
    } else {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width - state.viewSettings.rightSidebar.width, project.view.viewSize.height);
      });
      dispatch(openRightSidebar());
    }
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const openLeftSidebar = (): ViewSettingsTypes => ({
  type: OPEN_LEFT_SIDEBAR
});

export const closeLeftSidebar = (): ViewSettingsTypes => ({
  type: CLOSE_LEFT_SIDEBAR
});

export const toggleLeftSidebarThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    if (state.viewSettings.leftSidebar.isOpen) {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width + state.viewSettings.leftSidebar.width, project.view.viewSize.height);
      });
      dispatch(closeLeftSidebar());
    } else {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width - state.viewSettings.leftSidebar.width, project.view.viewSize.height);
      });
      dispatch(openLeftSidebar());
    }
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const openEventDrawer = (): ViewSettingsTypes => ({
  type: OPEN_EVENT_DRAWER
});

export const closeEventDrawer = (): ViewSettingsTypes => ({
  type: CLOSE_EVENT_DRAWER
});

export const toggleEventDrawerThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    if (state.viewSettings.eventDrawer.isOpen) {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width, project.view.viewSize.height + state.viewSettings.eventDrawer.height);
      });
      dispatch(closeEventDrawer());
    } else {
      allProjectIndices.forEach((current, index) => {
        const project = uiPaperScope.projects[current];
        project.view.viewSize = new uiPaperScope.Size(project.view.viewSize.width, project.view.viewSize.height - state.viewSettings.eventDrawer.height);
      });
      dispatch(openEventDrawer());
    }
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const enableDarkTheme = (): ViewSettingsTypes => ({
  type: ENABLE_DARK_THEME
});

export const enableLightTheme = (): ViewSettingsTypes => ({
  type: ENABLE_LIGHT_THEME
});