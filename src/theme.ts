/* eslint-disable @typescript-eslint/no-use-before-define */
import tinyColor from 'tinycolor2';

const colorTint = (color: string, weight: number): string => {
  return tinyColor.mix(color, '#ffffff', weight).toHexString();
}

const colorShade = (color: string, weight: number): string => {
  return tinyColor.mix(color, '#000000', weight).toHexString();
}

const contrastRatio = (background: string, foreground: string): number => {
  const l1 = tinyColor(background).getLuminance();
  const l2 = tinyColor(opaque(background, foreground)).getLuminance();

  if (l1 > l2) {
    return (l1 + .05) / (l2 + .05);
  } else {
    return (l2 + .05) / (l1 + .05);
  }
}

const opaque = (background: string, foreground: string): string => {
  return tinyColor.mix(tinyColor(foreground).setAlpha(1).toRgbString(), background, tinyColor(foreground).getAlpha() * 100).toRgbString();
}

const colorContrast = (background: string): string => {
  const foregrounds = ['#fff', '#000'];
  let maxRatio = 0;
  let maxRatioColor = null;

  foregrounds.forEach((foreground) => {
    const cr = contrastRatio(background, foreground);
    if (cr > 3.1) {
      return foreground;
    } else if (cr > maxRatio) {
      maxRatio = cr;
      maxRatioColor = foreground;
    }
  });

  return maxRatioColor;
}

const THEME_ACTIVE_COLOR_WEIGHT = 10;
const THEME_UNIT_SIZE = 4;

