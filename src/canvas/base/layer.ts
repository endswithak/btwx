import { v4 as uuidv4 } from 'uuid';

interface PaperLayerProps {
  type: 'Page' | 'Artboard' | 'Group' | 'Shape' | 'Document';
  name?: string;
  dispatch?: any;
}

class PaperLayer {
  id: string;
  selected: boolean;
  name: string;
  paperItem: paper.Layer | paper.Group | paper.Path | paper.CompoundPath | paper.Raster;
  type: 'Page' | 'Artboard' | 'Group' | 'Shape' | 'Document';
  dispatch: any;
  constructor({type, name, dispatch}: PaperLayerProps) {
    this.id = uuidv4();
    this.selected = false;
    this.type = type;
    this.name = name ? name : this.type;
    this.dispatch = dispatch;
  }
}

export default PaperLayer;