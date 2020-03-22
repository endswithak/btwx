import paper, { Layer, Rectangle, Shape, Point, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { drawLayerPath } from './utils';

interface RenderImage {
  layer: FileFormat.Bitmap;
  container: paper.Group;
  overrides?: FileFormat.OverrideValue[];
}

const renderImage = ({ layer, container, overrides }: RenderImage): paper.Layer => {
  const image = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const imageBackground = new Shape.Rectangle({
    rectangle: new Rectangle({
      x: 0,
      y: 0,
      width: layer.frame.width,
      height: layer.frame.height
    }),
    fillColor: Color.random(),
    parent: image
  });
  image.position.x += layer.frame.x;
  image.position.y += layer.frame.y;
  return image;
};

export default renderImage;