import paper, { Layer, Group } from 'paper';

interface RenderLayer {
  container: paper.Group | paper.Layer;
  shape: paper.Path | paper.CompoundPath;
  name: string;
  dispatch: any;
  path: string;
}

const renderLayer = ({ container, name, path }: RenderLayer): void => {
  const layerContainer = new Layer({
    parent: container,
    name: name,
    data: {
      path: path
    },
    applyMatrix: false
  });
  const shadowsContainer = new Group({
    parent: layerContainer,
    name: 'shadows'
  });
  const fillsContainer = new Group({
    parent: layerContainer,
    name: 'fills'
  });
  const innerShadowsContainer = new Group({
    parent: layerContainer,
    name: 'inner-shadows'
  });
  const bordersContainer = new Group({
    parent: layerContainer,
    name: 'borders'
  });
};

export default renderLayer;