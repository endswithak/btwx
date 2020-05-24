import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { resizeLayersBy } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer, getSelectionBounds } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';

class ResizeTool {
  enabled: boolean;
  to: paper.Rectangle;
  from: paper.Rectangle;
  ref: paper.Path;
  diffY: number;
  diffX: number;
  width: number;
  x: number;
  y: number;
  height: number;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.to = null;
    this.from = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.diffX = null;
    this.diffY = null;
    this.ref = null;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  enable(handle: string) {
    const state = store.getState();
    this.enabled = true;
    this.handle = handle;
    this.from = getSelectionBounds(state.layer.present);
    this.to = getSelectionBounds(state.layer.present);
    updateSelectionFrame(state.layer.present, this.handle);
  }
  disable() {
    this.enabled = false;
    this.to = null;
    this.from = null;
    this.width = null;
    this.height = null;
    this.handle = null;
    this.diffX = null;
    this.diffY = null;
    this.ref = null;
    this.x = null;
    this.y = null;
  }
  onEscape() {
    if (this.enabled) {
      if (this.width || this.height) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.bounds.width -= this.width;
            paperLayer.bounds.height -= this.height;
            paperLayer.position.x -= this.x;
            paperLayer.position.y -= this.y;
          });
        }
      }
    }
    this.disable();
  }
  onShiftDown() {

  }
  onShiftUp() {

  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      if (this.width || this.height) {
        if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
          paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
        }
        if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
          paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
        }
      }
      if (state.layer.present.selected.length > 0) {
        if (this.ref) {
          this.ref.remove();
        }
        switch(this.handle) {
          case 'topLeft': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width - event.delta.x <= 0) {
              this.handle = 'topRight';
              newTo.width += event.delta.x;
            } else {
              newTo.width -= event.delta.x;
            }
            if (newTo.height - event.delta.y <= 0) {
              this.handle = 'bottomLeft';
              newTo.height += event.delta.y;
            } else {
              newTo.height -= event.delta.y;
            }
            this.diffX = newTo.width / oldTo.width;
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'topCenter': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.height - event.delta.y <= 0) {
              this.handle = 'bottomCenter';
              newTo.height += event.delta.y;
            } else {
              newTo.height -= event.delta.y;
              newTo.y += event.delta.y;
            }
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'topRight': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width + event.delta.x <= 0) {
              this.handle = 'topLeft';
              newTo.width -= event.delta.x;
            } else {
              newTo.width += event.delta.x;
            }
            if (newTo.height - event.delta.y <= 0) {
              this.handle = 'bottomRight';
              newTo.height += event.delta.y;
            } else {
              newTo.height -= event.delta.y;
            }
            this.diffX = newTo.width / oldTo.width;
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'bottomLeft': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width - event.delta.x <= 0) {
              this.handle = 'bottomRight';
              newTo.width += event.delta.x;
            } else {
              newTo.width -= event.delta.x;
            }
            if (newTo.height + event.delta.y <= 0) {
              this.handle = 'topLeft';
              newTo.height -= event.delta.y;
            } else {
              newTo.height += event.delta.y;
            }
            this.diffX = newTo.width / oldTo.width;
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'bottomCenter': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.height + event.delta.y <= 0) {
              this.handle = 'topCenter';
              newTo.height -= event.delta.y;
            } else {
              newTo.height += event.delta.y;
            }
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'bottomRight': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width + event.delta.x <= 0) {
              this.handle = 'bottomLeft';
              newTo.width -= event.delta.x;
            } else {
              newTo.width += event.delta.x;
            }
            if (newTo.height + event.delta.y <= 0) {
              this.handle = 'topRight';
              newTo.height -= event.delta.y;
            } else {
              newTo.height += event.delta.y;
            }
            this.diffX = newTo.width / oldTo.width;
            this.diffY = newTo.height / oldTo.height;
            this.to = newTo;
            break;
          }
          case 'leftCenter': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width - event.delta.x <= 0) {
              this.handle = 'rightCenter';
              newTo.width += event.delta.x;
            } else {
              newTo.width -= event.delta.x;
            }
            this.diffX = newTo.width / oldTo.width;
            this.to = newTo;
            break;
          }
          case 'rightCenter': {
            const oldTo = this.to;
            const newTo = this.to.clone();
            if (newTo.width + event.delta.x <= 0) {
              this.handle = 'leftCenter';
              newTo.width -= event.delta.x;
            } else {
              newTo.width += event.delta.x;
            }
            this.diffX = newTo.width / oldTo.width;
            this.to = newTo;
            break;
          }
        }
        //const diffPercentage = this.to.height / this.from.height;
        state.layer.present.selected.forEach((layer) => {
          const layerItem = state.layer.present.byId[layer];
          const paperLayer = getPaperLayer(layer);
          if (this.shiftModifier) {
            // switch(this.handle) {
            //   case 'topLeft': {
            //     paperLayer.bounds.width -= event.delta.x;
            //     paperLayer.bounds.height -= event.delta.x;
            //     paperLayer.position.y += event.delta.x;
            //     paperLayer.position.x += event.delta.x;
            //     this.width -= event.delta.x;
            //     this.height -= event.delta.x;
            //     this.x += event.delta.x;
            //     this.y += event.delta.x;
            //     break;
            //   }
            //   case 'topCenter': {
            //     paperLayer.bounds.width -= event.delta.y;
            //     paperLayer.bounds.height -= event.delta.y;
            //     paperLayer.position.y += event.delta.y;
            //     this.width -= event.delta.y;
            //     this.height -= event.delta.y;
            //     this.y += event.delta.y;
            //     break;
            //   }
            //   case 'topRight': {
            //     paperLayer.bounds.width += event.delta.x;
            //     paperLayer.bounds.height += event.delta.x;
            //     paperLayer.position.y -= event.delta.x;
            //     this.width += event.delta.x;
            //     this.height += event.delta.x;
            //     this.y -= event.delta.x;
            //     break;
            //   }
            //   case 'bottomLeft': {
            //     paperLayer.bounds.width -= event.delta.x;
            //     paperLayer.bounds.height -= event.delta.x;
            //     paperLayer.position.x += event.delta.x;
            //     this.width -= event.delta.x;
            //     this.height -= event.delta.x;
            //     this.x += event.delta.x;
            //     break;
            //   }
            //   case 'bottomCenter': {
            //     paperLayer.bounds.height += event.delta.y;
            //     paperLayer.bounds.width += event.delta.y;
            //     this.width += event.delta.y;
            //     this.height += event.delta.y;
            //     break;
            //   }
            //   case 'bottomRight': {
            //     paperLayer.bounds.width += event.delta.x;
            //     paperLayer.bounds.height += event.delta.x;
            //     this.width += event.delta.x;
            //     this.height += event.delta.x;
            //     break;
            //   }
            //   case 'leftCenter': {
            //     paperLayer.bounds.width -= event.delta.x;
            //     paperLayer.bounds.height -= event.delta.x;
            //     paperLayer.position.x += event.delta.x;
            //     this.width -= event.delta.x;
            //     this.height -= event.delta.x;
            //     this.x += event.delta.x;
            //     break;
            //   }
            //   case 'rightCenter': {
            //     paperLayer.bounds.width += event.delta.x;
            //     paperLayer.bounds.height += event.delta.x;
            //     this.width += event.delta.x;
            //     this.height += event.delta.x;
            //     break;
            //   }
            // }
          } else {
            switch(this.handle) {
              case 'topLeft': {
                // paperLayer.bounds.width -= event.delta.x;
                // paperLayer.bounds.height -= event.delta.y;
                // paperLayer.position.y += event.delta.y;
                // paperLayer.position.x += event.delta.x;
                // this.width -= event.delta.x;
                // this.height -= event.delta.y;
                // this.x += event.delta.x;
                // this.y += event.delta.y;
                paperLayer.pivot = paperLayer.bounds.bottomRight;
                paperLayer.scale(this.diffX, this.diffY);
                break;
              }
              case 'topCenter': {
                // paperLayer.bounds.height -= event.delta.y;
                // paperLayer.position.y += event.delta.y;
                // this.height -= event.delta.y;
                // this.y += event.delta.y;
                paperLayer.pivot = paperLayer.bounds.bottomCenter;
                paperLayer.scale(1, this.diffY);
                if (Math.round(paperLayer.bounds.center.y) !== Math.round(this.to.center.y)) {
                  paperLayer.translate(new paper.Point(0, this.to.center.y / paperLayer.bounds.center.y));
                }
                break;
              }
              case 'topRight': {
                // paperLayer.bounds.width += event.delta.x;
                // paperLayer.bounds.height -= event.delta.y;
                // paperLayer.position.y += event.delta.y;
                // this.width += event.delta.x;
                // this.height -= event.delta.y;
                // this.y += event.delta.y;
                paperLayer.pivot = paperLayer.bounds.bottomLeft;
                paperLayer.scale(this.diffX, this.diffY);
                break;
              }
              case 'bottomLeft': {
                // paperLayer.bounds.width -= event.delta.x;
                // paperLayer.bounds.height += event.delta.y;
                // paperLayer.position.x += event.delta.x;
                // this.width -= event.delta.x;
                // this.height += event.delta.y;
                // this.x += event.delta.x;
                paperLayer.pivot = paperLayer.bounds.topRight;
                paperLayer.scale(this.diffX, this.diffY);
                break;
              }
              case 'bottomCenter': {
                paperLayer.pivot = paperLayer.bounds.topCenter;
                // paperLayer.bounds.height += event.delta.y;
                // this.height += event.delta.y;
                paperLayer.scale(1, this.diffY);
                break;
              }
              case 'bottomRight': {
                // paperLayer.bounds.width += event.delta.x;
                // paperLayer.bounds.height += event.delta.y;
                // this.width += event.delta.x;
                // this.height += event.delta.y;
                paperLayer.pivot = paperLayer.bounds.topLeft;
                paperLayer.scale(this.diffX, this.diffY);
                break;
              }
              case 'leftCenter': {
                // paperLayer.bounds.width -= event.delta.x;
                // paperLayer.position.x += event.delta.x;
                // this.width -= event.delta.x;
                // this.x += event.delta.x;
                paperLayer.pivot = paperLayer.bounds.rightCenter;
                paperLayer.scale(this.diffX, 1);
                break;
              }
              case 'rightCenter': {
                // paperLayer.bounds.width += event.delta.x;
                // this.width += event.delta.x;
                paperLayer.pivot = paperLayer.bounds.leftCenter;
                paperLayer.scale(this.diffX, 1);
                break;
              }
            }
          }
        });
        updateSelectionFrame(state.layer.present, this.handle);
        this.ref = new paperMain.Path.Rectangle({
          point: this.to.point,
          size: this.to.size,
          strokeWidth: 5,
          strokeColor: 'red'
        });
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.width || this.height) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(resizeLayersBy({layers: state.layer.present.selected, width: this.width, height: this.height, x: this.x, y: this.y}));
        }
        updateSelectionFrame(state.layer.present);
      }
    }
    if (this.ref) {
      this.ref.remove();
    }
    this.disable();
  }
}

export default ResizeTool;