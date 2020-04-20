import TreeNode from './treeNode';
import LayerNode from './layerNode';

interface StyleNodeProps {
  parent: string;
  styleType: 'Fill' | 'Border' | 'Shadow';
}

class StyleNode extends TreeNode {
  styleType: 'Fill' | 'Border' | 'Shadow';
  enabled: boolean;
  constructor({styleType, parent}: StyleNodeProps) {
    super({type: 'Style', parent: parent});
    this.styleType = styleType;
    //this.paperItem = paperPath.clone() as paper.Path | paper.CompoundPath;
    //this.paperItem.data.node = this;
    this.enabled = true;
  }
  // enableStyle() {
  //   this.enabled = true;
  //   this.paperItem.visible = true;
  // }
  // disableStyle() {
  //   this.enabled = false;
  //   this.paperItem.visible = false;
  // }
}

export default StyleNode;