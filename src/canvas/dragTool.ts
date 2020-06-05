import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { moveLayersBy } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';

class DragTool {
  enabled: boolean;
  x: number;
  y: number;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
    this.x = null;
    this.y = null;
  }
  onEscape() {
    if (this.enabled) {
      if (this.x || this.y) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.position.x -= this.x;
            paperLayer.position.y -= this.y;
          });
        }
      }
    }
    this.disable();
  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      if (this.x || this.y) {
        if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
          paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
        }
        if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
          paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
        }
      }
      if (state.layer.present.selected.length > 0) {
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.position.x += event.delta.x;
          this.x += event.delta.x;
          paperLayer.position.y += event.delta.y;
          this.y += event.delta.y;
        });
        updateSelectionFrame(state.layer.present);
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x || this.y) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(moveLayersBy({layers: state.layer.present.selected, x: this.x, y: this.y}));
        }
      }
    }
    this.disable();
  }
}

export default DragTool;