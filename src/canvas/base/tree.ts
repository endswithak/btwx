import TreeNode from "./treeNode";
import Queue from "./queue";

class Tree {
  root: TreeNode;
  constructor({rootNode}: {rootNode: TreeNode}) {
    this.root = rootNode;
  }
  traverse(callback: any) {
    const queue = new Queue();
    queue.enqueue(this.root);
    let currentTree = queue.dequeue();
    while(currentTree){
      for (let i = 0, length = currentTree.children.length; i < length; i++) {
        queue.enqueue(currentTree.children[i]);
      }
      callback(currentTree);
      currentTree = queue.dequeue();
    }
  }
  contains(callback: any) {
    this.traverse(callback);
  }
  addNode({node, toNode}: {node: TreeNode; toNode: TreeNode}) {
    return toNode.addChild({node});
    // let parent: TreeNode = null;
    // const callback = (node: TreeNode) => {
    //   if (node.id === toNode.id) {
    //     parent = node;
    //   }
    // };
    // this.contains(callback);
    // if (parent) {
    //   parent.children.push(node);
    //   parent.paperItem.addChild(node.paperItem);
    //   node.parent = parent;
    // } else {
    //   throw new Error('Cannot add node to a non-existent parent.');
    // }
    // return node;
  }
  addNodeAt({node, toNode, index}: {node: TreeNode; toNode: TreeNode; index: number}) {
    return toNode.addChildAt({node, index});
    // let parent: TreeNode = null;
    // const callback = (node: TreeNode) => {
    //   if (node.id === toNode.id) {
    //     parent = node;
    //   }
    // };
    // this.contains(callback);
    // if (parent) {
    //   parent.children.push(node);
    //   parent.paperItem.addChild(node.paperItem);
    //   node.parent = parent;
    // } else {
    //   throw new Error('Cannot add node to a non-existent parent.');
    // }
    // return node;
  }
  removeNode({node, fromNode}: {node: TreeNode; fromNode: TreeNode}) {
    return fromNode.removeChild({node});
    // let parent: TreeNode = null;
    // let childToRemove: TreeNode = null;
    // let index: number;
    // const callback = (node: TreeNode) => {
    //   if (node.id === fromNode.id) {
    //     parent = node;
    //   }
    // };
    // this.contains(callback);
    // if (parent) {
    //   index = this.findIndex(parent.children, node);
    //   if (index === undefined) {
    //     throw new Error('Node to remove does not exist.');
    //   } else {
    //     childToRemove = parent.children.splice(index, 1)[0];
    //     childToRemove.parent = null;
    //     node.paperItem.remove();
    //   }
    // } else {
    //   throw new Error('Parent does not exist.');
    // }
    // return childToRemove;
  }
  findIndex(treeNodes: TreeNode[], node: TreeNode) {
    let index;
    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i].id === node.id) {
        index = i;
      }
    }
    return index;
  }
}

export default Tree;