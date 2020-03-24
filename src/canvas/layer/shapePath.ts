import paper, { Layer, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { shapePathUtils } from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
}

const renderShapePath = ({ layer, container }: RenderShapePath): paper.Layer => {
  const shapePath = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container
  });
  const layerPath = shapePathUtils.drawShapePath({
    layer: layer,
    opts: {
      insert: false,
      closed: layer.isClosed
    }
  });
  const fill = layerPath.clone();
  fill.parent = shapePath;
  fill.fillColor = Color.random();
  fill.strokeWidth = 2;
  fill.strokeColor = Color.random();
  shapePath.position.x += layer.frame.x;
  shapePath.position.y += layer.frame.y;
  return shapePath;
};

export default renderShapePath;