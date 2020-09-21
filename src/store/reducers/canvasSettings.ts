import {
  SET_CANVAS_DRAWING,
  SET_CANVAS_TYPING,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_ZOOMING_TYPE,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_MEASURING,
  SET_CANVAS_FOCUSING,
  RESET_CANVAS_SETTINGS,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

// export interface CanvasSettingsState {
//   activeTool: em.ToolType;
//   drawing: boolean;
//   resizing: boolean;
//   dragging: boolean;
//   selecting: boolean;
//   measuring: boolean;
//   focusing: boolean;
//   zooming: boolean;
// }

export interface CanvasSettingsState {
  drawing: boolean;
  typing: boolean;
  resizing: boolean;
  resizingType: em.ResizingType;
  dragging: boolean;
  selecting: boolean;
  measuring: boolean;
  focusing: boolean;
  zooming: boolean;
  zoomingType: em.ZoomingType;
}

const initialState: CanvasSettingsState = {
  drawing: false,
  typing: false,
  resizing: false,
  resizingType: null,
  dragging: false,
  selecting: false,
  measuring: false,
  focusing: true,
  zooming: false,
  zoomingType: null
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_DRAWING: {
      return {
        ...state,
        drawing: action.payload.drawing
      };
    }
    case SET_CANVAS_TYPING: {
      return {
        ...state,
        typing: action.payload.typing
      };
    }
    case SET_CANVAS_RESIZING: {
      return {
        ...state,
        resizing: action.payload.resizing,
        resizingType: action.payload.resizingType ? action.payload.resizingType : null
      };
    }
    case SET_CANVAS_SELECTING: {
      return {
        ...state,
        selecting: action.payload.selecting
      };
    }
    case SET_CANVAS_DRAGGING: {
      return {
        ...state,
        dragging: action.payload.dragging
      };
    }
    case SET_CANVAS_ZOOMING: {
      return {
        ...state,
        zooming: action.payload.zooming,
        zoomingType: action.payload.zoomingType ? action.payload.zoomingType : null
      };
    }
    case SET_CANVAS_ZOOMING_TYPE: {
      return {
        ...state,
        zoomingType: action.payload.zoomingType
      };
    }
    case SET_CANVAS_MEASURING: {
      return {
        ...state,
        measuring: action.payload.measuring
      };
    }
    case SET_CANVAS_FOCUSING: {
      return {
        ...state,
        focusing: action.payload.focusing
      };
    }
    case RESET_CANVAS_SETTINGS: {
      return {
        ...state,
        ...initialState
      };
    }
    default:
      return state;
  }
}
