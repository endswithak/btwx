import paper, { Layer, Rectangle, Shape, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getImage } from './utils';

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
  const base64Image = getImage({
    ref: layer.image._ref,
    images: images
  });
  const raster = new paper.Raster(base64Image);
  raster.width = layer.frame.width;
  raster.height = layer.frame.height;
  raster.parent = image;
  raster.position.x += layer.frame.width / 2;
  raster.position.y += layer.frame.height / 2;
  image.position.x += layer.frame.x;
  image.position.y += layer.frame.y;
  return image;
};

export default renderImage;