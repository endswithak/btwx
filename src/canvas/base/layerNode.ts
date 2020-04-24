import paper from 'paper';
import TreeNode from './treeNode';
import StyleGroupNode from './styleGroupNode';

interface LayerNodeProps {
  parent: string;
  paperParent: number;
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name?: string;
}

class LayerNode extends TreeNode {
  layerType: 'Document' | 'Page' | 'Artboard' | 'Group' | 'Shape';
  name: string;
  expanded: boolean;
  selected: boolean;
  style: {
    fills: StyleGroupNode;
    borders: StyleGroupNode;
    shadows: StyleGroupNode;
  }
  constructor({name, layerType, parent, paperParent}: LayerNodeProps) {
    super({type: 'Layer', parent, paperParent});
    this.layerType = layerType;
    this.name = name ? name : this.layerType;
    this.selected = false;
    this.expanded = false;
    const paperItem = new paper.Group({
      parent: paper.project.getItem({id: this.paperParent}),
      data: {
        id: this.id,
        layerId: this.id
      }
    });
    this.paper = paperItem.id;
    this.style = {
      fills: new StyleGroupNode({
        styleGroupType: 'Fills',
        parent: this.id,
        paperParent: this.paper
      }),
      borders: new StyleGroupNode({
        styleGroupType: 'Borders',
        parent: this.id,
        paperParent: this.paper
      }),
      shadows: new StyleGroupNode({
        styleGroupType: 'Borders',
        parent: this.id,
        paperParent: this.paper
      })
    }
    // this.style.fills = new StyleGroupNode({
    //   styleGroupType: 'Fills',
    //   parent: this.id,
    //   paperParent: this.paper
    // });
    // this.style.borders = new StyleGroupNode({
    //   styleGroupType: 'Borders',
    //   parent: this.id,
    //   paperParent: this.paper
    // });
    // this.style.shadows = new StyleGroupNode({
    //   styleGroupType: 'Borders',
    //   parent: this.id,
    //   paperParent: this.paper
    // });
  }
}

export default LayerNode;