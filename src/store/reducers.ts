import paper, { Shape } from 'paper';
import TreeNode from '../canvas/base/treeNode';

const reducers = (state: any, action: any): any => {
  switch(action.type) {
    case 'initialize-app': {
      return {
        ...state,
        ready: action.ready,
        sketchDocument: action.sketchDocument,
        sketchMeta: action.sketchMeta,
        sketchUser: action.sketchUser,
        sketchPages: action.sketchPages,
        sketchImages: action.sketchImages
      };
    }
    case 'set-drag-layer': {
      return {
        ...state,
        dragLayer: action.dragLayer
      };
    }
    case 'set-dropzone': {
      return {
        ...state,
        dragEnterLayer: action.dragEnterLayer,
        dropzone: action.dropzone
      };
    }
    case 'clear-layer-drag-drop': {
      return {
        ...state,
        dragLayer: null,
        dragEnterLayer: null,
        dropzone: null
      };
    }
    case 'set-paper-app': {
      return {
        ...state,
        paperApp: action.paperApp
      };
    }
    case 'set-layers-sidebar-width': {
      return {
        ...state,
        layersSidebarWidth: action.layersSidebarWidth
      };
    }
    case 'set-styles-sidebar-width': {
      return {
        ...state,
        stylesSidebarWidth: action.stylesSidebarWidth
      };
    }
    case 'enable-draw-tool': {
      state.paperApp.drawTool.enable(action.shape);
      return {
        ...state,
        drawing: true,
        drawShape: action.shape
      };
    }
    case 'disable-draw-tool': {
      state.paperApp.drawTool.disable();
      return {
        ...state,
        drawing: false,
        drawShape: null
      };
    }
    case 'add-to-selection': {
      return {
        ...state,
        selection: state.paperApp.selectionTool.addToSelection(action.layer)
      };
    }
    case 'update-tree-data': {
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'expand-node': {
      action.node.expanded = !action.node.expanded;
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'add-node': {
      state.paperApp.pageTree.addNode({
        node: action.node,
        toNode: action.toNode
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'add-node-at': {
      state.paperApp.pageTree.addNodeAt({
        node: action.node,
        toNode: action.toNode,
        index: action.index
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'add-node-below': {
      state.paperApp.pageTree.addNodeBelow({
        node: action.node,
        belowNode: action.belowNode
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'remove-node': {
      state.paperApp.pageTree.removeNode({
        node: action.node,
        fromNode: action.fromNode
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'add-nodes': {
      action.nodes.forEach((node: TreeNode) => {
        state.paperApp.pageTree.addNode({
          node: node,
          toNode: action.toNode
        });
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'remove-nodes': {
      action.nodes.forEach((node: TreeNode) => {
        state.paperApp.pageTree.removeNode({
          node: node,
          fromNode: action.fromNode
        });
      });
      return {
        ...state,
        treeData: state.paperApp.pageTree
      };
    }
    case 'remove-from-selection': {
      return {
        ...state,
        selection: state.paperApp.selectionTool.removeFromSelection(action.layer)
      };
    }
    case 'clear-selection': {
      return {
        ...state,
        selection: state.paperApp.selectionTool.clearSelection()
      };
    }
    case 'new-selection': {
      state.paperApp.selectionTool.clearSelection();
      return {
        ...state,
        selection: state.paperApp.selectionTool.addToSelection(action.layer)
      };
    }
    default:
      throw new Error(`Action not found ${action.type}`);
  }
};

export default reducers;