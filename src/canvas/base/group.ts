import paper, { Layer, Group, Path } from 'paper';
import PaperLayer from './layer';
import PaperStyle from './style';
import PaperShape from './shape';
import PaperArtboard from './artboard';
import PaperFill from './style/fill';
import PaperFills from './style/fills';
import PaperPage from './page';

interface PaperGroupProps {
  parent: any;
  dispatch?: any;
  name?: string;
  style?: {
    fills?: em.Fill[];
  };
}

class PaperGroup extends PaperLayer {
  layers: (PaperShape | PaperGroup | PaperArtboard | PaperFill | PaperFills)[];
  constructor({dispatch, name, style, parent}: PaperGroupProps) {
    super({dispatch, parent});
    this.type = 'Group';
    this.name = name ? name : 'Group';
    this.layers = [];
    this.interactive = true;
    this.paperItem = new Group({
      data: {
        layer: this
      }
    });
  }
  addLayer({layer, index}: {layer: PaperShape | PaperGroup | PaperArtboard | PaperFill | PaperFills; index?: number}) {
    if (index) {
      layer.index = index;
      this.paperItem.insertChild(index, layer.paperItem);
      this.layers.splice(index, 0, layer);
    } else {
      layer.index = this.layers.length;
      this.paperItem.addChild(layer.paperItem);
      this.layers.push(layer);
    }
  }
}

export default PaperGroup;