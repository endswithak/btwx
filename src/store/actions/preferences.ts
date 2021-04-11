import { ipcRenderer } from 'electron';
import { PreferencesState } from '../reducers/preferences';

import {
  OPEN_PREFERENCES,
  CLOSE_PREFERENCES,
  SET_PREFERENCES_TAB,
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  SET_CANVAS_THEME,
  ENABLE_AUTO_SAVE,
  DISABLE_AUTO_SAVE,
  HYDRATE_PREFERENCES,
  SetPreferencesTabPayload,
  SetCanvasThemePayload,
  PreferencesTypes
} from '../actionTypes/preferences';

export const openPreferences = (): PreferencesTypes => ({
  type: OPEN_PREFERENCES
});

export const closePreferences = (): PreferencesTypes => ({
  type: CLOSE_PREFERENCES
});

export const setPreferencesTab = (payload: SetPreferencesTabPayload): PreferencesTypes => ({
  type: SET_PREFERENCES_TAB,
  payload
});

export const enableDarkTheme = (): PreferencesTypes => ({
  type: ENABLE_DARK_THEME
});

export const enableDarkThemeThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(enableDarkTheme());
    ipcRenderer.invoke('setElectronStore', JSON.stringify({
      key: 'preferences.theme',
      value: 'dark'
    }));
    ipcRenderer.invoke('setNativeTheme', 'dark');
  }
};

export const enableLightTheme = (): PreferencesTypes => ({
  type: ENABLE_LIGHT_THEME
});

export const enableLightThemeThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(enableLightTheme());
    ipcRenderer.invoke('setElectronStore', JSON.stringify({
      key: 'preferences.theme',
      value: 'light'
    }));
    ipcRenderer.invoke('setNativeTheme', 'light');
  }
};

export const setCanvasTheme = (payload: SetCanvasThemePayload): PreferencesTypes => ({
  type: SET_CANVAS_THEME,
  payload
});

export const setCanvasThemeThunk = (payload: SetCanvasThemePayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setCanvasTheme(payload));
    ipcRenderer.invoke('setElectronStore', JSON.stringify({
      key: 'preferences.canvasTheme',
      value: payload.canvasTheme
    }));
  }
};

export const enableAutoSave = (): PreferencesTypes => ({
  type: ENABLE_AUTO_SAVE
});

export const enableAutoSaveThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(enableAutoSave());
    ipcRenderer.invoke('setElectronStore', JSON.stringify({
      key: 'preferences.autoSave',
      value: true
    }));
  }
};

export const disableAutoSave = (): PreferencesTypes => ({
  type: DISABLE_AUTO_SAVE
});

export const disableAutoSaveThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(disableAutoSave());
    ipcRenderer.invoke('setElectronStore', JSON.stringify({
      key: 'preferences.autoSave',
      value: false
    }));
  }
};

export const hydratePreferences = (payload: PreferencesState): PreferencesTypes => ({
  type: HYDRATE_PREFERENCES,
  payload
});