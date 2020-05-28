import { paperMain } from '../../canvas';

import {
  ENABLE_RECTANGLE_DRAW_TOOL,
  ENABLE_ELLIPSE_DRAW_TOOL,
  ENABLE_STAR_DRAW_TOOL,
  ENABLE_POLYGON_DRAW_TOOL,
  ENABLE_ROUNDED_DRAW_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  ToolTypes,
} from '../actionTypes/tool';

import DrawTool from '../../canvas/drawTool';
import SelectionTool from '../../canvas/selectionTool';
import ArtboardTool from '../../canvas/artboardTool';
import TextTool from '../../canvas/textTool';

export interface ToolState {
  tool: 'Draw' | 'Selection' | 'Artboard' | 'Text';
  drawing: boolean;
  drawShape: em.ShapeType;
  typing: boolean;
}

const initialState: ToolState = {
  tool: null,
  drawing: false,
  drawShape: null,
  typing: false
};

const removeActiveTool = () => {
  paperMain.tools.forEach((tool) => {
    tool.remove();
  });
}

export default (state = initialState, action: ToolTypes): ToolState => {
  switch (action.type) {
    case ENABLE_RECTANGLE_DRAW_TOOL: {
      removeActiveTool();
      new DrawTool({drawShapeType: 'Rectangle'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        typing: false,
        drawShape: 'Rectangle'
      };
    }
    case ENABLE_ELLIPSE_DRAW_TOOL: {
      removeActiveTool();
      new DrawTool({drawShapeType: 'Ellipse'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        typing: false,
        drawShape: 'Ellipse'
      };
    }
    case ENABLE_STAR_DRAW_TOOL: {
      removeActiveTool();
      new DrawTool({drawShapeType: 'Star'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        typing: false,
        drawShape: 'Star'
      };
    }
    case ENABLE_POLYGON_DRAW_TOOL: {
      removeActiveTool();
      new DrawTool({drawShapeType: 'Polygon'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        typing: false,
        drawShape: 'Polygon'
      };
    }
    case ENABLE_ROUNDED_DRAW_TOOL: {
      removeActiveTool();
      new DrawTool({drawShapeType: 'Rounded'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        typing: false,
        drawShape: 'Rounded'
      };
    }
    case ENABLE_SELECTION_TOOL: {
      removeActiveTool();
      new SelectionTool();
      return {
        ...state,
        tool: 'Selection',
        drawing: false,
        typing: false,
        drawShape: null
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
        tool: 'Artboard',
        drawing: false,
        typing: false,
        drawShape: null
      };
    }
    case ENABLE_TEXT_TOOL: {
      removeActiveTool();
      new TextTool();
      return {
        ...state,
        tool: 'Text',
        drawing: false,
        drawShape: null,
        typing: true
      };
    }
    default:
      return state;
  }
}
