import paper from 'paper';
import TreeNode from './treeNode';

interface StyleGroupNodeProps {
  parent: string;
  paperParent: number;
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
}

class StyleGroupNode extends TreeNode {
  styleGroupType: 'Fills' | 'Borders' | 'Shadows';
  constructor({styleGroupType, parent, paperParent}: StyleGroupNodeProps) {
    super({type: 'Style', parent, paperParent});
    this.styleGroupType = styleGroupType;
    const paperItem = new paper.Group({
      parent: paper.project.getItem({id: this.paperParent}),
      data: {
        id: this.id,
        layerId: parent
      }
    });
    this.paper = paperItem.id;
  }
}

export default StyleGroupNode;