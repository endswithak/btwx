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
    //traversal.call(this, callback);
  }
  addNode({node, toNode}: {node: TreeNode, toNode: TreeNode}) {
    let parent: TreeNode = null;
    const callback = (node: TreeNode) => {
      if (node.id === toNode.id) {
        parent = node;
      }
    };
    this.contains(callback);
    if (parent) {
      parent.children.push(node);
      parent.paperItem.addChild(node.paperItem);
      node.parent = parent;
    } else {
      throw new Error('Cannot add node to a non-existent parent.');
    }
    return node;
  }
  removeNode({node, fromNode}: {node: TreeNode, fromNode: TreeNode}) {
    let parent: TreeNode = null;
    let childToRemove: TreeNode = null;
    let index: number;
    const callback = (node: TreeNode) => {
      if (node.id === fromNode.id) {
        parent = node;
      }
    };
    this.contains(callback);
    if (parent) {
      index = this.findIndex(parent.children, node);
      if (index === undefined) {
        throw new Error('Node to remove does not exist.');
      } else {
        childToRemove = parent.children.splice(index, 1)[0];
        childToRemove.parent = null;
        node.paperItem.remove();
      }
    } else {
      throw new Error('Parent does not exist.');
    }
    return childToRemove;
  }
  replaceNode({node, withNode}: {node: TreeNode, withNode: TreeNode}) {
    const parent = node.parent;
    const nodeIndex = node.parent.children.findIndex((child) => child.id === node.id);
    const withNodeIndex = withNode.parent.children.findIndex((child) => child.id === withNode.id);
    if (nodeIndex === undefined || withNodeIndex === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      withNode.parent.children.splice(withNodeIndex, 1);
      withNode.parent = parent;
      parent.paperItem.addChild(withNode.paperItem);
      parent.children.splice(nodeIndex, 1, withNode);
      node.paperItem.remove();
    }
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