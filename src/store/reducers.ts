import paper, { Shape } from 'paper';

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
    case 'set-selected-layer': {
      return {
        ...state,
        selectedLayer: action.layer,
      };
    }
    case 'set-selected-artboard': {
      return {
        ...state,
        selectedArtboard: action.selectedArtboard,
      };
    }
    case 'set-selected-paper-layer': {
      return {
        ...state,
        selectedPaperLayer: action.selectedPaperLayer
      };
    }
    case 'set-canvas': {
      return {
        ...state,
        canvas: action.canvas
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
    case 'enable-draw-shape': {
      return {
        ...state,
        drawShape: true,
        drawShapeType: action.drawShapeType
      };
    }
    case 'disable-draw-shape': {
      return {
        ...state,
        drawShape: false,
        drawShapeType: null
      };
    }
    case 'add-artboard': {
      return {
        ...state,
        artboards: [...state.artboards, action.artboard]
      };
    }
    case 'add-layer': {
      return {
        ...state,
        layers: [...state.layers, action.layer]
      };
    }
    default:
      throw new Error(`Action not found ${action.type}`);
  }
};

export default reducers;