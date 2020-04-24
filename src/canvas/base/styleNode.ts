import paper from 'paper';
import TreeNode from './treeNode';

interface StyleNodeProps {
  parent: string;
  paperParent: number;
  layer: string;
  paperShape: number;
  styleType: 'Fill' | 'Border' | 'Shadow';
}

class StyleNode extends TreeNode {
  layer: string;
  paperShape: number;
  styleType: 'Fill' | 'Border' | 'Shadow';
  enabled: boolean;
  constructor({styleType, parent, paperParent, layer, paperShape}: StyleNodeProps) {
    super({type: 'Style', parent, paperParent});
    this.styleType = styleType;
    this.layer = layer;
    this.paperShape = paperShape;
    this.enabled = true;
    const paperShapeItem = paper.project.getItem({id: this.paperShape}).clone();
    const paperParentItem = paper.project.getItem({id: this.paperParent});
    paperShapeItem.data = {
      id: this.id,
      layerId: layer
    }
    paperShapeItem.parent = paperParentItem;
    this.paper = paperShapeItem.id;
  }
}

export default StyleNode;