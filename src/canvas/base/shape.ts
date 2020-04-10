import { v4 as uuidv4 } from 'uuid';
import paper, { Layer, Group } from 'paper';
import PaperLayer from './layer';
import PaperStyle from './style';
import PaperGroup from './group';
import PaperPage from './page';
import PaperArtboard from './artboard';

interface PaperShapeProps {
  dispatch: any;
  shape: paper.Path | paper.CompoundPath;
  parent: any;
  name?: string;
  style?: {
    fills?: em.Fill[];
  };
}

class PaperShape extends PaperLayer {
  shape: paper.Path | paper.CompoundPath;
  style: PaperStyle;
  constructor({shape, dispatch, style, name, parent}: PaperShapeProps) {
    super({dispatch, parent});
    this.shape = shape;
    this.interactive = true;
    this.type = 'Shape';
    this.name = name ? name : 'Shape';
    this.paperItem = new Layer({
      children: [shape],
      data: {
        layer: this
      }
    });
    this.style = new PaperStyle({
      dispatch: this.dispatch,
      fills: style.fills ? style.fills : [],
      parent: this,
      shape: this.shape
    });
  }
}

export default PaperShape;