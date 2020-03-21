const reducers = (state: any, action: any): any => {
  switch(action.type) {
    case 'initialize-app': {
      return {
        ...state,
        sketchDocument: action.sketchDocument,
        sketchMeta: action.sketchMeta,
        sketchUser: action.sketchUser,
        sketchPages: action.sketchPages,
        sketchImages: action.sketchImages,
        ready: action.ready
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