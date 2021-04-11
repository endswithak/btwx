import {
  ENABLE_SHAPE_TOOL,
  DISABLE_SHAPE_TOOL,
  SET_SHAPE_TOOL_TYPE,
  ShapeToolTypes,
} from '../actionTypes/shapeTool';

export interface ShapeToolState {
  isEnabled: boolean;
  shapeType: Btwx.ShapeType;
}

const initialState: ShapeToolState = {
  isEnabled: false,
  shapeType: null
};

export default (state = initialState, action: ShapeToolTypes): ShapeToolState => {
  switch (action.type) {
    case ENABLE_SHAPE_TOOL: {
      return {
        ...state,
        isEnabled: true,
        shapeType: action.payload.shapeType
      };
    }
    case DISABLE_SHAPE_TOOL: {
      return {
        ...state,
        isEnabled: false,
        shapeType: null
      };
    }
    case SET_SHAPE_TOOL_TYPE: {
      return {
        ...state,
        shapeType: action.payload.shapeType
      };
    }
    default:
      return state;
  }
}
