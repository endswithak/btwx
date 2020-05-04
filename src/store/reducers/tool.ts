import paper from 'paper';

import {
  ENABLE_RECTANGLE_DRAW_TOOL,
  ENABLE_ELLIPSE_DRAW_TOOL,
  ENABLE_STAR_DRAW_TOOL,
  ENABLE_POLYGON_DRAW_TOOL,
  ENABLE_ROUNDED_DRAW_TOOL,
  ENABLE_SELECTION_TOOL,
  ENABLE_DRAG_TOOL,
  ToolTypes,
} from '../actionTypes/tool';

import DrawTool from '../../canvas/drawTool';
import SelectionTool from '../../canvas/selectionTool';
import DragTool from '../../canvas/dragTool';

export interface ToolState {
  tool: 'Draw' | 'Selection' | 'Drag';
  drawing: boolean;
  drawShape: em.ShapeType;
  dragging: boolean;
}

const initialState: ToolState = {
  tool: null,
  drawing: false,
  drawShape: null,
  dragging: false
};

const removeActiveTool = () => {
  if (paper.tools[0]) {
    paper.tools[0].remove();
  }
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
        drawShape: null
      };
    }
    case ENABLE_DRAG_TOOL: {
      removeActiveTool();
      new DragTool();
      return {
        ...state,
        tool: 'Drag',
        drawing: false,
        drawShape: null,
        dragging: true
      };
    }
    default:
      return state;
  }
}
