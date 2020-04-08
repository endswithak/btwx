import paper, { Layer, Group } from 'paper';
import PaperLayer from './layer';

interface PaperLayersProps {
  layerOpts: any;
  dispatch: any;
}

class PaperLayers {
  layer: paper.Group;
  layers: PaperLayer;
  constructor({layerOpts, dispatch}: PaperLayersProps) {
    this.layer = new Group({
      name: 'layers',
      ...layerOpts
    });
  }
}

export default PaperLayers;