import store from '../store';
import { resizeLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getSelectionBottomRight } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';

class ResizeTool {
  ref: paper.Path.Rectangle;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  enabled: boolean;
  tooltip: Tooltip;
  scaleX: number;
  scaleY: number;
  verticalFlip: boolean;
  horizontalFlip: boolean;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.ref = null;
    this.x = 0;
    this.y = 0;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleX = 1;
    this.scaleY = 1;
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
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = null;
    this.x = 0;
    this.y = 0;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleX = 1;
    this.scaleY = 1;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  flipLayers(hor = 1, ver = 1) {
    const state = store.getState();
    state.layer.present.selected.forEach((layer) => {
      this.scaleLayer(layer, hor, ver);
    });
  }
  clearLayerScale(paperLayer: paper.Item, layerItem: em.Layer) {
    paperLayer.pivot = paperLayer.bounds.center;
    paperLayer.bounds.width = layerItem.frame.width;
    paperLayer.bounds.height = layerItem.frame.height;
    paperLayer.position.x = layerItem.frame.x;
    paperLayer.position.y = layerItem.frame.y;
    paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
  }
  scaleLayer(id: string, hor: number, ver: number) {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.type) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Group':
      case 'Shape': {
        paperLayer.scale(hor, ver);
        break;
      }
    }
  }
  setLayerPivot(id: string) {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.type) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.pivot = this.from;
        mask.pivot = this.from;
        break;
      }
      case 'Group':
      case 'Shape': {
        paperLayer.pivot = this.from;
        break;
      }
    }
  }
  updateTooltip() {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(Math.abs(this.toBounds.width))} x ${Math.round(Math.abs(this.toBounds.height))}`, this.to, {drag: true, up: true});
  }
  updateRef() {
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = new paperMain.Path.Rectangle({
      rectangle: this.toBounds,
      strokeColor: 'red',
    });
    this.ref.removeOn({
      drag: true,
      up: true
    });
  }
  scaleLayers() {
    // used when dragging
    // scales layers by current scale values
    const state = store.getState();
    if (this.shiftModifier) {
      const tb = this.toBounds;
      const maxDim = tb.width > tb.height ? this.scaleX : this.scaleY;
      state.layer.present.selected.forEach((layer: string) => {
        const paperLayer = getPaperLayer(layer);
        this.clearLayerScale(paperLayer, state.layer.present.byId[layer]);
        this.setLayerPivot(layer);
        this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        this.scaleLayer(layer, maxDim, maxDim);
      });
    } else {
      switch(this.handle) {
        case 'topLeft':
        case 'topRight':
        case 'bottomLeft':
        case 'bottomRight': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            this.clearLayerScale(paperLayer, state.layer.present.byId[layer]);
            this.setLayerPivot(layer);
            this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            this.scaleLayer(layer, this.scaleX, this.scaleY);
          });
          break;
        }
        case 'topCenter':
        case 'bottomCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            this.clearLayerScale(paperLayer, state.layer.present.byId[layer]);
            this.setLayerPivot(layer);
            this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            this.scaleLayer(layer, 1, this.scaleY);
          });
          break;
        }
        case 'leftCenter':
        case 'rightCenter': {
          state.layer.present.selected.forEach((layer: string) => {
            const paperLayer = getPaperLayer(layer);
            this.clearLayerScale(paperLayer, state.layer.present.byId[layer]);
            this.setLayerPivot(layer);
            this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
            this.scaleLayer(layer, this.scaleX, 1);
          });
          break;
        }
      }
    }
    updateSelectionFrame(state.layer.present, this.handle);
    this.updateTooltip();
  }
  updateToBounds() {
    if (this.shiftModifier) {
      const aspect = this.fromBounds.width / this.fromBounds.height;
      const fb = this.fromBounds;
      switch(this.handle) {
        case 'topLeft':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: fb.width > fb.height ? (this.horizontalFlip ? this.fromBounds.bottom : this.fromBounds.top) + ((this.to.x - (this.verticalFlip ? this.fromBounds.right : this.fromBounds.left)) / aspect) : this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: fb.width > fb.height ? this.to.x : (this.verticalFlip ? this.fromBounds.right : this.fromBounds.left) + ((this.to.y - (this.horizontalFlip ? this.fromBounds.bottom : this.fromBounds.top)) * aspect),
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right,
          });
          break;
        case 'topRight':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: fb.width > fb.height ? (this.horizontalFlip ? this.fromBounds.bottom : this.fromBounds.top) - ((this.to.x - (this.verticalFlip ? this.fromBounds.left : this.fromBounds.right)) / aspect) : this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: fb.width > fb.height ? this.to.x : (this.verticalFlip ? this.fromBounds.left : this.fromBounds.right) - ((this.to.y - (this.horizontalFlip ? this.fromBounds.bottom : this.fromBounds.top)) * aspect),
          });
          break;
        case 'bottomLeft':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: fb.width > fb.height ? (this.horizontalFlip ? this.fromBounds.top : this.fromBounds.bottom) - ((this.to.x - (this.verticalFlip ? this.fromBounds.right : this.fromBounds.left)) / aspect) : this.to.y,
            left: fb.width > fb.height ? this.to.x : (this.verticalFlip ? this.fromBounds.right : this.fromBounds.left) - ((this.to.y - (this.horizontalFlip ? this.fromBounds.top : this.fromBounds.bottom)) * aspect),
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right
          });
          break;
        case 'bottomRight':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: fb.width > fb.height ? (this.horizontalFlip ? this.fromBounds.top : this.fromBounds.bottom) + ((this.to.x - (this.verticalFlip ? this.fromBounds.left : this.fromBounds.right)) / aspect) : this.to.y,
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: fb.width > fb.height ? this.to.x : (this.verticalFlip ? this.fromBounds.left : this.fromBounds.right) + ((this.to.y - (this.horizontalFlip ? this.fromBounds.top : this.fromBounds.bottom)) * aspect),
          });
          break;
        case 'topCenter': {
          const distance = this.to.y - (this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top);
          const xDelta = distance * aspect;
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: this.verticalFlip ? this.fromBounds.left - (xDelta / 2) : this.fromBounds.left + (xDelta / 2),
            right: this.verticalFlip ? this.fromBounds.right + (xDelta / 2) : this.fromBounds.right - (xDelta / 2)
          });
          break;
        }
        case 'bottomCenter': {
          const distance = this.to.y - (this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom);
          const xDelta = distance * aspect;
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: this.to.y,
            left: this.verticalFlip ? this.fromBounds.left + (xDelta / 2) : this.fromBounds.left - (xDelta / 2),
            right: this.verticalFlip ? this.fromBounds.right - (xDelta / 2) : this.fromBounds.right + (xDelta / 2)
          });
          break;
        }
        case 'leftCenter': {
          const distance = this.to.x - (this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left);
          const yDelta = distance / aspect;
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.horizontalFlip ? this.fromBounds.top - (yDelta / 2) : this.fromBounds.top + (yDelta / 2),
            bottom: this.horizontalFlip ? this.fromBounds.bottom + (yDelta / 2) : this.fromBounds.bottom - (yDelta / 2),
            left: this.to.x,
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right
          });
          break;
        }
        case 'rightCenter': {
          const distance = this.to.x - (this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right);
          const yDelta = distance / aspect;
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.horizontalFlip ? this.fromBounds.top + (yDelta / 2) : this.fromBounds.top - (yDelta / 2),
            bottom: this.horizontalFlip ? this.fromBounds.bottom - (yDelta / 2) : this.fromBounds.bottom + (yDelta / 2),
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: this.to.x
          });
          break;
        }
      }
    } else {
      switch(this.handle) {
        case 'topLeft':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: this.to.x,
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right
          });
          break;
        case 'topRight':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: this.to.x
          });
          break;
        case 'bottomLeft':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: this.to.y,
            left: this.to.x,
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right
          });
          break;
        case 'bottomRight':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: this.to.y,
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: this.to.x
          });
          break;
        case 'topCenter':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.to.y,
            bottom: this.verticalFlip ? this.fromBounds.top : this.fromBounds.bottom,
            left: this.fromBounds.left,
            right: this.fromBounds.right
          });
          break;
        case 'bottomCenter':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.verticalFlip ? this.fromBounds.bottom : this.fromBounds.top,
            bottom: this.to.y,
            left: this.fromBounds.left,
            right: this.fromBounds.right
          });
          break;
        case 'leftCenter':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.fromBounds.top,
            bottom: this.fromBounds.bottom,
            left: this.to.x,
            right: this.horizontalFlip ? this.fromBounds.left : this.fromBounds.right
          });
          break;
        case 'rightCenter':
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.fromBounds.top,
            bottom: this.fromBounds.bottom,
            left: this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left,
            right: this.to.x
          });
          break;
      }
    }
    const totalWidthDiff = this.toBounds.width / this.fromBounds.width;
    const totalHeightDiff = this.toBounds.height / this.fromBounds.height;
    this.scaleX = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
    this.scaleY = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
  }
  adjustHandle() {
    // updates handle, horizontalFlip, and verticalFlip based on to and from points
    switch(this.handle) {
      case 'topLeft': {
        if (this.to.x > this.from.x && this.to.y > this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomRight';
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topRight';
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomLeft';
          }
        }
        break;
      }
      case 'topRight': {
        if (this.to.x < this.from.x && this.to.y > this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomLeft';
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topLeft';
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomRight';
          }
        }
        break;
      }
      case 'bottomLeft': {
        if (this.to.x > this.from.x && this.to.y < this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topRight';
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomRight';
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topLeft';
          }
        }
        break;
      }
      case 'bottomRight': {
        if (this.to.x < this.from.x && this.to.y < this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topLeft';
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomLeft';
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topRight';
          }
        }
        break;
      }
      case 'topCenter': {
        if (this.to.y > this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomCenter';
        }
        break;
      }
      case 'bottomCenter': {
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topCenter';
        }
        break;
      }
      case 'leftCenter': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'rightCenter';
        }
        break;
      }
      case 'rightCenter': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'leftCenter';
        }
        break;
      }
    }
  }
  clearLayersScale() {
    // clears current scaling from layers
    const state = store.getState();
    if (state.layer.present.selected.length > 0) {
      state.layer.present.selected.forEach((layer) => {
        const paperLayer = getPaperLayer(layer);
        if (paperLayer.data.type !== 'Text') {
          const layerItem = state.layer.present.byId[layer];
          paperLayer.pivot = paperLayer.bounds.center;
          paperLayer.bounds.width = layerItem.frame.width;
          paperLayer.bounds.height = layerItem.frame.height;
          paperLayer.position.x = layerItem.frame.x;
          paperLayer.position.y = layerItem.frame.y;
          paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        }
      });
    }
  }
  onEscape() {
    if (this.enabled) {
      this.clearLayersScale();
      this.disable();
    }
  }
  onShiftDown() {
    if (this.enabled && this.to) {
      this.updateToBounds();
      //this.updateRef();
      this.scaleLayers();
    }
  }
  onShiftUp() {
    if (this.enabled && this.to) {
      this.updateToBounds();
      //this.updateRef();
      this.scaleLayers();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      const selectionBounds = getSelectionBounds(state.layer.present);
      // set from point to handle pivot point
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
      // set selected layer pivots
      state.layer.present.selected.forEach((layer) => {
        this.setLayerPivot(layer);
      });
      // set from bounds
      this.fromBounds = selectionBounds;
      this.to = event.point;
      // set to bounds with from and event point points
      this.updateToBounds();
      //this.updateRef();
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.to = event.point;
      this.adjustHandle();
      this.updateToBounds();
      //this.updateRef();
      this.scaleLayers();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.scaleX || this.scaleY) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          const resizedLayers = state.layer.present.selected.filter((id) => state.layer.present.byId[id].type !== 'Text');
          if (resizedLayers.length > 0) {
            // set selected layers back to the default pivot point
            // needs to be before resize dispatch to correctly set layer position
            resizedLayers.forEach((layer) => {
              const paperLayer = getPaperLayer(layer);
              paperLayer.pivot = paperLayer.bounds.center;
            });
            // dispatch resize layers
            store.dispatch(resizeLayers({layers: resizedLayers, verticalFlip: this.verticalFlip, horizontalFlip: this.horizontalFlip}));
            // update selection frame
            updateSelectionFrame(state.layer.present);
          }
        }
      }
    }
    this.disable();
  }
}

export default ResizeTool;