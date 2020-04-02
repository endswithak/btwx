const reducers = (state: any, action: any): any => {
  switch(action.type) {
    case 'initialize-app': {
      return {
        ...state,
        ready: action.ready,
        appWindow: action.appWindow,
        sketchDocument: action.sketchDocument,
        sketchMeta: action.sketchMeta,
        sketchUser: action.sketchUser,
        sketchPages: action.sketchPages,
        sketchImages: action.sketchImages,
        selectedPage: action.selectedPage,
        selectedPageArtboards: action.selectedPageArtboards,
        selectedArtboard: action.selectedArtboard
      };
    }
    case 'set-selected-layer': {
      return {
        ...state,
        selectedLayer: action.layer,
        selectedLayerPath: action.path
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
    default:
      throw new Error('Action not found');
  }
};

export default reducers;