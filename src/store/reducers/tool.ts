import { paperMain } from '../../canvas';

import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION,
  ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION,
  ToolTypes,
} from '../actionTypes/tool';

import ShapeTool from '../../canvas/shapeTool';
import SelectionTool from '../../canvas/selectionTool';
import ArtboardTool from '../../canvas/artboardTool';
import TextTool from '../../canvas/textTool';

export interface ToolState {
  type: em.ToolType;
  shapeToolType: em.ShapeType;
  artboardToolOrientation: em.Orientation;
}

const initialState: ToolState = {
  type: null,
  shapeToolType: null,
  artboardToolOrientation: 'Portrait'
};

const removeActiveTool = () => {
  paperMain.tools.forEach((tool) => {
    tool.remove();
  });
}

export default (state = initialState, action: ToolTypes): ToolState => {
  switch (action.type) {
    case ENABLE_RECTANGLE_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Rectangle');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Rectangle'
      };
    }
    case ENABLE_ELLIPSE_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Ellipse');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Ellipse'
      };
    }
    case ENABLE_STAR_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Star');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Star'
      };
    }
    case ENABLE_POLYGON_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Polygon');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Polygon'
      };
    }
    case ENABLE_ROUNDED_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Rounded');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Rounded'
      };
    }
    case ENABLE_SELECTION_TOOL: {
      removeActiveTool();
      new SelectionTool();
      return {
        ...state,
        type: 'Selection'
      };
    }
    case DISABLE_SELECTION_TOOL: {
      removeActiveTool();
      return {
        ...state,
        ...initialState
      };
    }
    case ENABLE_ARTBOARD_TOOL: {
      removeActiveTool();
      new ArtboardTool();
      return {
        ...state,
        type: 'Artboard'
      };
    }
    case ENABLE_ARTBOARD_TOOL_PORTRAIT_ORIENTATION: {
      return {
        ...state,
        artboardToolOrientation: 'Portrait'
      };
    }
    case ENABLE_ARTBOARD_TOOL_LANDSCAPE_ORIENTATION: {
      return {
        ...state,
        artboardToolOrientation: 'Landscape'
      };
    }
    case ENABLE_TEXT_TOOL: {
      removeActiveTool();
      new TextTool();
      return {
        ...state,
        type: 'Text'
      };
    }
    default:
      return state;
  }
}
