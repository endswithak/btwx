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
  instanceId: string;
  overrides?: FileFormat.OverrideValue[];
}

export const getOverrideImage = ({ instanceId, overrides }: GetOverrideImage): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    return override.overrideName.includes(`${instanceId}_image`);
  }) : null;
  return overrideString;
};