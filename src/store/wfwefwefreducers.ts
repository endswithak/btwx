import paper, { Shape } from 'paper';
import LayerNode from '../canvas/base/layerNode';
import ShapeNode from '../canvas/base/shapeNode';
import FillNode from '../canvas/base/fillNode';
import StyleGroupNode from '../canvas/base/styleGroupNode';
import DrawTool from '../canvas/drawTool';
import SelectionTool from '../canvas/selectionTool';

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
    case 'add-page': {
      // create shape node
      const page = new LayerNode({
        parent: null,
        layerType: 'Page'
      });
      // create paper layer
      const paperLayer = new paper.Group({
        data: { id: page.id }
      });
      return {
        ...state,
        pages: [...state.pages, page],
        activePage: page,
        paperLayers: [...state.paperLayers, paperLayer],
      };
    }
    case 'set-active-page': {
      // create shape node
      const page = state.pages.find((page: LayerNode) => page.id === action.id);
      return {
        ...state,
        activePage: page
      };
    }
    case 'add-shape': {
      // create shape node
      const shape = new ShapeNode({
        parent: action.parent ? action.parent : state.activePage.id,
        shapeType: action.shapeType,
        name: action.name
      });
      // create fill group
      const fillGroup = new StyleGroupNode({
        styleGroupType: 'Fills',
        parent: shape.id
      });
      //shape.children.push(fillGroup.id);
      shape.fills = fillGroup.id;
      // create new fill
      const fill = new FillNode({
        fillType: 'Color',
        parent: fillGroup.id
      });
      fillGroup.children.push(fill.id);
      // update paper shape
      action.paperShape.data.id = shape.id;
      // update parnet with new shape
      const updatedLayers = state.layers.map((layer: LayerNode) => {
        if (layer.id === action.parent) {
          layer.children.push(shape.id);
        }
        return layer;
      });
      // create paper layer
      const paperLayerParent = state.paperLayers.find((item: paper.Item) => item.data.id === action.parent);
      const paperLayer = new paper.Group({
        parent: paperLayerParent ? paperLayerParent : state.paperLayers.find((item: paper.Item) => item.data.id === state.activePage.id),
        data: { id: shape.id }
      });
      // create paper fill group layer
      const paperFillGroup = new paper.Group({
        parent: paperLayer,
        data: { id: fillGroup.id }
      });
      // create fill paper item
      const paperFill = action.paperShape.clone() as paper.Path | paper.CompoundPath;
      paperFill.fillColor = fill.color;
      paperFill.data.id = fill.id;
      paperFill.parent = paperFillGroup;
      return {
        ...state,
        layers: [...updatedLayers, shape],
        paperLayers: [...state.paperLayers, paperLayer, paperFillGroup, paperFill],
        paperShapes: [...state.paperShapes, action.paperShape],
        fillGroups: [...state.fillGroups, fillGroup],
        fills: [...state.fills, fill],
      };
    }
    // case 'set-paper-app': {
    //   return {
    //     ...state,
    //     paperApp: action.paperApp,
    //     treeData: action.paperApp.pageTree,
    //     selection: action.paperApp.selection
    //   };
    // }
    // case 'set-layers-sidebar-width': {
    //   return {
    //     ...state,
    //     layersSidebarWidth: action.layersSidebarWidth
    //   };
    // }
    // case 'set-styles-sidebar-width': {
    //   return {
    //     ...state,
    //     stylesSidebarWidth: action.stylesSidebarWidth
    //   };
    // }
    case 'add-draw-tool': {
      const drawTool = new DrawTool({dispatch: action.dispatch});
      return {
        ...state,
        drawTool: drawTool
      };
    }
    // case 'add-selection-tool': {
    //   return {
    //     ...state,
    //     selectionTool: new SelectionTool({dispatch: state.dispatch}),
    //   };
    // }
    case 'enable-draw-tool': {
      state.drawTool.clearProps();
      state.drawTool.tool.activate();
      state.drawTool.drawShapeType = action.shape;
      return {
        ...state,
        drawing: true,
        drawShape: action.shape
      };
    }
    case 'disable-draw-tool': {
      state.drawTool.clearProps();
      //state.selectionTool.tool.activate();
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
    // case 'add-node': {
    //   state.paperApp.pageTree.addNode({
    //     node: action.node,
    //     toNode: action.toNode
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'add-node-at': {
    //   state.paperApp.pageTree.addNodeAt({
    //     node: action.node,
    //     toNode: action.toNode,
    //     index: action.index
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'add-node-below': {
    //   state.paperApp.pageTree.addNodeBelow({
    //     node: action.node,
    //     belowNode: action.belowNode
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'remove-node': {
    //   state.paperApp.pageTree.removeNode({
    //     node: action.node,
    //     fromNode: action.fromNode
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'add-nodes': {
    //   action.nodes.forEach((node: TreeNode) => {
    //     state.paperApp.pageTree.addNode({
    //       node: node,
    //       toNode: action.toNode
    //     });
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'remove-nodes': {
    //   action.nodes.forEach((node: TreeNode) => {
    //     state.paperApp.pageTree.removeNode({
    //       node: node,
    //       fromNode: action.fromNode
    //     });
    //   });
    //   return {
    //     ...state
    //   };
    // }
    // case 'add-to-selection': {
    //   state.paperApp.selectionTool.addToSelection(action.layer);
    //   return {
    //     ...state,
    //     selection: state.paperApp.selection
    //   };
    // }
    // case 'remove-from-selection': {
    //   state.paperApp.selectionTool.removeFromSelection(action.layer);
    //   return {
    //     ...state,
    //     selection: state.paperApp.selection
    //   };
    // }
    // case 'clear-selection': {
    //   state.paperApp.selectionTool.clearSelection();
    //   return {
    //     ...state,
    //     selection: state.paperApp.selection
    //   };
    // }
    // case 'new-selection': {
    //   state.paperApp.selectionTool.clearSelection();
    //   state.paperApp.selectionTool.addToSelection(action.layer);
    //   return {
    //     ...state,
    //     selection: state.paperApp.selection
    //   };
    // }
    // case 'enable-visibility': {
    //   action.layer.enableVisibility();
    //   return {
    //     ...state
    //   };
    // }
    // case 'disable-visibility': {
    //   action.layer.disableVisibility();
    //   return {
    //     ...state
    //   };
    // }
    // case 'enable-style': {
    //   action.layer.enableStyle();
    //   return {
    //     ...state
    //   };
    // }
    // case 'disable-style': {
    //   action.layer.disableStyle();
    //   return {
    //     ...state
    //   };
    // }
    // case 'change-fill-opacity': {
    //   action.layer.changeFillOpacity(action.opacity);
    //   return {
    //     ...state
    //   };
    // }
    default:
      throw new Error(`Action not found ${action.type}`);
  }
};

export default reducers;