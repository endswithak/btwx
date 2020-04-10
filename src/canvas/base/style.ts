import paper, { Layer, Group } from 'paper';
import PaperFills from './style/fills';
import PaperGroup from './group';

interface PaperStyleProps {
  dispatch: any;
  fills: em.Fill[];
  shape: paper.Path | paper.CompoundPath;
  parent?: any;
}

class PaperStyle extends PaperGroup {
  fills: PaperFills;
  constructor({parent, dispatch, fills, shape}: PaperStyleProps) {
    super({dispatch, parent});
    this.interactive = false;
    this.paperItem.parent = this.parent.paperItem;
    this.name = 'Style';
    this.addLayer({
      layer: new PaperFills({
        fills: fills,
        shape: shape,
        parent: this
      })
    });
  }
}

export default PaperStyle;