import paper, { Layer, Raster, Rectangle, Shape, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getImage, getOverrideImage } from './utils';

interface RenderImage {
  layer: FileFormat.Bitmap;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  overrides?: FileFormat.OverrideValue[];
}

const renderImage = ({ layer, container, images, overrides }: RenderImage): paper.Layer => {
  const image = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const override = getOverrideImage({
    instanceId: layer.do_objectID,
    overrides: overrides
  });
  const bitmap = new Raster(getImage({
    ref: override ? (override.value as FileFormat.ImageFileRef)._ref : layer.image._ref,
    images: images
  }));
  bitmap.width = layer.frame.width;
  bitmap.height = layer.frame.height;
  bitmap.parent = image;
  bitmap.position.x += layer.frame.width / 2;
  bitmap.position.y += layer.frame.height / 2;
  image.position.x += layer.frame.x;
  image.position.y += layer.frame.y;
  return image;
};

export default renderImage;