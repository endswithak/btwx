import store from '../store';
import { resizeLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getSelectionBottomRight } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';

class ResizeTool {
  from: paper.Point;
  to: paper.Point;
  currentBounds: paper.Rectangle;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  enabled: boolean;
  tooltip: Tooltip;
  scaleXDelta: number;
  scaleYDelta: number;
  scaleX: number;
  scaleY: number;
  verticalFlip: boolean;
  horizontalFlip: boolean;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.from = null;
    this.to = null;
    this.currentBounds = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDelta = null;
    this.scaleYDelta = null;
    this.scaleX = null;
    this.scaleY = null;
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
      this.tooltip = null;
    }
    this.from = null;
    this.to = null;
    this.currentBounds = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDelta = null;
    this.scaleYDelta = null;
    this.scaleX = null;
    this.scaleY = null;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  flipLayers(hor = 1, ver = 1) {
    const state = store.getState();
    state.layer.present.selected.forEach((layer) => {
      const paperLayer = getPaperLayer(layer);
      paperLayer.scale(hor, ver);
    });
  }
  updateTooltip(point: paper.Point) {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.currentBounds.width)} x ${Math.round(this.currentBounds.height)}`, point, {drag: true, up: true});
  }
  scaleLayers() {
    const state = store.getState();
    if (this.shiftModifier) {
      const maxDim = Math.max(this.scaleX, this.scaleY);
      const scaleDelta = maxDim === this.scaleX ? this.scaleXDelta : this.scaleYDelta;
      state.layer.present.selected.forEach((layer: string) => {
        const paperLayer = getPaperLayer(layer);
        paperLayer.scale(scaleDelta);
      });
    } else {
      switch(this.handle) {
        case 'topLeft':
        case 'topRight':
        case 'bottomLeft':
        case 'bottomRight': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.scale(this.scaleXDelta, this.scaleYDelta);
          });
          break;
        }
        case 'topCenter':
        case 'bottomCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.scale(1, this.scaleYDelta);
          });
          break;
        }
        case 'leftCenter':
        case 'rightCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.scale(this.scaleXDelta, 1);
          });
          break;
        }
      }
    }
    updateSelectionFrame(state.layer.present, this.handle);
    this.currentBounds = getSelectionBounds(state.layer.present);
  }
  setLayersScale() {
    const state = store.getState();
    if (this.shiftModifier) {
      const maxDim = Math.max(this.scaleX, this.scaleY);
      state.layer.present.selected.forEach((layer: string) => {
        const paperLayer = getPaperLayer(layer);
        paperLayer.pivot = this.from;
        paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        paperLayer.scale(maxDim);
      });
    } else {
      switch(this.handle) {
        case 'topLeft':
        case 'topRight':
        case 'bottomLeft':
        case 'bottomRight': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.pivot = this.from;
            paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            paperLayer.scale(this.scaleX, this.scaleY);
          });
          break;
        }
        case 'topCenter':
        case 'bottomCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.pivot = this.from;
            paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            paperLayer.scale(1, this.scaleY);
          });
          break;
        }
        case 'leftCenter':
        case 'rightCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.pivot = this.from;
            paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            paperLayer.scale(this.scaleX, 1);
          });
          break;
        }
      }
    }
    updateSelectionFrame(state.layer.present, this.handle);
    this.currentBounds = getSelectionBounds(state.layer.present);
  }
  adjustHandle() {
    switch(this.handle) {
      case 'topLeft': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'topRight';
        }
        if (this.to.y > this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'bottomLeft';
        }
        break;
      }
      case 'topRight': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'topLeft';
        }
        if (this.to.y > this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'bottomRight';
        }
        break;
      }
      case 'bottomLeft': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'bottomRight';
        }
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'topLeft';
        }
        break;
      }
      case 'bottomRight': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'bottomLeft';
        }
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'topRight';
        }
        break;
      }
      case 'topCenter': {
        if (this.to.y > this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'bottomCenter';
        }
        break;
      }
      case 'bottomCenter': {
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.flipLayers(1, -1);
          this.handle = 'topCenter';
        }
        break;
      }
      case 'leftCenter': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'rightCenter';
        }
        break;
      }
      case 'rightCenter': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.flipLayers(-1, 1);
          this.handle = 'leftCenter';
        }
        break;
      }
    }
  }
  clearLayerScale() {
    const state = store.getState();
    if (state.layer.present.selected.length > 0) {
      state.layer.present.selected.forEach((layer) => {
        const paperLayer = getPaperLayer(layer);
        const layerItem = state.layer.present.byId[layer];
        paperLayer.pivot = paperLayer.bounds.center;
        paperLayer.bounds.width = layerItem.frame.width;
        paperLayer.bounds.height = layerItem.frame.height;
        paperLayer.position.x = layerItem.frame.x;
        paperLayer.position.y = layerItem.frame.y;
        paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
      });
    }
  }
  resetLayerScale() {
    this.clearLayerScale();
    this.setLayersScale();
  }
  onEscape() {
    if (this.enabled) {
      this.clearLayerScale();
      this.disable();
    }
  }
  onShiftDown() {
    if (this.enabled) {
      this.resetLayerScale();
    }
  }
  onShiftUp() {
    if (this.enabled) {
      this.resetLayerScale();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      const selectionBounds = getSelectionBounds(state.layer.present);
      switch(this.handle) {
        case 'topLeft':
          this.from = selectionBounds.bottomRight;
          break;
        case 'topCenter':
          this.from = selectionBounds.bottomCenter;
          break;
        case 'topRight':
          this.from = selectionBounds.bottomLeft;
          break;
        case 'bottomLeft':
          this.from = selectionBounds.topRight;
          break;
        case 'bottomCenter':
          this.from = selectionBounds.topCenter;
          break;
        case 'bottomRight':
          this.from = selectionBounds.topLeft;
          break;
        case 'leftCenter':
          this.from = selectionBounds.rightCenter;
          break;
        case 'rightCenter':
          this.from = selectionBounds.leftCenter;
          break;
      }
      state.layer.present.selected.forEach((layer) => {
        const paperLayer = getPaperLayer(layer);
        paperLayer.pivot = this.from;
      });
      this.fromBounds = selectionBounds;
      this.currentBounds = selectionBounds;
      this.to = event.point;
      this.toBounds = new paperMain.Rectangle({
        from: this.from,
        to: this.to
      });
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const prevToBounds = this.toBounds;
      this.to = event.point;
      this.toBounds = new paperMain.Rectangle({
        from: this.from,
        to: this.to
      });
      const widthDiff = this.toBounds.width / prevToBounds.width;
      const heightDiff = this.toBounds.height / prevToBounds.height;
      const totalWidthDiff = this.toBounds.width / this.fromBounds.width;
      const totalHeightDiff = this.toBounds.height / this.fromBounds.height;
      this.scaleXDelta = isFinite(widthDiff) && widthDiff !== 0 ? widthDiff : 1;
      this.scaleYDelta = isFinite(heightDiff) && heightDiff !== 0 ? heightDiff : 1;
      this.scaleX = isFinite(totalWidthDiff) && totalWidthDiff !== 0 ? totalWidthDiff : 1;
      this.scaleY = isFinite(totalHeightDiff) && totalHeightDiff !== 0 ? totalHeightDiff : 1;
      this.adjustHandle();
      this.scaleLayers();
      this.updateTooltip(event.point);
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.scaleX || this.scaleY) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(resizeLayers({layers: state.layer.present.selected, verticalFlip: this.verticalFlip, horizontalFlip: this.horizontalFlip}));
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            paperLayer.pivot = paperLayer.bounds.center;
          });
          updateSelectionFrame(state.layer.present);
        }
      }
    }
    this.disable();
  }
}

export default ResizeTool;