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
        treeData: action.treeData
      };
    }
    case 'add-node': {
      state.paperApp.pageTree.addNode({
        node: action.node,
        toNode: action.toNode
      });
      return {
        ...state,
        treeData: [...state.paperApp.page.children]
      };
    }
    case 'remove-node': {
      state.paperApp.pageTree.removeNode({
        node: action.node,
        fromNode: action.fromNode
      });
      return {
        ...state,
        treeData: [...state.paperApp.page.children]
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
        treeData: [...state.paperApp.page.children]
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
        treeData: [...state.paperApp.page.children]
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
        treeData: [...state.paperApp.page.children]
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