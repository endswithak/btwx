import paper, { Layer, Rectangle, Point } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { drawLayerPath } from './utils';

interface RenderFills {
  layer: FileFormat.ShapePath | FileFormat.Rectangle;
  container: paper.Group;
}

const renderFills = async ({ layer, container }: RenderFills): Promise<paper.Layer> => {
  const fills = new Layer();
  fills.name = 'fills';
  return fills;
};

export default renderFills;