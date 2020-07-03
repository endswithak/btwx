export const ENABLE_DARK_THEME = 'ENABLE_DARK_THEME';
export const ENABLE_LIGHT_THEME = 'ENABLE_LIGHT_THEME';

export interface EnableDarkTheme {
  type: typeof ENABLE_DARK_THEME;
}

export interface EnableLightTheme {
  type: typeof ENABLE_LIGHT_THEME;
}

export type ThemeTypes = EnableDarkTheme | EnableLightTheme;