// LIGHT
const THEME_LIGHT_PRIMARY = '#007AFF';
const THEME_LIGHT_PRIMARY_ACTIVE = colorShade(THEME_LIGHT_PRIMARY, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_ACCENT = '#FF9500';
const THEME_LIGHT_ACCENT_ACTIVE = colorShade(THEME_LIGHT_ACCENT, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_GRAY = '#8E8E93';
const THEME_LIGHT_GRAY_ACTIVE = colorShade(THEME_LIGHT_GRAY, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_SUCCESS = '#28CD41';
const THEME_LIGHT_SUCCESS_ACTIVE = colorShade(THEME_LIGHT_SUCCESS, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_INFO = '#55BEF0';
const THEME_LIGHT_INFO_ACTIVE = colorShade(THEME_LIGHT_INFO, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_ERROR = '#FF3B30';
const THEME_LIGHT_ERROR_ACTIVE = colorShade(THEME_LIGHT_ERROR, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_WARN = '#FFCC00';
const THEME_LIGHT_WARN_ACTIVE = colorShade(THEME_LIGHT_WARN, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_LIGHT_TEXT_BASE = '#000';
const THEME_LIGHT_TEXT_LIGHT = 'rgba(0,0,0,0.75)';
const THEME_LIGHT_TEXT_LIGHTER = 'rgba(0,0,0,0.50)';
const THEME_LIGHT_TEXT_LIGHTEST = 'rgba(0,0,0,0.33)';
const THEME_LIGHT_TEXT_ON_PRIMARY = colorContrast(THEME_LIGHT_PRIMARY);
const THEME_LIGHT_TEXT_ON_ACCENT = colorContrast(THEME_LIGHT_ACCENT);
const THEME_LIGHT_TEXT_ON_SUCCESS = colorContrast(THEME_LIGHT_SUCCESS);
const THEME_LIGHT_TEXT_ON_INFO = colorContrast(THEME_LIGHT_INFO);
const THEME_LIGHT_TEXT_ON_ERROR = colorContrast(THEME_LIGHT_ERROR);
const THEME_LIGHT_TEXT_ON_WARN = colorContrast(THEME_LIGHT_WARN);
const THEME_LIGHT_BACKGROUND_Z0 = colorTint(THEME_LIGHT_GRAY, 90);
const THEME_LIGHT_BACKGROUND_Z1 = colorTint(THEME_LIGHT_GRAY, 80);
const THEME_LIGHT_BACKGROUND_Z2 = colorTint(THEME_LIGHT_GRAY, 70);
const THEME_LIGHT_BACKGROUND_Z3 = colorTint(THEME_LIGHT_GRAY, 60);
const THEME_LIGHT_BACKGROUND_Z4 = colorTint(THEME_LIGHT_GRAY, 50);
const THEME_LIGHT_BACKGROUND_Z5 = colorTint(THEME_LIGHT_GRAY, 40);
const THEME_LIGHT_BACKGROUND_Z6 = colorTint(THEME_LIGHT_GRAY, 30);
const THEME_LIGHT_BACKGROUND_Z7 = colorTint(THEME_LIGHT_GRAY, 20);
const THEME_LIGHT_BACKGROUND_Z8 = colorTint(THEME_LIGHT_GRAY, 10);
//
const THEME_LIGHT_FOREGROUND_Z0 = colorShade(THEME_LIGHT_GRAY, 90);
const THEME_LIGHT_FOREGROUND_Z1 = colorShade(THEME_LIGHT_GRAY, 80);
const THEME_LIGHT_FOREGROUND_Z2 = colorShade(THEME_LIGHT_GRAY, 70);
const THEME_LIGHT_FOREGROUND_Z3 = colorShade(THEME_LIGHT_GRAY, 60);
const THEME_LIGHT_FOREGROUND_Z4 = colorShade(THEME_LIGHT_GRAY, 50);
const THEME_LIGHT_FOREGROUND_Z5 = colorShade(THEME_LIGHT_GRAY, 40);
const THEME_LIGHT_FOREGROUND_Z6 = colorShade(THEME_LIGHT_GRAY, 30);
const THEME_LIGHT_FOREGROUND_Z7 = colorShade(THEME_LIGHT_GRAY, 20);
const THEME_LIGHT_FOREGROUND_Z8 = colorShade(THEME_LIGHT_GRAY, 10);
// DARK
const THEME_DARK_PRIMARY = '#0A84FF';
const THEME_DARK_PRIMARY_ACTIVE = colorTint(THEME_DARK_PRIMARY, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_ACCENT = '#FF9F00';
const THEME_DARK_ACCENT_ACTIVE = colorTint(THEME_DARK_ACCENT, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_GRAY = '#98989D';
const THEME_DARK_GRAY_ACTIVE = colorTint(THEME_DARK_GRAY, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_SUCCESS = '#32D74B';
const THEME_DARK_SUCCESS_ACTIVE = colorTint(THEME_DARK_SUCCESS, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_INFO = '#5AC8F5';
const THEME_DARK_INFO_ACTIVE = colorTint(THEME_DARK_INFO, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_ERROR = '#FF453A';
const THEME_DARK_ERROR_ACTIVE = colorTint(THEME_DARK_ERROR, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_WARN = '#FFD600';
const THEME_DARK_WARN_ACTIVE = colorTint(THEME_DARK_WARN, THEME_ACTIVE_COLOR_WEIGHT);
const THEME_DARK_TEXT_BASE = '#fff';
const THEME_DARK_TEXT_LIGHT = 'rgba(255,255,255,0.75)';
const THEME_DARK_TEXT_LIGHTER = 'rgba(255,255,255,0.50)';
const THEME_DARK_TEXT_LIGHTEST = 'rgba(255,255,255,0.33)';
const THEME_DARK_TEXT_ON_PRIMARY = colorContrast(THEME_DARK_PRIMARY);
const THEME_DARK_TEXT_ON_ACCENT = colorContrast(THEME_DARK_ACCENT);
const THEME_DARK_TEXT_ON_SUCCESS = colorContrast(THEME_DARK_SUCCESS);
const THEME_DARK_TEXT_ON_INFO = colorContrast(THEME_DARK_INFO);
const THEME_DARK_TEXT_ON_ERROR = colorContrast(THEME_DARK_ERROR);
const THEME_DARK_TEXT_ON_WARN = colorContrast(THEME_DARK_WARN);
const THEME_DARK_BACKGROUND_Z0 = colorShade(THEME_DARK_GRAY, 90);
const THEME_DARK_BACKGROUND_Z1 = colorShade(THEME_DARK_GRAY, 80);
const THEME_DARK_BACKGROUND_Z2 = colorShade(THEME_DARK_GRAY, 70);
const THEME_DARK_BACKGROUND_Z3 = colorShade(THEME_DARK_GRAY, 60);
const THEME_DARK_BACKGROUND_Z4 = colorShade(THEME_DARK_GRAY, 50);
const THEME_DARK_BACKGROUND_Z5 = colorShade(THEME_DARK_GRAY, 40);
const THEME_DARK_BACKGROUND_Z6 = colorShade(THEME_DARK_GRAY, 30);
const THEME_DARK_BACKGROUND_Z7 = colorShade(THEME_DARK_GRAY, 20);
const THEME_DARK_BACKGROUND_Z8 = colorShade(THEME_DARK_GRAY, 10);
//
const THEME_DARK_FOREGROUND_Z0 = colorTint(THEME_DARK_GRAY, 90);
const THEME_DARK_FOREGROUND_Z1 = colorTint(THEME_DARK_GRAY, 80);
const THEME_DARK_FOREGROUND_Z2 = colorTint(THEME_DARK_GRAY, 70);
const THEME_DARK_FOREGROUND_Z3 = colorTint(THEME_DARK_GRAY, 60);
const THEME_DARK_FOREGROUND_Z4 = colorTint(THEME_DARK_GRAY, 50);
const THEME_DARK_FOREGROUND_Z5 = colorTint(THEME_DARK_GRAY, 40);
const THEME_DARK_FOREGROUND_Z6 = colorTint(THEME_DARK_GRAY, 30);
const THEME_DARK_FOREGROUND_Z7 = colorTint(THEME_DARK_GRAY, 20);
const THEME_DARK_FOREGROUND_Z8 = colorTint(THEME_DARK_GRAY, 10);

export const THEMES: { light: Btwx.Theme; dark: Btwx.Theme } = {
  light: {
    name: 'light',
    palette: {
      primary: THEME_LIGHT_PRIMARY,
      primaryActive: THEME_LIGHT_PRIMARY_ACTIVE,
      accent: THEME_LIGHT_ACCENT,
      accentActive: THEME_LIGHT_ACCENT_ACTIVE,
      gray: THEME_LIGHT_GRAY,
      grayActive: THEME_LIGHT_GRAY_ACTIVE,
      success: THEME_LIGHT_SUCCESS,
      successActive: THEME_LIGHT_SUCCESS_ACTIVE,
      info: THEME_LIGHT_INFO,
      infoActive: THEME_LIGHT_INFO_ACTIVE,
      error: THEME_LIGHT_ERROR,
      errroActive: THEME_LIGHT_ERROR_ACTIVE,
      warn: THEME_LIGHT_WARN,
      warnActive: THEME_LIGHT_WARN_ACTIVE,
    },
    text: {
      base: THEME_LIGHT_TEXT_BASE,
      light: THEME_LIGHT_TEXT_LIGHT,
      lighter: THEME_LIGHT_TEXT_LIGHTER,
      lightest: THEME_LIGHT_TEXT_LIGHTEST,
      onPalette: {
        primary: THEME_LIGHT_TEXT_ON_PRIMARY,
        accent: THEME_LIGHT_TEXT_ON_ACCENT,
        success: THEME_LIGHT_TEXT_ON_SUCCESS,
        info: THEME_LIGHT_TEXT_ON_INFO,
        error: THEME_LIGHT_TEXT_ON_ERROR,
        warn: THEME_LIGHT_TEXT_ON_WARN,
      }
    },
    background: {
      z0: THEME_LIGHT_BACKGROUND_Z0,
      z1: THEME_LIGHT_BACKGROUND_Z1,
      z2: THEME_LIGHT_BACKGROUND_Z2,
      z3: THEME_LIGHT_BACKGROUND_Z3,
      z4: THEME_LIGHT_BACKGROUND_Z4,
      z5: THEME_LIGHT_BACKGROUND_Z5,
      z6: THEME_LIGHT_BACKGROUND_Z6,
      z7: THEME_LIGHT_BACKGROUND_Z7,
      z8: THEME_LIGHT_BACKGROUND_Z8,
    },
    foreground: {
      z0: THEME_LIGHT_FOREGROUND_Z0,
      z1: THEME_LIGHT_FOREGROUND_Z1,
      z2: THEME_LIGHT_FOREGROUND_Z2,
      z3: THEME_LIGHT_FOREGROUND_Z3,
      z4: THEME_LIGHT_FOREGROUND_Z4,
      z5: THEME_LIGHT_FOREGROUND_Z5,
      z6: THEME_LIGHT_FOREGROUND_Z6,
      z7: THEME_LIGHT_FOREGROUND_Z7,
      z8: THEME_LIGHT_FOREGROUND_Z8,
    },
    buttonBackground: THEME_LIGHT_BACKGROUND_Z0,
    buttonBorder: THEME_LIGHT_BACKGROUND_Z3,
    buttonBorderActive: THEME_LIGHT_BACKGROUND_Z4,
    controlBackground: THEME_LIGHT_BACKGROUND_Z0,
    controlBorder: THEME_LIGHT_BACKGROUND_Z3,
    controlBorderActive: THEME_LIGHT_BACKGROUND_Z4,
    sidebarBackground: THEME_LIGHT_BACKGROUND_Z1,
    sidebarBorder: THEME_LIGHT_BACKGROUND_Z3,
    topbarBackground: THEME_LIGHT_BACKGROUND_Z1,
    topbarBorder: THEME_LIGHT_BACKGROUND_Z3,
    listItemRootBackground: THEME_LIGHT_BACKGROUND_Z0,
    eventFrameInactiveColor: THEME_LIGHT_FOREGROUND_Z7,
    unit: THEME_UNIT_SIZE
  },
  dark: {
    name: 'dark',
    palette: {
      primary: THEME_DARK_PRIMARY,
      primaryActive: THEME_DARK_PRIMARY_ACTIVE,
      accent: THEME_DARK_ACCENT,
      accentActive: THEME_DARK_ACCENT_ACTIVE,
      gray: THEME_DARK_GRAY,
      grayActive: THEME_DARK_GRAY_ACTIVE,
      success: THEME_DARK_SUCCESS,
      successActive: THEME_DARK_SUCCESS_ACTIVE,
      info: THEME_DARK_INFO,
      infoActive: THEME_DARK_INFO_ACTIVE,
      error: THEME_DARK_ERROR,
      errroActive: THEME_DARK_ERROR_ACTIVE,
      warn: THEME_DARK_WARN,
      warnActive: THEME_DARK_WARN_ACTIVE,
    },
    text: {
      base: THEME_DARK_TEXT_BASE,
      light: THEME_DARK_TEXT_LIGHT,
      lighter: THEME_DARK_TEXT_LIGHTER,
      lightest: THEME_DARK_TEXT_LIGHTEST,
      onPalette: {
        primary: THEME_DARK_TEXT_ON_PRIMARY,
        accent: THEME_DARK_TEXT_ON_ACCENT,
        success: THEME_DARK_TEXT_ON_SUCCESS,
        info: THEME_DARK_TEXT_ON_INFO,
        error: THEME_DARK_TEXT_ON_ERROR,
        warn: THEME_DARK_TEXT_ON_WARN,
      }
    },
    background: {
      z0: THEME_DARK_BACKGROUND_Z0,
      z1: THEME_DARK_BACKGROUND_Z1,
      z2: THEME_DARK_BACKGROUND_Z2,
      z3: THEME_DARK_BACKGROUND_Z3,
      z4: THEME_DARK_BACKGROUND_Z4,
      z5: THEME_DARK_BACKGROUND_Z5,
      z6: THEME_DARK_BACKGROUND_Z6,
      z7: THEME_DARK_BACKGROUND_Z7,
      z8: THEME_DARK_BACKGROUND_Z8,
    },
    foreground: {
      z0: THEME_DARK_FOREGROUND_Z0,
      z1: THEME_DARK_FOREGROUND_Z1,
      z2: THEME_DARK_FOREGROUND_Z2,
      z3: THEME_DARK_FOREGROUND_Z3,
      z4: THEME_DARK_FOREGROUND_Z4,
      z5: THEME_DARK_FOREGROUND_Z5,
      z6: THEME_DARK_FOREGROUND_Z6,
      z7: THEME_DARK_FOREGROUND_Z7,
      z8: THEME_DARK_FOREGROUND_Z8,
    },
    buttonBackground: THEME_DARK_BACKGROUND_Z2,
    buttonBorder: THEME_DARK_BACKGROUND_Z3,
    buttonBorderActive: THEME_DARK_BACKGROUND_Z4,
    controlBackground: THEME_DARK_BACKGROUND_Z2,
    controlBorder: THEME_DARK_BACKGROUND_Z3,
    controlBorderActive: THEME_DARK_BACKGROUND_Z4,
    sidebarBackground: THEME_DARK_BACKGROUND_Z1,
    sidebarBorder: THEME_DARK_BACKGROUND_Z3,
    topbarBackground: THEME_DARK_BACKGROUND_Z1,
    topbarBorder: THEME_DARK_BACKGROUND_Z3,
    listItemRootBackground: THEME_DARK_BACKGROUND_Z2,
    eventFrameInactiveColor: THEME_DARK_BACKGROUND_Z7,
    unit: THEME_UNIT_SIZE
  }
}

const getTheme = (theme: Btwx.ThemeName): Btwx.Theme => {
  switch(theme) {
    case 'dark':
      return THEMES.dark;
    case 'light':
      return THEMES.light;
  }
};

export default getTheme;