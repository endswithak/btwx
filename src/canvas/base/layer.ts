import { v4 as uuidv4 } from 'uuid';
import PaperGroup from './group';
import PaperArtboard from './artboard';
import PaperPage from './page';
import PaperShape from './shape';
import PaperStyle from './style';
import PaperFills from './style/fills';

interface PaperLayerProps {
  dispatch?: any;
  parent: any;
}

class PaperLayer {
  id: string;
  index: number;
  interactive: boolean;
  selected: boolean;
  name: string;
  path: string;
  parent: PaperPage | PaperGroup | PaperArtboard | PaperShape | PaperStyle | PaperFills;
  paperItem: paper.Layer | paper.Group | paper.Path | paper.CompoundPath | paper.Raster;
  type: 'Page' | 'Artboard' | 'Group' | 'Shape';
  dispatch: any;
  constructor({dispatch, parent}: PaperLayerProps) {
    this.id = uuidv4();
    this.parent = parent;
    this.path = this.parent ? `${this.parent.path}/${this.id}` : `${this.id}`;
    this.dispatch = dispatch;
    this.selected = false;
  }
}

export default PaperLayer;