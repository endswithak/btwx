import paper from 'paper';

import {
  ENABLE_RECTANGLE_DRAW_TOOL,
  ENABLE_ELLIPSE_DRAW_TOOL,
  ENABLE_STAR_DRAW_TOOL,
  ENABLE_POLYGON_DRAW_TOOL,
  ENABLE_ROUNDED_DRAW_TOOL,
  ENABLE_SELECTION_TOOL,
  ToolTypes
} from '../actionTypes/tool';

import DrawTool from '../../canvas/drawTool';
import SelectionTool from '../../canvas/selectionTool';

export interface ToolState {
  tool: 'Draw' | 'Selection';
  drawing: boolean;
  drawShape: em.ShapeType;
}

const initialState: ToolState = {
  tool: 'Selection',
  drawing: false,
  drawShape: null
};

export default (state = initialState, action: ToolTypes): ToolState => {
  switch (action.type) {
    case ENABLE_RECTANGLE_DRAW_TOOL: {
      paper.tools[0].remove();
      new DrawTool({drawShapeType: 'Rectangle'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        drawShape: 'Rectangle'
      };
    }
    case ENABLE_ELLIPSE_DRAW_TOOL: {
      paper.tools[0].remove();
      new DrawTool({drawShapeType: 'Ellipse'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        drawShape: 'Ellipse'
      };
    }
    case ENABLE_STAR_DRAW_TOOL: {
      paper.tools[0].remove();
      new DrawTool({drawShapeType: 'Star'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        drawShape: 'Star'
      };
    }
    case ENABLE_POLYGON_DRAW_TOOL: {
      paper.tools[0].remove();
      new DrawTool({drawShapeType: 'Polygon'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        drawShape: 'Polygon'
      };
    }
    case ENABLE_ROUNDED_DRAW_TOOL: {
      paper.tools[0].remove();
      new DrawTool({drawShapeType: 'Rounded'});
      return {
        ...state,
        tool: 'Draw',
        drawing: true,
        drawShape: 'Rounded'
      };
    }
    case ENABLE_SELECTION_TOOL: {
      if (paper.tools[0]) {
        paper.tools[0].remove();
      }
      new SelectionTool();
      return {
        ...state,
        tool: 'Selection',
        drawing: false,
        drawShape: null
      };
    }
    default:
      return state;
  }
}
