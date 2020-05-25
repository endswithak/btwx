import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { resizeLayers } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer, getSelectionBounds, getSelectionCenter } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';

class ResizeTool {
  enabled: boolean;
  tooltip: Tooltip;
  scaleXDiff: number;
  scaleYDiff: number;
  verticalFlip: boolean;
  horizontalFlip: boolean;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  enable(handle: string) {
    const state = store.getState();
    this.enabled = true;
    this.handle = handle;
    updateSelectionFrame(state.layer.present, this.handle);
  }
  disable() {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  onEscape() {
    if (this.enabled) {
      if (this.scaleXDiff || this.scaleYDiff) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            const layerItem = state.layer.present.byId[layer];
            paperLayer.bounds.width = layerItem.frame.width;
            paperLayer.bounds.height = layerItem.frame.height;
            paperLayer.position.x = layerItem.frame.x;
            paperLayer.position.y = layerItem.frame.y;
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
      if (this.scaleXDiff || this.scaleYDiff) {
        if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
          paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
        }
        if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
          paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
        }
      }
      const selectionBounds = getSelectionBounds(state.layer.present);
      const newSelectionBounds = selectionBounds.clone();
      if (state.layer.present.selected.length > 0) {
        switch(this.handle) {
          case 'topLeft': {
            if (newSelectionBounds.width - event.delta.x <= 0) {
              this.handle = 'topRight';
              newSelectionBounds.width += event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width -= event.delta.x;
            }
            if (newSelectionBounds.height - event.delta.y <= 0) {
              this.handle = 'bottomLeft';
              newSelectionBounds.height += event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height -= event.delta.y;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            break;
          }
          case 'topCenter': {
            if (newSelectionBounds.height - event.delta.y <= 0) {
              this.handle = 'bottomCenter';
              newSelectionBounds.height += event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height -= event.delta.y;
            }
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            this.scaleXDiff = 0;
            break;
          }
          case 'topRight': {
            if (newSelectionBounds.width + event.delta.x <= 0) {
              this.handle = 'topLeft';
              newSelectionBounds.width -= event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width += event.delta.x;
            }
            if (newSelectionBounds.height - event.delta.y <= 0) {
              this.handle = 'bottomRight';
              newSelectionBounds.height += event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height -= event.delta.y;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            break;
          }
          case 'bottomLeft': {
            if (newSelectionBounds.width - event.delta.x <= 0) {
              this.handle = 'bottomRight';
              newSelectionBounds.width += event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width -= event.delta.x;
            }
            if (newSelectionBounds.height + event.delta.y <= 0) {
              this.handle = 'topLeft';
              newSelectionBounds.height -= event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height += event.delta.y;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            break;
          }
          case 'bottomCenter': {
            if (newSelectionBounds.height + event.delta.y <= 0) {
              this.handle = 'topCenter';
              newSelectionBounds.height -= event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height += event.delta.y;
            }
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            this.scaleXDiff = 0;
            break;
          }
          case 'bottomRight': {
            if (newSelectionBounds.width + event.delta.x <= 0) {
              this.handle = 'bottomLeft';
              newSelectionBounds.width -= event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width += event.delta.x;
            }
            if (newSelectionBounds.height + event.delta.y <= 0) {
              this.handle = 'topRight';
              newSelectionBounds.height -= event.delta.y;
              this.verticalFlip = !this.verticalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(1, -1);
              });
            } else {
              newSelectionBounds.height += event.delta.y;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
            break;
          }
          case 'leftCenter': {
            if (newSelectionBounds.width - event.delta.x <= 0) {
              this.handle = 'rightCenter';
              newSelectionBounds.width += event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width -= event.delta.x;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = 0;
            break;
          }
          case 'rightCenter': {
            if (newSelectionBounds.width + event.delta.x <= 0) {
              this.handle = 'leftCenter';
              newSelectionBounds.width -= event.delta.x;
              this.horizontalFlip = !this.horizontalFlip;
              state.layer.present.selected.forEach((layer) => {
                const paperLayer = getPaperLayer(layer);
                paperLayer.scale(-1, 1);
              });
            } else {
              newSelectionBounds.width += event.delta.x;
            }
            this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
            this.scaleYDiff = 0;
            break;
          }
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          switch(this.handle) {
            case 'topLeft': {
              paperLayer.pivot = selectionBounds.bottomRight;
              break;
            }
            case 'topCenter': {
              paperLayer.pivot = selectionBounds.bottomCenter;
              break;
            }
            case 'topRight': {
              paperLayer.pivot = selectionBounds.bottomLeft;
              break;
            }
            case 'bottomLeft': {
              paperLayer.pivot = selectionBounds.topRight;
              break;
            }
            case 'bottomCenter': {
              paperLayer.pivot = selectionBounds.topCenter;
              break;
            }
            case 'bottomRight': {
              paperLayer.pivot = selectionBounds.topLeft;
              break;
            }
            case 'leftCenter': {
              paperLayer.pivot = selectionBounds.rightCenter;
              break;
            }
            case 'rightCenter': {
              paperLayer.pivot = selectionBounds.leftCenter;
              break;
            }
          }
          if (this.shiftModifier) {
            paperLayer.scale(this.scaleXDiff);
          } else {
            switch(this.handle) {
              case 'topLeft':
              case 'topRight':
              case 'bottomLeft':
              case 'bottomRight': {
                paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
                break;
              }
              case 'topCenter':
              case 'bottomCenter': {
                paperLayer.scale(1, this.scaleYDiff);
                break;
              }
              case 'leftCenter':
              case 'rightCenter': {
                paperLayer.scale(this.scaleXDiff, 1);
                break;
              }
            }
          }
          paperLayer.pivot = paperLayer.bounds.center;
        });
        updateSelectionFrame(state.layer.present, this.handle);
        if (this.tooltip) {
          this.tooltip.paperLayer.remove();
        }
        this.tooltip = new Tooltip(`${Math.round(selectionBounds.width)} x ${Math.round(selectionBounds.height)}`, event.point, {drag: true, up: true});
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.scaleXDiff || this.scaleYDiff) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(resizeLayers({layers: state.layer.present.selected, verticalFlip: this.verticalFlip, horizontalFlip: this.horizontalFlip}));
        }
        updateSelectionFrame(state.layer.present);
      }
    }
    this.disable();
  }
}

export default ResizeTool;