import chroma, { Color } from 'chroma-js';

export const SRM_DEFAULT_PRIMARY = chroma('#EF2EF2');

const createScale = (min: string, max: string, count: number) => {
  return chroma.scale([min, max]).mode('lch').colors(count);
}

const primary = chroma('#3C88FD').css();
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

interface Palette {
  primary: string;
  primaryHover: string;
  accent: string;
  accentHover: string;
}

const createPalette = (): Palette => ({
  primary: primary,
  primaryHover: chroma(primary).darken().css(),
  accent: chroma(accent).css(),
  accentHover: chroma(accent).darken().css()
});

interface BackgroundScale {
  z6: string;
  z5: string;
  z4: string;
  z3: string;
  z2: string;
  z1: string;
  z0: string;
}

const createDarkBackgrounds = (scale: string[]): BackgroundScale => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createLightBackgrounds = (scale: string[]): BackgroundScale => ({
  z6: scale[6],
  z5: scale[4],
  z4: scale[5],
  z3: scale[4],
  z2: scale[1],
  z1: scale[2],
  z0: scale[0]
});

interface TextScale {
  base: string;
  light: string;
  lighter: string;
  lightest: string;
  onPrimary: string;
  onAccent: string;
}

const createText = (scale: string[], palette: Palette): TextScale => ({
  base: scale[3],
  light: scale[2],
  lighter: scale[1],
  lightest: scale[0],
  onPrimary: textOnColor(palette.primary),
  onAccent: textOnColor(palette.accent),
});

type ThemeName = 'light' | 'dark';

interface Theme {
  name: ThemeName;
  palette: Palette;
  background: BackgroundScale;
  backgroundInverse: BackgroundScale;
  text: TextScale;
}

const getTheme = (theme: ThemeName): Theme => {
  switch(theme) {
    case 'dark':
      return {
        name: theme,
        palette: createPalette(),
        background: createDarkBackgrounds(darkBgScale),
        backgroundInverse: createLightBackgrounds(lightBgScale),
        text: createText(darkTextScale, createPalette())
      }
    case 'light':
      return {
        name: theme,
        palette: createPalette(),
        background: createLightBackgrounds(lightBgScale),
        backgroundInverse: createDarkBackgrounds(lightBgScale),
        text: createText(lightTextScale, createPalette())
      }
  }
};

export default getTheme;