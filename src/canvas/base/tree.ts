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
  }
  addNodeAt({node, toNode, index}: {node: TreeNode; toNode: TreeNode; index: number}) {
    return toNode.addChildAt({node, index});
  }
  addNodeBelow({node, belowNode}: {node: TreeNode; belowNode: TreeNode}) {
    return belowNode.addChildBelow({node});
  }
  removeNode({node, fromNode}: {node: TreeNode; fromNode: TreeNode}) {
    return fromNode.removeChild({node});
  }
}

export default Tree;