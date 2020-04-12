import paper, { Layer, Group } from 'paper';
import PaperFills from './style/fills';
import TreeNode from './treeNode';

interface PaperStyleProps {
  style: {
    fills: em.Fill[];
  };
  shape: paper.Path | paper.CompoundPath;
}

class PaperStyle extends TreeNode {
  fills?: PaperFills;
  constructor({style, shape}: PaperStyleProps) {
    super({name: 'Style', type: 'Style'});
    this.paperItem = new Group({
      data: {
        node: this
      }
    });
    this.fills = this.addChild({
      node: new PaperFills({
        fills: style.fills,
        shape: shape
      })
    });
  }
}

export default PaperStyle;