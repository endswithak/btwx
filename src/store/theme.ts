import chroma, { Color } from 'chroma-js';

export const SRM_DEFAULT_PRIMARY = chroma('#EF2EF2');

const createScale = (min: string, max: string, count: number) => {
  return chroma.scale([min, max]).mode('lch').colors(count);
}

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

const createPalette = (avgColor: Color) => {
  // let primary: Color = chroma(avgColor).set('hsl.h', '+180').set('lch.c', 700).saturate(100);
  // if (chroma(primary).get('hsl.l') >= 0.5) {
  //   primary = primary.darken();
  // } else if (chroma(primary).get('hsl.l') <= 0.3) {
  //   primary = primary.brighten();
  // }
  // let primaryHover: Color = chroma(primary).darken(0.5);
  // let accent: Color = chroma(primary).set('hsl.h', '+180');
  // let accentHover: Color = chroma(accent).darken(0.5);
  const primary = chroma('cyan').css();
  const accent = chroma('magenta').css();
  return {
    primary: primary,
    primaryHover: chroma(primary).darken().css(),
    accent: chroma(accent).css(),
    accentHover: chroma(accent).darken().css()
  }
}

const createDarkBackgrounds = (scale: string[]) => ({
  z6: scale[6],
  z5: scale[5],
  z4: scale[4],
  z3: scale[3],
  z2: scale[2],
  z1: scale[1],
  z0: scale[0]
});

const createLightBackgrounds = (scale: string[]) => ({
  z6: scale[6],
  z5: scale[4],
  z4: scale[5],
  z3: scale[4],
  z2: scale[1],
  z1: scale[2],
  z0: scale[0]
});

const createText = (scale: string[], palette: any) => ({
  base: scale[3],
  light: scale[2],
  lighter: scale[1],
  lightest: scale[0],
  onPrimary: textOnColor(palette.primary),
  onAccent: textOnColor(palette.accent),
});

const getTheme = (theme: st.Theme, avgColor?: Color) => {
  const palette = createPalette(avgColor ? avgColor : SRM_DEFAULT_PRIMARY);
  switch(theme) {
    case 'dark':
      return {
        name: theme,
        palette: palette,
        background: createDarkBackgrounds(darkBgScale),
        text: createText(darkTextScale, palette)
      }
    case 'light':
      return {
        name: theme,
        palette: palette,
        background: createLightBackgrounds(lightBgScale),
        text: createText(lightTextScale, palette)
      }
  }
};

export default getTheme;