import {
  OPEN_PREFERENCES,
  CLOSE_PREFERENCES,
  SET_PREFERENCES_TAB,
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  ENABLE_AUTO_SAVE,
  DISABLE_AUTO_SAVE,
  SetPreferencesTabPayload,
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

export const enableLightTheme = (): PreferencesTypes => ({
  type: ENABLE_LIGHT_THEME
});

export const enableAutoSave = (): PreferencesTypes => ({
  type: ENABLE_AUTO_SAVE
});

export const disableAutoSave = (): PreferencesTypes => ({
  type: DISABLE_AUTO_SAVE
});