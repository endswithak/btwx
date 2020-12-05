import { uiPaperScope } from '../../canvas';
import { RootState } from '../reducers';
import { setCanvasMatrix } from './documentSettings';

import {
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  SetLeftSidebarWidthPayload,
  SetRightSidebarWidthPayload,
  SetTweenDrawerHeightPayload,
  SetTweenDrawerLayersWidthPayload,
  ViewSettingsTypes
} from '../actionTypes/viewSettings';
import { getAllPaperScopes } from '../selectors/layer';

export const setLeftSidebarWidth = (payload: SetLeftSidebarWidthPayload): ViewSettingsTypes => ({
  type: SET_LEFT_SIDEBAR_WIDTH,
  payload
});

export const setRightSidebarWidth = (payload: SetRightSidebarWidthPayload): ViewSettingsTypes => ({
  type: SET_RIGHT_SIDEBAR_WIDTH,
  payload
});

export const setTweenDrawerHeight = (payload: SetTweenDrawerHeightPayload): ViewSettingsTypes => ({
  type: SET_TWEEN_DRAWER_HEIGHT,
  payload
});

export const setTweenDrawerLayersWidth = (payload: SetTweenDrawerLayersWidthPayload): ViewSettingsTypes => ({
  type: SET_TWEEN_DRAWER_LAYERS_WIDTH,
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
    const allPaperScopes = getAllPaperScopes(state);
    if (state.viewSettings.rightSidebar.isOpen) {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width + state.viewSettings.rightSidebar.width, paperScope.view.viewSize.height);
      });
      dispatch(closeRightSidebar());
    } else {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width - state.viewSettings.rightSidebar.width, paperScope.view.viewSize.height);
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
    const allPaperScopes = getAllPaperScopes(state);
    if (state.viewSettings.leftSidebar.isOpen) {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width + state.viewSettings.leftSidebar.width, paperScope.view.viewSize.height);
      });
      dispatch(closeLeftSidebar());
    } else {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width - state.viewSettings.leftSidebar.width, paperScope.view.viewSize.height);
      });
      dispatch(openLeftSidebar());
    }
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const openTweenDrawer = (): ViewSettingsTypes => ({
  type: OPEN_TWEEN_DRAWER
});

export const closeTweenDrawer = (): ViewSettingsTypes => ({
  type: CLOSE_TWEEN_DRAWER
});

export const toggleTweenDrawerThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    if (state.viewSettings.tweenDrawer.isOpen) {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width, paperScope.view.viewSize.height + state.viewSettings.tweenDrawer.height);
      });
      dispatch(closeTweenDrawer());
    } else {
      Object.keys(allPaperScopes).forEach((key, index) => {
        const paperScope = allPaperScopes[key];
        paperScope.view.viewSize = new uiPaperScope.Size(paperScope.view.viewSize.width, paperScope.view.viewSize.height - state.viewSettings.tweenDrawer.height);
      });
      dispatch(openTweenDrawer());
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