import paper, { Layer, Group, Path, Point, Size, } from 'paper';
import PaperPage from './page';
import PaperLayer from './layer';
import {Fill} from './style/fill';
import PaperStyle from './style';
import TreeNode from './treeNode';

interface PaperArtboardProps {
  size: {width: number; height: number};
  position: {x: number; y: number};
  dispatch?: any;
  //parent: PaperPage;
  name?: string;
}

class PaperArtboard extends TreeNode {
  style: PaperStyle;
  constructor({size, position, name, dispatch}: PaperArtboardProps) {
    super({name, type: 'Artboard'});
    this.interactive = true;
    this.paperItem = new Group({
      data: {
        node: this
      }
    });
    const shape = new Path.Rectangle({
      point: new Point(position.x, position.y),
      size: new Size(size.width, size.height),
      fillColor: 'white',
      insert: false
    });
    this.style = this.addChild({
      node: new PaperStyle({
        style: {
          fills: [new Fill({fillType: 'Color', color: '#fff'})],
        },
        shape: shape
      })
    });
  }
}

export default PaperArtboard;