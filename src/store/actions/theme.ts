import {
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  ThemeTypes
} from '../actionTypes/theme';

export const enableDarkTheme = (): ThemeTypes => ({
  type: ENABLE_DARK_THEME
});

export const enableLightTheme = (): ThemeTypes => ({
  type: ENABLE_LIGHT_THEME
});