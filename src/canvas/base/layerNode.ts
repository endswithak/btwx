import paper from 'paper';
import TreeNode from './treeNode';

interface LayerNodeProps {
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name?: string;
}

class LayerNode extends TreeNode {
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name: string;
  parent: LayerNode;
  expanded: boolean;
  selected: boolean;
  canHaveLayers: boolean;
  constructor({name, layerType}: LayerNodeProps) {
    super({type: 'Layer'});
    this.layerType = layerType;
    this.name = name ? name : this.layerType;
    this.canHaveLayers = true;
    this.selected = false;
    this.expanded = false;
    this.paperItem = new paper.Group({
      data: {
        node: this
      }
    });
  }
}

export default LayerNode;