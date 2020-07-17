import paper from 'paper';
import store from '../store';
import { resizeLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getSelectionBottomRight, getLayerAndDescendants } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';
import SnapTool from './snapTool';

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
  altModifier: boolean;
  snapTool: SnapTool;
  snap: {
    x: em.SnapPoint;
    y: em.SnapPoint;
  };
  snapPoints: em.SnapPoint[];
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
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
    this.altModifier = false;
    this.snapBreakThreshholdMin = -8;
    this.snapBreakThreshholdMax = 8;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.snapTool = null;
  }
  enable(handle: string) {
    const state = store.getState();
    this.enabled = true;
    this.handle = handle;
    this.snapTool = new SnapTool();
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
    this.snapBreakThreshholdMin = -8;
    this.snapBreakThreshholdMax = 8;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.snapTool = null;
  }
  flipLayers(hor = 1, ver = 1) {
    const state = store.getState();
    state.layer.present.selected.forEach((layer) => {
      this.scaleLayer(layer, hor, ver);
    });
  }
  clearLayerScale(paperLayer: paper.Item, layerItem: em.Layer) {
    switch(paperLayer.data.type) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.pivot = paperLayer.bounds.center;
        background.bounds.width = layerItem.frame.width;
        background.bounds.height = layerItem.frame.height;
        background.position.x = layerItem.frame.x;
        background.position.y = layerItem.frame.y;
        background.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        mask.pivot = paperLayer.bounds.center;
        mask.bounds.width = layerItem.frame.width;
        mask.bounds.height = layerItem.frame.height;
        mask.position.x = layerItem.frame.x;
        mask.position.y = layerItem.frame.y;
        mask.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        break;
      }
      case 'Group':
      case 'Shape':
      case 'Image': {
        paperLayer.pivot = paperLayer.bounds.center;
        paperLayer.bounds.width = layerItem.frame.width;
        paperLayer.bounds.height = layerItem.frame.height;
        paperLayer.position.x = layerItem.frame.x;
        paperLayer.position.y = layerItem.frame.y;
        paperLayer.scale(this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
        break;
      }
    }
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
      case 'Shape':
      case 'Image': {
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
      case 'Shape':
      case 'Image': {
        paperLayer.pivot = this.from;
        break;
      }
    }
  }
  updateTooltip() {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.toBounds.width)} x ${Math.round(this.toBounds.height)}`, this.to, {drag: true, up: true});
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
    this.updateTooltip();
  }
  scaleLayers() {
    // used when dragging
    // scales layers by current scale values
    const state = store.getState();
    switch(this.handle) {
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight': {
        const fb = this.fromBounds;
        const maxDim = fb.width > fb.height ? this.scaleX : this.scaleY;
        state.layer.present.selected.forEach((layer: string) => {
          const paperLayer = getPaperLayer(layer);
          this.clearLayerScale(paperLayer, state.layer.present.byId[layer]);
          this.setLayerPivot(layer);
          this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
          if (this.shiftModifier) {
            this.scaleLayer(layer, maxDim, maxDim);
          } else {
            this.scaleLayer(layer, this.scaleX, this.scaleY);
          }
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
          this.scaleLayer(layer, this.shiftModifier ? this.scaleY : 1, this.scaleY);
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
          this.scaleLayer(layer, this.scaleX, this.shiftModifier ? this.scaleX : 1);
        });
        break;
      }
    }
    updateSelectionFrame(state.layer.present, this.handle);
    this.updateTooltip();
    this.snapTool.updateGuides({
      snapPoints: this.snapPoints,
      bounds: this.toBounds,
      xSnap: this.snap.x,
      ySnap: this.snap.y
    });
  }
  updateToBounds(overrides?: any) {
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
            left: this.verticalFlip ? this.fromBounds.right + (xDelta / 2) : this.fromBounds.left + (xDelta / 2),
            right: this.verticalFlip ? this.fromBounds.left - (xDelta / 2) : this.fromBounds.right - (xDelta / 2)
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
            left: this.verticalFlip ? this.fromBounds.right - (xDelta / 2) : this.fromBounds.left - (xDelta / 2),
            right: this.verticalFlip ? this.fromBounds.left + (xDelta / 2) : this.fromBounds.right + (xDelta / 2)
          });
          break;
        }
        case 'leftCenter': {
          const distance = this.to.x - (this.horizontalFlip ? this.fromBounds.right : this.fromBounds.left);
          const yDelta = distance / aspect;
          this.toBounds = new paperMain.Rectangle({
            rectangle: this.fromBounds,
            top: this.horizontalFlip ? this.fromBounds.bottom + (yDelta / 2) : this.fromBounds.top + (yDelta / 2),
            bottom: this.horizontalFlip ? this.fromBounds.top - (yDelta / 2) : this.fromBounds.bottom - (yDelta / 2),
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
            top: this.horizontalFlip ? this.fromBounds.bottom - (yDelta / 2) : this.fromBounds.top - (yDelta / 2),
            bottom: this.horizontalFlip ? this.fromBounds.top + (yDelta / 2) : this.fromBounds.bottom + (yDelta / 2),
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
    if (overrides) {
      this.toBounds = new paperMain.Rectangle({
        rectangle: this.fromBounds,
        top: this.toBounds.top,
        bottom: this.toBounds.bottom,
        left: this.toBounds.left,
        right: this.toBounds.right,
        ...overrides
      });
    }
    const totalWidthDiff = this.toBounds.width / this.fromBounds.width;
    const totalHeightDiff = this.toBounds.height / this.fromBounds.height;
    this.scaleX = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
    this.scaleY = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
  }
  adjustHandle() {
    // updates handle, horizontalFlip, and verticalFlip based on to and from points
    const state = store.getState();
    switch(this.handle) {
      case 'topLeft': {
        if (this.to.x > this.from.x && this.to.y > this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomRight';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topRight';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomLeft';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, 1, -1);
            });
          }
        }
        break;
      }
      case 'topRight': {
        if (this.to.x < this.from.x && this.to.y > this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomLeft';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topLeft';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomRight';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, 1, -1);
            });
          }
        }
        break;
      }
      case 'bottomLeft': {
        if (this.to.x > this.from.x && this.to.y < this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topRight';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomRight';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topLeft';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, 1, -1);
            });
          }
        }
        break;
      }
      case 'bottomRight': {
        if (this.to.x < this.from.x && this.to.y < this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topLeft';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomLeft';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topRight';
            state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, 1, -1);
            });
          }
        }
        break;
      }
      case 'topCenter': {
        if (this.to.y > this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomCenter';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, 1, -1);
          });
        }
        break;
      }
      case 'bottomCenter': {
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topCenter';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, 1, -1);
          });
        }
        break;
      }
      case 'leftCenter': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'rightCenter';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, 1);
          });
        }
        break;
      }
      case 'rightCenter': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'leftCenter';
          state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, 1);
          });
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
  onKeyDown(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.enabled && this.to) {
          this.updateToBounds();
          //this.updateRef();
          this.scaleLayers();
        }
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'alt': {
        this.altModifier = true;
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.enabled && this.to) {
          this.updateToBounds();
          //this.updateRef();
          this.scaleLayers();
        }
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        break;
      }
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
      let allSelectedLayers: string[] = [];
      state.layer.present.selected.forEach((id) => {
        const layerAndDescendants = getLayerAndDescendants(state.layer.present, id);
        allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
      });
      this.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.to = event.point;
      this.adjustHandle();
      this.updateToBounds();
      const snapBounds = {
        top: this.toBounds.top,
        bottom: this.toBounds.bottom,
        left: this.toBounds.left,
        right: this.toBounds.right,
      };
      if (this.snap.x) {
        // check if event delta will exceed X snap point min/max threshold
        if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
          // if exceeded, adjust selection bounds...
          // clear X snap, and reset X snap threshold
          this.snap.x = null;
        } else {
          switch(this.handle) {
            case 'topLeft':
            case 'bottomLeft':
            case 'leftCenter':
              snapBounds.left = this.snap.x.point;
              break;
            case 'topRight':
            case 'bottomRight':
            case 'rightCenter':
              snapBounds.right = this.snap.x.point;
              break;
          }
          // if not exceeded, update X snap threshold
          this.snap.x.breakThreshold += event.delta.x;
        }
      } else {
        const closestXSnap = this.snapTool.closestXSnapPoint({
          snapPoints: this.snapPoints,
          bounds: this.toBounds,
          snapTo: {
            left: this.handle === 'topLeft' || this.handle === 'bottomLeft' || this.handle === 'leftCenter',
            right: this.handle === 'topRight' || this.handle === 'bottomRight' || this.handle === 'rightCenter',
            center: false
          }
        });
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
          switch(closestXSnap.bounds.side) {
            case 'left':
              snapBounds.left = closestXSnap.snapPoint.point;
              break;
            case 'right':
              snapBounds.right = closestXSnap.snapPoint.point;
              break;
          }
          this.snap.x = {
            ...closestXSnap.snapPoint,
            breakThreshold: 0
          };
        }
      }
      if (this.snap.y) {
        // check if event delta will exceed Y snap point min/max threshold
        if (this.snap.y.breakThreshold + event.delta.y < this.snapBreakThreshholdMin || this.snap.y.breakThreshold + event.delta.y > this.snapBreakThreshholdMax) {
          // if exceeded, adjust selection bounds...
          // clear Y snap, and reset Y snap threshold
          this.snap.y = null;
        } else {
          switch(this.handle) {
            case 'topCenter':
            case 'topLeft':
            case 'topRight':
              snapBounds.top = this.snap.y.point;
              break;
            case 'bottomCenter':
            case 'bottomLeft':
            case 'bottomRight':
              snapBounds.bottom = this.snap.y.point;
              break;
          }
          // if not exceeded, update Y snap threshold
          this.snap.y.breakThreshold += event.delta.y;
        }
      } else {
        const closestYSnap = this.snapTool.closestYSnapPoint({
          snapPoints: this.snapPoints,
          bounds: this.toBounds,
          snapTo: {
            top: this.handle === 'topLeft' || this.handle === 'topCenter' || this.handle === 'topRight',
            bottom: this.handle === 'bottomLeft' || this.handle === 'bottomCenter' || this.handle === 'bottomRight',
            center: false
          }
        });
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestYSnap.distance <= (1 / paperMain.view.zoom) * 2) {
          switch(closestYSnap.bounds.side) {
            case 'top':
              snapBounds.top = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.bottom = closestYSnap.snapPoint.point;
              break;
          }
          this.snap.y = {
            ...closestYSnap.snapPoint,
            breakThreshold: 0
          };
        }
      }
      this.updateToBounds(snapBounds);
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