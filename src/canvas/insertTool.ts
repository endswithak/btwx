import { enableSelectionToolThunk, enableRectangleShapeToolThunk, enableEllipseShapeToolThunk, enableStarShapeToolThunk, enablePolygonShapeToolThunk, enableLineShapeToolThunk, enableRoundedShapeToolThunk, enableArtboardToolThunk, enableTextToolThunk } from '../store/actions/tool';
import { resetCanvasSettings } from '../store/actions/canvasSettings';
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
            store.dispatch(enableSelectionToolThunk() as any);
          }
          break;
        }
        case 'a': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Artboard') {
              store.dispatch(enableSelectionToolThunk() as any);
            } else {
              store.dispatch(enableArtboardToolThunk() as any);
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
                store.dispatch(enableSelectionToolThunk() as any);
              }
            // else handle rectangle tool toggle
            } else {
              if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Rectangle') {
                store.dispatch(enableSelectionToolThunk() as any);
              } else {
                store.dispatch(enableRectangleShapeToolThunk() as any);
              }
            }
          } else {
            if (event.modifiers.meta) {
              store.dispatch(resetCanvasSettings());
            }
          }
          break;
        }
        case 'o': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Ellipse') {
              store.dispatch(enableSelectionToolThunk() as any);
            } else {
              store.dispatch(enableEllipseShapeToolThunk() as any);
            }
          }
          break;
        }
        case 'u': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Rounded') {
              store.dispatch(enableSelectionToolThunk() as any);
            } else {
              store.dispatch(enableRoundedShapeToolThunk() as any);
            }
          }
          break;
        }
        case 't': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Text') {
              store.dispatch(enableSelectionToolThunk() as any);
            } else {
              store.dispatch(enableTextToolThunk() as any);
            }
          }
          break;
        }
        case 'l': {
          const state = store.getState();
          if (state.canvasSettings.focusing) {
            if (state.tool.type === 'Shape' && state.tool.shapeToolType === 'Line') {
              store.dispatch(enableSelectionToolThunk() as any);
            } else {
              store.dispatch(enableLineShapeToolThunk() as any);
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