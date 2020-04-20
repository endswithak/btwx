import { v4 as uuidv4 } from 'uuid';
import Queue from './queue';

interface TreeNodeProps {
  type: 'Style' | 'Layer';
  parent: string;
}

class TreeNode {
  id: string;
  type: 'Style' | 'Layer';
  parent: string;
  children: string[];
  constructor({type, parent}: TreeNodeProps) {
    this.id = uuidv4();
    this.type = type;
    this.parent = parent;
    this.children = [];
  }
  // traverse(callback: any) {
  //   const queue = new Queue();
  //   queue.enqueue(this);
  //   let currentTree = queue.dequeue();
  //   while(currentTree){
  //     for (let i = 0, length = currentTree.children.length; i < length; i++) {
  //       queue.enqueue(currentTree.children[i]);
  //     }
  //     callback(currentTree);
  //     currentTree = queue.dequeue();
  //   }
  // }
  // contains(callback: any) {
  //   this.traverse(callback);
  // }
  // getIndex(): number {
  //   return this.parent.children.findIndex((child) => child.id === this.id);
  // }
  // remove() {
  //   const index = this.getIndex();
  //   this.paperItem.remove();
  //   this.parent.children.splice(index, 1);
  // }
  // replaceWith({node}: {node: TreeNode}) {
  //   return this.parent.replaceChild({
  //     node: this,
  //     withNode: node
  //   });
  // }
  // addChild({node}: {node: TreeNode}) {
  //   if (node.parent) {
  //     node.parent.removeChild({node});
  //   }
  //   this.children.push(node);
  //   this.paperItem.addChild(node.paperItem);
  //   node.parent = this;
  //   return node;
  // }
  // addChildBelow({node}: {node: TreeNode}) {
  //   const index = this.parent.children.findIndex((child) => child.id === this.id);
  //   if (index === this.parent.children.length - 1) {
  //     this.parent.addChild({node});
  //   } else {
  //     this.parent.addChildAt({node, index: index + 1});
  //   }
  //   return node;
  // }
  // addChildAt({node, index}: {node: TreeNode; index: number}) {
  //   if (node.parent) {
  //     node.parent.removeChild({node});
  //   }
  //   this.children.splice(index, 0, node);
  //   this.paperItem.insertChild(index, node.paperItem);
  //   node.parent = this;
  //   return node;
  // }
  // removeChild({node}: {node: TreeNode}) {
  //   let childToRemove = null;
  //   const index = this.children.findIndex((child) => child.id === node.id);
  //   if (index === undefined) {
  //     throw new Error('Node to remove does not exist.');
  //   } else {
  //     childToRemove = this.children.splice(index, 1)[0];
  //     node.paperItem.remove();
  //   }
  //   return childToRemove;
  // }
  // replaceChild({node, withNode}: {node: TreeNode, withNode: TreeNode}) {
  //   let replacedChild = null;
  //   const nodeIndex = this.children.findIndex((child) => child.id === node.id);
  //   if (nodeIndex === undefined) {
  //     throw new Error('Node to replace does not exist.');
  //   } else {
  //     if (withNode.parent) {
  //       const withNodeIndex = withNode.parent.children.findIndex((child) => child.id === withNode.id);
  //       withNode.parent.children.splice(withNodeIndex, 1);
  //     }
  //     withNode.parent = this;
  //     this.paperItem.addChild(withNode.paperItem);
  //     this.children.splice(nodeIndex, 1, withNode);
  //     node.paperItem.remove();
  //     replacedChild = withNode;
  //   }
  //   return replacedChild;
  // }
}

export default TreeNode;