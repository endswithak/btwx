import {
  SET_CANVAS_ACTIVE_TOOL,
  SET_CANVAS_DRAWING,
  SET_CANVAS_TYPING,
  SET_CANVAS_ZOOMING,
  SET_CANVAS_SELECTING,
  SET_CANVAS_RESIZING,
  SET_CANVAS_DRAGGING,
  SET_CANVAS_MEASURING,
  SET_CANVAS_FOCUSING,
  RESET_CANVAS_SETTINGS,
  SET_CANVAS_MOUSE_POSITION,
  SET_CANVAS_TRANSLATING,
  SET_CANVAS_ZOOM_TYPE,
  SET_CANVAS_CURSOR,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  activeTool: Btwx.ToolType;
  mouse: {
    x: number;
    y: number;
    paperX: number;
    paperY: number;
  };
  drawing: boolean;
  typing: boolean;
  resizing: boolean;
  dragging: boolean;
  selecting: boolean;
  measuring: boolean;
  focusing: boolean;
  zooming: boolean;
  translating: boolean;
  zoomType: Btwx.ZoomType;
  resizeHandle: Btwx.ResizeHandle;
  dragHandle: boolean;
  lineHandle: Btwx.LineHandle;
  gradientHandle: Btwx.GradientHandle;
  cursor: Btwx.CanvasCursor[];
}

const initialState: CanvasSettingsState = {
  activeTool: null,
  mouse: null,
  drawing: false,
  typing: false,
  resizing: false,
  dragging: false,
  selecting: false,
  measuring: false,
  focusing: true,
  zooming: false,
  translating: false,
  zoomType: null,
  resizeHandle: null,
  dragHandle: false,
  lineHandle: null,
  gradientHandle: null,
  cursor: ['auto']
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_ACTIVE_TOOL: {
      return {
        ...state,
        activeTool: action.payload.activeTool,
        dragging: Object.prototype.hasOwnProperty.call(action.payload, 'dragging') ? action.payload.dragging : state.dragging,
        resizing: Object.prototype.hasOwnProperty.call(action.payload, 'resizing') ? action.payload.resizing : state.resizing,
        selecting: Object.prototype.hasOwnProperty.call(action.payload, 'selecting') ? action.payload.selecting : state.selecting,
        zooming: Object.prototype.hasOwnProperty.call(action.payload, 'zooming') ? action.payload.zooming : state.zooming,
        translating: Object.prototype.hasOwnProperty.call(action.payload, 'translating') ? action.payload.translating : state.translating,
        drawing: Object.prototype.hasOwnProperty.call(action.payload, 'drawing') ? action.payload.drawing : state.drawing,
        zoomType: Object.prototype.hasOwnProperty.call(action.payload, 'zoomType') ? action.payload.zoomType : state.zoomType,
        resizeHandle: Object.prototype.hasOwnProperty.call(action.payload, 'resizeHandle') ? action.payload.resizeHandle : state.resizeHandle,
        dragHandle: Object.prototype.hasOwnProperty.call(action.payload, 'dragHandle') ? action.payload.dragHandle : state.dragHandle,
        lineHandle: Object.prototype.hasOwnProperty.call(action.payload, 'lineHandle') ? action.payload.lineHandle : state.lineHandle,
        gradientHandle: Object.prototype.hasOwnProperty.call(action.payload, 'gradientHandle') ? action.payload.gradientHandle : state.gradientHandle,
        cursor: Object.prototype.hasOwnProperty.call(action.payload, 'cursor') ? action.payload.cursor : state.cursor
      };
    }
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
        resizing: action.payload.resizing
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
        zoomType: Object.prototype.hasOwnProperty.call(action.payload, 'zoomType') ? action.payload.zoomType : state.zoomType
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
    case SET_CANVAS_MOUSE_POSITION: {
      return {
        ...state,
        mouse: action.payload.mouse
      };
    }
    case SET_CANVAS_TRANSLATING: {
      return {
        ...state,
        translating: action.payload.translating
      };
    }
    case SET_CANVAS_ZOOM_TYPE: {
      return {
        ...state,
        zoomType: action.payload.zoomType
      };
    }
    case SET_CANVAS_CURSOR: {
      return {
        ...state,
        cursor: action.payload.cursor
      };
    }
    default:
      return state;
  }
}
