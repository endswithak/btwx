import FileFormat from '@sketch-hq/sketch-file-format-ts';

export const getImageId = (ref: string): string => {
  return ref.substring(ref.indexOf('/') + 1, ref.indexOf('.'));
};

interface GetImage {
  ref: string;
  images: {
    [id: string]: Buffer;
  };
}

export const getImage = ({ ref, images }: GetImage): Buffer => {
  const imageId = getImageId(ref);
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