import TreeNode from './treeNode';
import LayerNode from './layerNode';

interface StyleNodeProps {
  styleType: 'Fill' | 'Border' | 'Shadow';
  paperPath: paper.Path | paper.CompoundPath;
}

class StyleNode extends TreeNode {
  styleType: 'Fill' | 'Border' | 'Shadow';
  parent: LayerNode | StyleNode;
  enabled: boolean;
  constructor({styleType, paperPath}: StyleNodeProps) {
    super({type: 'Style'});
    this.styleType = styleType;
    this.paperItem = paperPath.clone() as paper.Path | paper.CompoundPath;
    this.paperItem.data.node = this;
    this.enabled = true;
  }
  enableStyle() {
    this.enabled = true;
    this.paperItem.visible = true;
  }
  disableStyle() {
    this.enabled = false;
    this.paperItem.visible = false;
  }
}

export default StyleNode;