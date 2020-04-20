import paper from 'paper';
import TreeNode from './treeNode';

interface LayerNodeProps {
  parent: string;
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name?: string;
}

class LayerNode extends TreeNode {
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name: string;
  expanded: boolean;
  selected: boolean;
  canHaveLayers: boolean;
  constructor({name, layerType, parent}: LayerNodeProps) {
    super({type: 'Layer', parent: parent});
    this.layerType = layerType;
    this.name = name ? name : this.layerType;
    this.selected = false;
    this.expanded = false;
    // this.paperItem = new paper.Group({
    //   data: {
    //     node: this
    //   }
    // });
  }
}

export default LayerNode;