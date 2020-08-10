import { paperMain } from '../../canvas';

import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_LINE_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  SET_ARTBOARD_TOOL_DEVICE_ORIENTATION,
  SET_ARTBOARD_TOOL_DEVICE_PLATFORM,
  ToolTypes,
} from '../actionTypes/tool';

import ShapeTool from '../../canvas/shapeTool';
import SelectionTool from '../../canvas/selectionTool';
import ArtboardTool from '../../canvas/artboardTool';
import TextTool from '../../canvas/textTool';

export interface ToolState {
  type: em.ToolType;
  shapeToolType: em.ShapeType;
  artboardToolDevicePlatform: em.DevicePlatformType;
  artboardToolOrientation: em.Orientation;
}

const initialState: ToolState = {
  type: null,
  shapeToolType: null,
  artboardToolDevicePlatform: 'Apple',
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
    case ENABLE_LINE_SHAPE_TOOL: {
      removeActiveTool();
      new ShapeTool('Line');
      return {
        ...state,
        type: 'Shape',
        shapeToolType: 'Line'
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
        type: null,
        shapeToolType: null
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
    case ENABLE_TEXT_TOOL: {
      removeActiveTool();
      new TextTool();
      return {
        ...state,
        type: 'Text'
      };
    }
    case SET_ARTBOARD_TOOL_DEVICE_ORIENTATION: {
      return {
        ...state,
        artboardToolOrientation: action.payload.orientation
      };
    }
    case SET_ARTBOARD_TOOL_DEVICE_PLATFORM: {
      return {
        ...state,
        artboardToolDevicePlatform: action.payload.platform
      };
    }
    default:
      return state;
  }
}
