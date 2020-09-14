import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableLineShapeTool, enableRoundedShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import store from '../store';

class InsertTool {
  enabled: boolean;
  constructor() {
    this.enabled = true;
  }
  onKeyDown(event: paper.KeyEvent): void {
    if (this.enabled) {
      switch(event.key) {
        case 'escape': {
          const state = store.getState();
          if (state.tool.type !== 'Selection' && state.canvasSettings.focusing) {
            store.dispatch(enableSelectionTool());
          }
          break;
        }
        case 'a': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Artboard') {
              store.dispatch(enableSelectionTool());
            } else {
              store.dispatch(enableArtboardTool());
            }
          }
          break;
        }
        case 'r': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            // remove any tools if meta modifier (window refresh)
            if (event.modifiers.meta) {
              if (state.tool.type !== 'Selection') {
                store.dispatch(enableSelectionTool());
              }
            // else handle rectangle tool toggle
            } else {
              if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Rectangle') {
                store.dispatch(enableSelectionTool());
              } else {
                store.dispatch(enableRectangleShapeTool());
              }
            }
          }
          break;
        }
        case 'o': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Ellipse') {
              store.dispatch(enableSelectionTool());
            } else {
              store.dispatch(enableEllipseShapeTool());
            }
          }
          break;
        }
        case 'u': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Rounded') {
              store.dispatch(enableSelectionTool());
            } else {
              store.dispatch(enableRoundedShapeTool());
            }
          }
          break;
        }
        case 't': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Text') {
              store.dispatch(enableSelectionTool());
            } else {
              store.dispatch(enableTextTool());
            }
          }
          break;
        }
        case 'l': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Line') {
              store.dispatch(enableSelectionTool());
            } else {
              store.dispatch(enableLineShapeTool());
            }
          }
          break;
        }
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    return;
  }
}

export default InsertTool;