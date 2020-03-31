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
    case 'set-canvas': {
      return {
        ...state,
        canvas: action.canvas
      };
    }
    default:
      throw new Error('Action not found');
  }
};

export default reducers;