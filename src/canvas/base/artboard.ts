import paper, { Layer, Group, Path } from 'paper';
import PaperLayer from './layer';

interface PaperArtboardProps {
  size: paper.Size;
  dispatch: any;
  layerOpts: any;
}

class PaperArtboard extends PaperLayer {
  constructor({size, dispatch, layerOpts}: PaperArtboardProps) {
    super({
      shape: new Path.Rectangle({
        name: 'shape',
        size: size,
        fillColor: 'white',
        insert: false
      }),
      layerOpts: {
        name: 'artboard',
        ...layerOpts
      },
      isGroup: true,
      dispatch: dispatch
    });
    this.type = 'Artboard';
    dispatch({
      type: 'add-artboard',
      artboard: this
    });
  }
}

export default PaperArtboard;