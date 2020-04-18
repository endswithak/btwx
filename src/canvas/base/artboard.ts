import paper, { Layer, Group, Path, Point, Size, } from 'paper';
import {Fill} from './style/fill';
import PaperStyle from './style';
import LayerNode from './layerNode';

interface PaperArtboardProps {
  name?: string;
}

class PaperArtboard extends LayerNode {
  constructor({size, position, name}: PaperArtboardProps) {
    super({name, layerType: 'Artboard'});
    const shape = new Path.Rectangle({
      point: new Point(position.x, position.y),
      size: new Size(size.width, size.height),
      fillColor: 'white',
      insert: false
    });
  }
}

export default PaperArtboard;