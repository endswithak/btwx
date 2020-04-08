interface GetBlendMode {
  blendMode: number;
}

export const getBlendMode = ({ blendMode }: GetBlendMode): string => {
  switch(blendMode) {
    case 0:
      return 'normal';
    case 1:
      return 'darken';
    case 2:
      return 'multiply';
    case 3:
      return 'color-burn';
    case 4:
      return 'lighten';
    case 5:
      return 'screen';
    case 6:
      return 'color-dodge';
    case 7:
      return 'overlay';
    case 8:
      return 'soft-light';
    case 9:
      return 'hard-light';
    case 10:
      return 'difference';
    case 11:
      return 'exclusion';
    case 12:
      return 'hue';
    case 13:
      return 'saturation';
    case 14:
      return 'color';
    case 15:
      return 'luminosity';
    case 16:
      return 'darker';
    case 17:
      return 'lighter';
  }
};