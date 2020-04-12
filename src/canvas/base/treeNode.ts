import { v4 as uuidv4 } from 'uuid';
import Tree from "./tree";

interface TreeNodeProps {
  type: 'Page' | 'Artboard' | 'Group' | 'Shape' | 'Document' | 'Style';
  name?: string;
}

class TreeNode {
  id: string;
  selected: boolean;
  interactive: boolean;
  name: string;
  paperItem: paper.Layer | paper.Group | paper.Path | paper.CompoundPath | paper.Raster;
  type: 'Page' | 'Artboard' | 'Group' | 'Shape' | 'Document' | 'Style';
  parent: TreeNode;
  children: TreeNode[];
  tree: Tree;
  constructor({type, name}: TreeNodeProps) {
    this.id = uuidv4();
    this.interactive = false;
    this.type = type;
    this.name = name ? name : this.type;
    this.parent = null;
    this.children = [];
  }
  getIndex(): number {
    return this.parent.children.findIndex((child) => child.id === this.id);
  }
  remove() {
    const index = this.getIndex();
    this.paperItem.remove();
    this.parent.children.splice(index, 1);
  }
  replaceWith({node}: {node: TreeNode}) {
    return this.parent.replaceChild({
      node: this,
      withNode: node
    });
  }
  addChild({node}: {node: TreeNode}) {
    this.children.push(node);
    this.paperItem.addChild(node.paperItem);
    node.parent = this;
    return node;
  }
  addChildAt({node, index}: {node: TreeNode; index: number}) {
    this.children.splice(index, 0, node);
    this.paperItem.insertChild(index, node.paperItem);
    node.parent = this;
    return node;
  }
  addChildAbove({node, above}: {node: TreeNode; above: TreeNode}) {
    const aboveIndex = this.children.findIndex((child) => child.id === above.id);
    if (aboveIndex) {
      node.parent = this;
      if (aboveIndex !== 0) {
        this.children.splice(aboveIndex, 0, node);
        this.paperItem.insertChild(aboveIndex, node.paperItem);
      } else {
        this.children.unshift(node);
        this.paperItem.addChild(node.paperItem);
      }
    } else {
      throw new Error('Reference node does not exist.');
    }
    return node;
  }
  addChildBelow({node, below}: {node: TreeNode; below: TreeNode}) {
    const belowIndex = this.children.findIndex((child) => child.id === below.id);
    if (belowIndex) {
      node.parent = this;
      if (belowIndex !== this.children.length - 1) {
        this.children.splice(belowIndex + 1, 0, node);
        this.paperItem.insertChild(belowIndex + 1, node.paperItem);
      } else {
        this.children.push(node);
        this.paperItem.addChild(node.paperItem);
      }
    } else {
      throw new Error('Reference node does not exist.');
    }
    return node;
  }
  removeChild({node}: {node: TreeNode}) {
    let childToRemove = null;
    const index = this.children.findIndex((child) => child.id === node.id);
    if (index === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = this.children.splice(index, 1)[0];
      node.paperItem.remove();
    }
    return childToRemove;
  }
  replaceChild({node, withNode}: {node: TreeNode, withNode: TreeNode}) {
    let replacedChild = null;
    const nodeIndex = this.children.findIndex((child) => child.id === node.id);
    if (nodeIndex === undefined) {
      throw new Error('Node to replace does not exist.');
    } else {
      if (withNode.parent) {
        const withNodeIndex = withNode.parent.children.findIndex((child) => child.id === withNode.id);
        withNode.parent.children.splice(withNodeIndex, 1);
      }
      withNode.parent = this;
      this.paperItem.addChild(withNode.paperItem);
      this.children.splice(nodeIndex, 1, withNode);
      node.paperItem.remove();
      replacedChild = withNode;
    }
    return replacedChild;
  }
}

export default TreeNode;