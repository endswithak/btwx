import paper, { Layer, Group } from 'paper';
import PaperFills from './fills';

interface PaperStyleProps {
  shape: paper.Path | paper.CompoundPath;
  dispatch: any;
  layerOpts: any;
  fills: em.Fill[];
}

class PaperStyle {
  layer: paper.Group;
  shape: paper.Path | paper.CompoundPath;
  fills: PaperFills;
  constructor({shape, dispatch, fills, layerOpts}: PaperStyleProps) {
    this.shape = shape;
    this.layer = new Group({
      name: 'styles',
      ...layerOpts
    });
    this.fills = new PaperFills({
      fills: fills,
      shape: this.shape,
      layerOpts: {
        parent: this.layer
      }
    });
  }
}

export default PaperStyle;