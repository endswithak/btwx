import paper, { Layer, Raster, Rectangle, Shape, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { imageUtils } from './utils';

interface RenderImage {
  layer: FileFormat.Bitmap;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  overrides?: FileFormat.OverrideValue[];
  symbolPath: string;
}

const renderImage = ({ layer, container, images, overrides, symbolPath }: RenderImage): paper.Layer => {
  const image = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const override = imageUtils.getOverrideImage({
    layerId: layer.do_objectID,
    overrides: overrides,
    symbolPath: symbolPath
  });
  const bitmap = new Raster({
    source: imageUtils.getImage({
      ref: override ? (override.value as FileFormat.ImageFileRef)._ref : layer.image._ref,
      images: images
    }),
    width: layer.frame.width,
    height: layer.frame.height,
    parent: image,
    position: new Point(layer.frame.width / 2, layer.frame.height / 2)
  });
  image.position.x += layer.frame.x;
  image.position.y += layer.frame.y;
  return image;
};

export default renderImage;