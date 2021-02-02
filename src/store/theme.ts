import chroma, { Color } from 'chroma-js';
import { THEME_PRIMARY_COLOR, THEME_GREEN, THEME_RED, THEME_ORANGE, THEME_UNIT_SIZE, THEME_RECORDING_COLOR, THEME_DARK_BACKGROUND_MIN, THEME_LIGHT_BACKGROUND_MIN, THEME_DARK_BACKGROUND_MAX, THEME_LIGHT_BACKGROUND_MAX } from '../constants';

const createScale = (min: string, max: string, count: number) => {
  return chroma.scale([min, max]).mode('lch').colors(count);
}

const accent = chroma('magenta').css();

const darkBgMin = THEME_DARK_BACKGROUND_MIN;
const darkBgMax = THEME_DARK_BACKGROUND_MAX;
const darkBgScale = createScale(darkBgMin, darkBgMax, 7);

const lightBgMin = THEME_LIGHT_BACKGROUND_MIN;
const lightBgMax = THEME_LIGHT_BACKGROUND_MAX;
const lightBgScale = createScale(lightBgMin, lightBgMax, 7);

const darkTextMin = 'rgba(255,255,255,0.25)';
const darkTextMax = 'rgba(255,255,255,1)';
const darkTextScale = createScale(darkTextMin, darkTextMax, 4);

const lightTextMin = 'rgba(0,0,0,0.25)';
const lightTextMax = 'rgba(0,0,0,1)';
const lightTextScale = createScale(lightTextMin, lightTextMax, 4);

const textOnColor = (color: string | chroma.Color) => {
  const contrast = chroma.contrast(color, darkTextMax);
  return contrast > 3 ? darkTextMax : lightTextMax;
}

const createPalette = (theme: Btwx.ThemeName): Btwx.Palette => ({
  primary: THEME_PRIMARY_COLOR,
  primaryHover: theme === 'dark' ? chroma(THEME_PRIMARY_COLOR).brighten(0.5).css() : chroma(THEME_PRIMARY_COLOR).darken(0.5).css(),
  accent: chroma(accent).css(),
  accentHover: chroma(accent).darken().css(),
  recording: THEME_RED,
  recordingHover: theme === 'dark' ? chroma(THEME_RED).brighten(0.5).css() : chroma(THEME_RED).darken(0.5).css(),
  error: THEME_RED,
  errorHover: theme === 'dark' ? chroma(THEME_RED).brighten(0.5).css() : chroma(THEME_RED).darken(0.5).css(),
  warn: THEME_ORANGE,
  warnHover: theme === 'dark' ? chroma(THEME_ORANGE).brighten(0.5).css() : chroma(THEME_ORANGE).darken(0.5).css(),
  success: THEME_GREEN,
  successHover: theme === 'dark' ? chroma(THEME_GREEN).brighten(0.5).css() : chroma(THEME_GREEN).darken(0.5).css()
});

const createDarkBackgrounds = (scale: string[]): Btwx.BackgroundScale => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createLightBackgrounds = (scale: string[]): Btwx.BackgroundScale => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createText = (scale: string[], palette: Btwx.Palette): Btwx.TextScale => ({
  base: scale[3],
  light: scale[2],
  lighter: scale[1],
  lightest: scale[0],
  onPrimary: textOnColor(palette.primary),
  onAccent: textOnColor(palette.accent),
  onError: textOnColor(palette.error),
  onWarn: textOnColor(palette.warn),
  onSuccess: textOnColor(palette.success),
});

export const darkTheme: Btwx.Theme = {
  name: 'dark',
  palette: createPalette('dark'),
  background: createDarkBackgrounds(darkBgScale),
  backgroundInverse: createLightBackgrounds(lightBgScale),
  text: createText(darkTextScale, createPalette('dark')),
  unit: THEME_UNIT_SIZE
}

export const lightTheme: Btwx.Theme = {
  name: 'light',
  palette: createPalette('light'),
  background: createLightBackgrounds(lightBgScale),
  backgroundInverse: createDarkBackgrounds(darkBgScale),
  text: createText(lightTextScale, createPalette('light')),
  unit: THEME_UNIT_SIZE
}

const getTheme = (theme: Btwx.ThemeName): Btwx.Theme => {
  switch(theme) {
    case 'dark':
      return darkTheme;
    case 'light':
      return lightTheme;
  }
};

export default getTheme;