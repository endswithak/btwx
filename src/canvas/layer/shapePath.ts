import paper, { Layer, Color } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { shapePathUtils, fillUtils, borderUtils, imageUtils } from './utils';

interface RenderShapePath {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  path: string;
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderShapePath = ({ layer, images, container, path, overrides, symbolPath }: RenderShapePath): paper.Layer => {
  const shapePathContainer = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    clipMask: layer.hasClippingMask,
    parent: container
  });
  const override = imageUtils.getOverrideImage({
    overrides: overrides,
    symbolPath: symbolPath
  });
  const shapePath = shapePathUtils.drawShapePath({
    layer: layer,
    opts: {
      insert: false,
      closed: layer.isClosed,
      windingRule: shapePathUtils.getWindingRule({windingRule: layer.style.windingRule})
    }
  });
  console.log(shapePath);
  fillUtils.renderFills({
    shapePath: shapePath,
    fills: layer.style.fills,
    images: images,
    override: override,
    container: shapePathContainer
  });
  borderUtils.renderBorders({
    shapePath: shapePath,
    borders: layer.style.borders,
    borderOptions: layer.style.borderOptions,
    container: shapePathContainer
  });
  shapePathContainer.position.x += layer.frame.x;
  shapePathContainer.position.y += layer.frame.y;
  return shapePathContainer;
};

export default renderShapePath;