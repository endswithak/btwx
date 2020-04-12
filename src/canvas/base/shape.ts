import { v4 as uuidv4 } from 'uuid';
import paper, { Layer, Group } from 'paper';
import PaperStyle from './style';
import TreeNode from './treeNode';

interface PaperShapeProps {
  shape: paper.Path | paper.CompoundPath;
  dispatch?: any;
  name?: string;
  style?: {
    fills?: em.Fill[];
  };
}

class PaperShape extends TreeNode {
  shape: paper.Path | paper.CompoundPath;
  style: PaperStyle;
  constructor({shape, style, name}: PaperShapeProps) {
    super({name, type: 'Shape'});
    this.interactive = true;
    this.shape = shape;
    this.paperItem = new Layer({
      data: {
        node: this
      }
    });
    this.style = this.addChild({
      node: new PaperStyle({
        style: {
          fills: style.fills ? style.fills : [],
        },
        shape: this.shape
      })
    });
  }
}

export default PaperShape;