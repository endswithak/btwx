import paper from 'paper';
import TreeNode from './treeNode';

interface StyleGroupNodeProps {
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
}

class StyleGroupNode extends TreeNode {
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
  constructor({styleGroupType}: StyleGroupNodeProps) {
    super({type: 'Style'});
    this.styleGroupType = styleGroupType;
    this.paperItem = new paper.Group({
      data: {
        node: this
      }
    });
  }
}

export default StyleGroupNode;