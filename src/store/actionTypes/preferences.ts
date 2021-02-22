export const OPEN_PREFERENCES = 'OPEN_PREFERENCES';
export const CLOSE_PREFERENCES = 'CLOSE_PREFERENCES';

export const SET_PREFERENCES_TAB = 'SET_PREFERENCES_TAB';

export const ENABLE_DARK_THEME = 'ENABLE_DARK_THEME';
export const ENABLE_LIGHT_THEME = 'ENABLE_LIGHT_THEME';

export const SET_CANVAS_THEME = 'SET_CANVAS_THEME';

export const ENABLE_AUTO_SAVE = 'ENABLE_AUTOSAVE';
export const DISABLE_AUTO_SAVE = 'DISABLE_AUTOSAVE';

export interface OpenPreferences {
  type: typeof OPEN_PREFERENCES;
}

export interface ClosePreferences {
  type: typeof CLOSE_PREFERENCES;
}

export interface SetPreferencesTabPayload {
  tab: Btwx.PreferencesTab;
}

export interface SetPreferencesTab {
  type: typeof SET_PREFERENCES_TAB;
  payload: SetPreferencesTabPayload;
}

export interface EnableDarkTheme {
  type: typeof ENABLE_DARK_THEME;
}

export interface EnableLightTheme {
  type: typeof ENABLE_LIGHT_THEME;
}

export interface SetCanvasThemePayload {
  canvasTheme: Btwx.CanvasTheme;
}

export interface SetCanvasTheme {
  type: typeof SET_CANVAS_THEME;
  payload: SetCanvasThemePayload;
}

export interface EnableAutoSave {
  type: typeof ENABLE_AUTO_SAVE;
}

export interface DisableAutoSave {
  type: typeof DISABLE_AUTO_SAVE;
}

export type PreferencesTypes = OpenPreferences |
                               ClosePreferences |
                               SetPreferencesTab |
                               SetCanvasTheme |
                               EnableDarkTheme |
                               EnableLightTheme |
                               EnableAutoSave |
                               DisableAutoSave;