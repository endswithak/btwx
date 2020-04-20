import paper from 'paper';
import TreeNode from './treeNode';

interface StyleGroupNodeProps {
  parent: string;
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
}

class StyleGroupNode extends TreeNode {
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
  constructor({styleGroupType, parent}: StyleGroupNodeProps) {
    super({type: 'Style', parent: parent});
    this.styleGroupType = styleGroupType;
  }
}

export default StyleGroupNode;