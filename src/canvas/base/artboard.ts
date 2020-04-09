import paper, { Layer, Group, Path, Point, Size, } from 'paper';
import PaperLayer from './layer';
import PaperPage from './page';
import PaperShape from './shape';
import PaperGroup from './group';

interface PaperArtboardProps {
  size: {width: number; height: number};
  position: {x: number; y: number};
  dispatch: any;
  parent: PaperPage;
  name?: string;
}

class PaperArtboard extends PaperGroup {
  constructor({size, position, name, dispatch, parent}: PaperArtboardProps) {
    super({dispatch, parent});
    this.type = 'Artboard';
    this.name = name ? name : 'Artboard';
    this.paperItem.children = [new Path.Rectangle({
      point: new Point(position.x, position.y),
      size: new Size(size.width, size.height),
      fillColor: 'white'
    })];
  }
}

export default PaperArtboard;