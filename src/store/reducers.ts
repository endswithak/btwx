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
        paperApp: action.paperApp,
        treeData: action.paperApp.pageTree,
        selection: action.paperApp.selection
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
    case 'expand-node': {
      action.node.expanded = !action.node.expanded;
      return {
        ...state
      };
    }
    case 'add-node': {
      state.paperApp.pageTree.addNode({
        node: action.node,
        toNode: action.toNode
      });
      return {
        ...state
      };
    }
    case 'add-node-at': {
      state.paperApp.pageTree.addNodeAt({
        node: action.node,
        toNode: action.toNode,
        index: action.index
      });
      return {
        ...state
      };
    }
    case 'add-node-below': {
      state.paperApp.pageTree.addNodeBelow({
        node: action.node,
        belowNode: action.belowNode
      });
      return {
        ...state
      };
    }
    case 'remove-node': {
      state.paperApp.pageTree.removeNode({
        node: action.node,
        fromNode: action.fromNode
      });
      return {
        ...state
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
        ...state
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
        ...state
      };
    }
    case 'add-to-selection': {
      state.paperApp.selectionTool.addToSelection(action.layer);
      return {
        ...state,
        selection: state.paperApp.selection
      };
    }
    case 'remove-from-selection': {
      state.paperApp.selectionTool.removeFromSelection(action.layer);
      return {
        ...state,
        selection: state.paperApp.selection
      };
    }
    case 'clear-selection': {
      state.paperApp.selectionTool.clearSelection();
      return {
        ...state,
        selection: state.paperApp.selection
      };
    }
    case 'new-selection': {
      state.paperApp.selectionTool.clearSelection();
      state.paperApp.selectionTool.addToSelection(action.layer);
      return {
        ...state,
        selection: state.paperApp.selection
      };
    }
    case 'enable-visibility': {
      action.layer.enableVisibility();
      return {
        ...state
      };
    }
    case 'disable-visibility': {
      action.layer.disableVisibility();
      return {
        ...state
      };
    }
    case 'enable-style': {
      action.layer.enableStyle();
      return {
        ...state
      };
    }
    case 'disable-style': {
      action.layer.disableStyle();
      return {
        ...state
      };
    }
    case 'change-fill-opacity': {
      action.layer.changeFillOpacity(action.opacity);
      return {
        ...state
      };
    }
    default:
      throw new Error(`Action not found ${action.type}`);
  }
};

export default reducers;