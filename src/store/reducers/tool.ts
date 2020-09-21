import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_LINE_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
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
    case ENABLE_RECTANGLE_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Rectangle'
      };
    }
    case ENABLE_ELLIPSE_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Ellipse'
      };
    }
    case ENABLE_STAR_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Star'
      };
    }
    case ENABLE_POLYGON_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Polygon'
      };
    }
    case ENABLE_ROUNDED_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Rounded'
      };
    }
    case ENABLE_LINE_SHAPE_TOOL: {
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Line'
      };
    }
    case ENABLE_SELECTION_TOOL: {
      return {
        ...state,
        type: 'Selection'
      };
    }
    case ENABLE_ARTBOARD_TOOL: {
      return {
        ...state,
        type: 'Artboard'
      };
    }
    case ENABLE_TEXT_TOOL: {
      return {
        ...state,
        type: 'Text'
      };
    }
    default:
      return state;
  }
}
