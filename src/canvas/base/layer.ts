import paper, { Layer, Group } from 'paper';

interface RenderLayer {
  shape: paper.Path | paper.CompoundPath;
  dispatch: any;
  isGroup: boolean;
  layerOpts?: any;
}

interface ELayer extends paper.Layer {
  isGroup: boolean;
  layers(): paper.Layer[];
  styles(): paper.Layer[];
  shadows(): paper.Layer[];
  fills(): paper.Layer[];
  innerShadows(): paper.Layer[];
  borders(): paper.Layer[];
}

const renderLayer = ({ shape, layerOpts, isGroup }: RenderLayer): ELayer => {
  const layerContainer = new Layer({
    children: [shape],
    isGroup: isGroup,
    layersGroup: function() {
      return this.children.find((child: paper.Layer) => child.name === 'layers');
    },
    layers: function() {
      const layersGroup = this.layersGroup();
      return layersGroup.children;
    },
    styles: function() {
      return this.children.find((child: paper.Layer) => child.name === 'styles').children;
    },
    shadows: function() {
      const styles = this.styles();
      styles.find((child: paper.Layer) => child.name === 'shadows').children;
    },
    fills: function() {
      const styles = this.styles();
      styles.find((child: paper.Layer) => child.name === 'fills').children;
    },
    innerShadows: function() {
      const styles = this.styles();
      styles.find((child: paper.Layer) => child.name === 'inner-shadows').children;
    },
    borders: function() {
      const styles = this.styles();
      styles.find((child: paper.Layer) => child.name === 'borders').children;
    },
    ...layerOpts
  });
  const stylesContainer = new Group({
    parent: layerContainer,
    name: 'styles'
  });
  const shadowsContainer = new Group({
    parent: stylesContainer,
    name: 'shadows'
  });
  const fillsContainer = new Group({
    parent: stylesContainer,
    name: 'fills'
  });
  const innerShadowsContainer = new Group({
    parent: stylesContainer,
    name: 'inner-shadows'
  });
  const bordersContainer = new Group({
    parent: stylesContainer,
    name: 'borders'
  });
  const layersContainer = new Group({
    parent: layerContainer,
    name: 'layers'
  });
  return layerContainer;
};

export default renderLayer;