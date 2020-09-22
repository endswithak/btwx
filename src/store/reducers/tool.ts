import {
  ENABLE_SHAPE_TOOL,
  DISABLE_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  DISABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  DISABLE_TEXT_TOOL,
  DISABLE_ACTIVE_TOOL,
  ToolTypes,
} from '../actionTypes/tool';

export interface ToolState {
  type: em.ToolType;
  shapeToolType: em.ShapeType;
}

const initialState: ToolState = {
  type: null,
  shapeToolType: null
};

export default (state = initialState, action: ToolTypes): ToolState => {
  switch (action.type) {
    case ENABLE_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: action.payload.shapeType
      };
    }
    case DISABLE_SHAPE_TOOL: {
      return {
        ...state,
        type: null,
        shapeToolType: null
      };
    }
    case ENABLE_SELECTION_TOOL: {
      return {
        ...state,
        type: 'Selection'
      };
    }
    case DISABLE_SELECTION_TOOL: {
      return {
        ...state,
        type: null
      };
    }
    case ENABLE_ARTBOARD_TOOL: {
      return {
        ...state,
        type: 'Artboard'
      };
    }
    case DISABLE_ARTBOARD_TOOL: {
      return {
        ...state,
        type: null
      };
    }
    case ENABLE_TEXT_TOOL: {
      return {
        ...state,
        type: 'Text'
      };
    }
    case DISABLE_TEXT_TOOL: {
      return {
        ...state,
        type: null
      };
    }
    case DISABLE_ACTIVE_TOOL: {
      return {
        ...state,
        type: null,
        shapeToolType: null
      };
    }
    default:
      return state;
  }
}
