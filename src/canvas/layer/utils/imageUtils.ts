import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetImage {
  ref: string;
  images: {
    [id: string]: string;
  };
}

export const getImage = ({ ref, images }: GetImage): string => {
  const imageId = ref.substring(ref.indexOf('/') + 1, ref.indexOf('.'));
  return images[imageId];
};

interface GetOverrideImage {
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const getOverrideImage = ({ overrides, symbolPath }: GetOverrideImage): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    return `${symbolPath}_image`.includes(override.overrideName);
  }) : null;
  return overrideString;
};