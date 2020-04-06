import paper, { Layer, Group } from 'paper';

interface RenderGroup {
  dispatch: any;
  layers?: paper.Item;
  groupOpts?: any;
}

const renderGroup = ({ dispatch, layers, groupOpts }: RenderGroup): paper.Group => {
  const groupContainer = new Group({
    ...groupOpts
  });
  const layersContainer = new Group({
    parent: groupContainer,
    name: 'layers',
    children: layers
  });
  const stylesContainer = new Group({
    parent: groupContainer,
    name: 'styles'
  });
  const shadowsContainer = new Group({
    parent: stylesContainer,
    name: 'shadows'
  });
  return groupContainer;
};

export default renderGroup;