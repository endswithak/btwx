import { ENABLE_DRAW_TOOL, DISABLE_DRAW_TOOL, DrawToolTypes } from '../actionTypes/drawTool';
import DrawTool from '../../canvas/drawTool';

export interface DrawToolState {
  drawTool: DrawTool;
  drawing: boolean;
  drawShape: em.ShapeType;
}

const initialState: DrawToolState = {
  drawTool: null,
  drawing: false,
  drawShape: null
};

export default (state = initialState, action: DrawToolTypes): DrawToolState => {
  switch (action.type) {
    case ENABLE_DRAW_TOOL: {
      return {
        ...state,
        drawTool: new DrawTool({drawShapeType: action.payload.drawShapeType}),
        drawing: true,
        drawShape: action.payload.drawShapeType
      };
    }
    case DISABLE_DRAW_TOOL: {
      state.drawTool.tool.remove();
      return {
        ...state,
        drawTool: null,
        drawing: false,
        drawShape: null
      };
    }
    default:
      return state;
  }
}
