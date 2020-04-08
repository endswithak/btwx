import paper, { Layer, Group } from 'paper';
import PaperStyle from './style/style';
import PaperLayers from './layers';

interface PaperLayerProps {
  shape: paper.Path | paper.CompoundPath;
  isGroup: boolean;
  layerOpts: any;
  dispatch: any;
  style?: {
    shadows?: em.Shadow[];
    fills?: em.Fill[];
    innerShadows?: em.Shadow[];
    borders?: em.Border[];
  };
}

class PaperLayer {
  layer: paper.Layer;
  style: PaperStyle;
  type: 'Layer' | 'Artboard' | 'Group';
  shape: paper.Path | paper.CompoundPath;
  isGroup: boolean;
  selected: boolean;
  layers: PaperLayers;
  dispatch: any;
  constructor({shape, isGroup, layerOpts, dispatch, style}: PaperLayerProps) {
    this.dispatch = dispatch;
    this.shape = shape;
    this.isGroup = isGroup;
    this.type = isGroup ? 'Group' : 'Layer';
    this.layer = new Layer({
      children: [shape],
      name: 'layer',
      ...layerOpts
    });
    this.style = new PaperStyle({
      shape: this.shape,
      dispatch: this.dispatch,
      fills: style.fills ? style.fills : [],
      layerOpts: {
        parent: this.layer
      }
    })
    if (this.isGroup) {
      this.layers = new PaperLayers({
        dispatch: dispatch,
        layerOpts: {
          parent: this.layer
        }
      });
    }
    dispatch({
      type: 'add-layer',
      layer: this
    });
  }
}

export default PaperLayer;