import paper, { Layer, Group, Path } from 'paper';
import renderLayer from './layer';
import renderGroup from './group';

interface RenderArtboard {
  size: paper.Size;
  position: paper.Point;
  dispatch: any;
  name?: string;
  path?: string;
  container?: paper.Group | paper.Layer;
}

const renderArtboard = ({ container, size, position, name, dispatch, path }: RenderArtboard): paper.Group => {
  const artboard = renderLayer({
    isGroup: true,
    shape: new Path.Rectangle({
      name: 'shape',
      size: size,
      fillColor: 'white',
      insert: false
    }),
    dispatch: dispatch,
    layerOpts: {
      position: position,
      name: name ? name : 'artboard'
    }
  });
  dispatch({
    type: 'add-artboard',
    artboard: artboard
  });
  return artboard;
};

export default renderArtboard;