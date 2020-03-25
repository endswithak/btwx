import paper, { Layer, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { shapePathUtils, fillUtils } from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
}

const renderShapePath = ({ layer, images, container }: RenderShapePath): paper.Layer => {
  const shapePathContainer = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container
  });
  const shapePath = shapePathUtils.drawShapePath({
    layer: layer,
    opts: {
      insert: false,
      closed: layer.isClosed
    }
  });
  fillUtils.renderFills({
    shapePath: shapePath,
    fills: layer.style.fills,
    images: images,
    container: shapePathContainer
  });
  shapePathContainer.position.x += layer.frame.x;
  shapePathContainer.position.y += layer.frame.y;
  return shapePathContainer;
};

export default renderShapePath;