import chroma, { Color } from 'chroma-js';
import { THEME_PRIMARY_COLOR, THEME_UNIT_SIZE } from '../constants';

const createScale = (min: string, max: string, count: number) => {
  return chroma.scale([min, max]).mode('lch').colors(count);
}

const accent = chroma('magenta').css();

const darkBgMin = '#1a1a1a';
const darkBgMax = '#555';
const darkBgScale = createScale(darkBgMin, darkBgMax, 7);

const lightBgMin = '#f7f7f7';
const lightBgMax = '#ccc';
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

const createPalette = (theme: em.ThemeName): em.Palette => ({
  primary: THEME_PRIMARY_COLOR,
  primaryHover: theme === 'dark' ? chroma(THEME_PRIMARY_COLOR).brighten(0.5).css() : chroma(THEME_PRIMARY_COLOR).darken(0.5).css(),
  accent: chroma(accent).css(),
  accentHover: chroma(accent).darken().css()
});

const createDarkBackgrounds = (scale: string[]): em.BackgroundScale => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createLightBackgrounds = (scale: string[]): em.BackgroundScale => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createText = (scale: string[], palette: em.Palette): em.TextScale => ({
  base: scale[3],
  light: scale[2],
  lighter: scale[1],
  lightest: scale[0],
  onPrimary: textOnColor(palette.primary),
  onAccent: textOnColor(palette.accent),
});

export const darkTheme = {
  palette: createPalette('dark'),
  background: createDarkBackgrounds(darkBgScale),
  backgroundInverse: createLightBackgrounds(lightBgScale),
  text: createText(darkTextScale, createPalette('dark')),
  unit: THEME_UNIT_SIZE
}

export const lightTheme = {
  palette: createPalette('light'),
  background: createLightBackgrounds(lightBgScale),
  backgroundInverse: createDarkBackgrounds(lightBgScale),
  text: createText(lightTextScale, createPalette('light')),
  unit: THEME_UNIT_SIZE
}

const getTheme = (theme: em.ThemeName): em.Theme => {
  switch(theme) {
    case 'dark':
      return {
        name: theme,
        ...darkTheme,
        unit: THEME_UNIT_SIZE
      }
    case 'light':
      return {
        name: theme,
        ...lightTheme,
        unit: THEME_UNIT_SIZE
      }
  }
};

export default getTheme;