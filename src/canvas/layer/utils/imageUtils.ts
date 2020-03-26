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
  layerId: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const getOverrideImage = ({ layerId, overrides, symbolPath }: GetOverrideImage): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    const overridePath = symbolPath ? `${symbolPath}/${layerId}_image` : `${layerId}_image`;
    return overridePath.includes(override.overrideName);
  }) : null;
  return overrideString;
};