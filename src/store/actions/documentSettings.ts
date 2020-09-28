import { v4 as uuidv4 } from 'uuid';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';
import { updateInViewLayers } from './layer';

import {
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  ADD_DOCUMENT_IMAGE,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
  AddDocumentImagePayload,
  SetCanvasMatrixPayload,
  SetCanvasColorFormatPayload,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetLeftSidebarWidthPayload,
  SetRightSidebarWidthPayload,
  SetTweenDrawerHeightPayload,
  SetTweenDrawerLayersWidthPayload,
  SetArtboardPresetDeviceOrientationPayload,
  SetArtboardPresetDevicePlatformPayload,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export const saveDocumentAs = (payload: SaveDocumentAsPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT_AS,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const saveDocument = (payload: SaveDocumentPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT,
  payload
});

export const addDocumentImage = (payload: AddDocumentImagePayload): DocumentSettingsTypes => ({
  type: ADD_DOCUMENT_IMAGE,
  payload
});

export const setCanvasMatrix = (payload: SetCanvasMatrixPayload): DocumentSettingsTypes => ({
  type: SET_CANVAS_MATRIX,
  payload
});

export const setCanvasColorFormat = (payload: SetCanvasColorFormatPayload): DocumentSettingsTypes => ({
  type: SET_CANVAS_COLOR_FORMAT,
  payload
});

export const addArtboardPreset = (payload: AddArtboardPresetPayload): DocumentSettingsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): DocumentSettingsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): DocumentSettingsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});

export const setLeftSidebarWidth = (payload: SetLeftSidebarWidthPayload): DocumentSettingsTypes => ({
  type: SET_LEFT_SIDEBAR_WIDTH,
  payload
});

export const setRightSidebarWidth = (payload: SetRightSidebarWidthPayload): DocumentSettingsTypes => ({
  type: SET_RIGHT_SIDEBAR_WIDTH,
  payload
});

export const setTweenDrawerHeight = (payload: SetTweenDrawerHeightPayload): DocumentSettingsTypes => ({
  type: SET_TWEEN_DRAWER_HEIGHT,
  payload
});

export const setTweenDrawerLayersWidth = (payload: SetTweenDrawerLayersWidthPayload): DocumentSettingsTypes => ({
  type: SET_TWEEN_DRAWER_LAYERS_WIDTH,
  payload
});

export const setArtboardPresetDeviceOrientation = (payload: SetArtboardPresetDeviceOrientationPayload): DocumentSettingsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  payload
});

export const setArtboardPresetDevicePlatform = (payload: SetArtboardPresetDevicePlatformPayload): DocumentSettingsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  payload
});

export const openRightSidebar = (): DocumentSettingsTypes => ({
  type: OPEN_RIGHT_SIDEBAR
});

export const closeRightSidebar = (): DocumentSettingsTypes => ({
  type: CLOSE_RIGHT_SIDEBAR
});

export const toggleRightSidebarThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.documentSettings.view.rightSidebar.isOpen) {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width + state.documentSettings.view.rightSidebar.width, paperMain.view.viewSize.height);
      dispatch(closeRightSidebar());
    } else {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width - state.documentSettings.view.rightSidebar.width, paperMain.view.viewSize.height);
      dispatch(openRightSidebar());
    }
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};

export const openLeftSidebar = (): DocumentSettingsTypes => ({
  type: OPEN_LEFT_SIDEBAR
});

export const closeLeftSidebar = (): DocumentSettingsTypes => ({
  type: CLOSE_LEFT_SIDEBAR
});

export const toggleLeftSidebarThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.documentSettings.view.leftSidebar.isOpen) {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width + state.documentSettings.view.leftSidebar.width, paperMain.view.viewSize.height);
      dispatch(closeLeftSidebar());
    } else {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width - state.documentSettings.view.leftSidebar.width, paperMain.view.viewSize.height);
      dispatch(openLeftSidebar());
    }
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};

export const openTweenDrawer = (): DocumentSettingsTypes => ({
  type: OPEN_TWEEN_DRAWER
});

export const closeTweenDrawer = (): DocumentSettingsTypes => ({
  type: CLOSE_TWEEN_DRAWER
});

export const toggleTweenDrawerThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.documentSettings.view.tweenDrawer.isOpen) {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width, paperMain.view.viewSize.height + state.documentSettings.view.tweenDrawer.height);
      dispatch(closeTweenDrawer());
    } else {
      paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width, paperMain.view.viewSize.height - state.documentSettings.view.tweenDrawer.height);
      dispatch(openTweenDrawer());
    }
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};