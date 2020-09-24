import store from '../store';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { setSelectionToolResizeType } from '../store/actions/selectionTool';
import { scaleLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants } from '../store/selectors/layer';
import { updateSelectionFrame, updateMeasureFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class ResizeTool {
  state: RootState;
  ref: paper.Path.Rectangle;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  enabled: boolean;
  tooltip: Tooltip;
  scale: {
    x: number;
    y: number;
  };
  verticalFlip: boolean;
  horizontalFlip: boolean;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  snapTool: SnapTool;
  preserveAspectRatio: boolean;
  constructor() {
    this.state = null;
    this.ref = null;
    this.x = 0;
    this.y = 0;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scale = {
      x: 1,
      y: 1
    };
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
    this.snapTool = null;
    this.preserveAspectRatio = false;
  }
  enable(state: RootState, handle: string): void {
    const resizeType = (() => {
      switch(handle) {
        case 'topLeft':
        case 'bottomRight':
          return 'nwse';
        case 'topRight':
        case 'bottomLeft':
          return 'nesw';
        case 'topCenter':
        case 'bottomCenter':
          return 'ns';
        case 'leftCenter':
        case 'rightCenter':
          return 'ew';
      }
    })() as em.ResizeType;
    store.dispatch(setCanvasResizing({resizing: true}));
    store.dispatch(setSelectionToolResizeType({resizeType}));
    this.enabled = true;
    this.handle = handle;
    this.snapTool = new SnapTool();
    this.state = state;
    if (
      (
        state.layer.present.selected.length > 1 &&
        (
          state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Group') ||
          state.layer.present.selected.some((id) => state.layer.present.byId[id].transform.rotation !== 0)
        )
      ) ||
      state.layer.present.selected.length === 1 && (
        state.layer.present.byId[state.layer.present.selected[0]].type === 'Group' ||
        state.layer.present.byId[state.layer.present.selected[0]].transform.rotation !== 0
      )
    ) {
      this.preserveAspectRatio = true;
    }
    updateSelectionFrame(state.layer.present, this.handle);
  }
  disable(): void {
    store.dispatch(setCanvasResizing({resizing: false}));
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
      this.tooltip = null;
    }
    if (this.ref) {
      this.ref.remove();
    }
    this.state = null;
    this.ref = null;
    this.x = 0;
    this.y = 0;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scale = {
      x: 1,
      y: 1
    };
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.snapTool = null;
    this.preserveAspectRatio = false;
  }
  getMeasureGuides(): { top?: string; bottom?: string; left?: string; right?: string; all?: string } {
    const measureGuides: { top?: string; bottom?: string; left?: string; right?: string; all?: string } = {};
    if (this.snapTool.snap.x) {
      if (!this.toBounds.intersects(getPaperLayer(this.snapTool.snap.x.id).bounds, 1)) {
        measureGuides['top'] = this.snapTool.snap.x.id;
        measureGuides['bottom'] = this.snapTool.snap.x.id;
      }
    }
    if (this.snapTool.snap.y) {
      if (!this.toBounds.intersects(getPaperLayer(this.snapTool.snap.y.id).bounds, 1)) {
        measureGuides['left'] = this.snapTool.snap.y.id;
        measureGuides['right'] = this.snapTool.snap.y.id;
      }
    }
    return measureGuides;
  }
  flipLayers(state: RootState, hor = 1, ver = 1): void {
    this.state.layer.present.selected.forEach((layer) => {
      this.scaleLayer(layer, hor, ver);
    });
  }
  clearLayerScale(paperLayer: paper.Item, layerItem: em.Layer): void {
    switch(paperLayer.data.layerType) {
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
  scaleLayer(id: string, hor: number, ver: number): void {
    const paperLayer = getPaperLayer(id);
    const layerItem = this.state.layer.present.byId[id];
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Shape': {
        switch((layerItem as em.Shape).shapeType) {
          case 'Ellipse':
          case 'Polygon':
          case 'Rectangle':
          case 'Star':
          case 'Line':
          case 'Custom':
            paperLayer.scale(hor, ver);
            break;
          case 'Rounded': {
            paperLayer.scale(hor, ver);
            if (!this.preserveAspectRatio) {
              const newShape = new paperMain.Path.Rectangle({
                from: paperLayer.bounds.topLeft,
                to: paperLayer.bounds.bottomRight,
                radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (layerItem as em.Rounded).radius,
                insert: false
              });
              (paperLayer as paper.Path).pathData = newShape.pathData;
            }
            break;
          }
        }
        break;
      }
      case 'Group':
      case 'Image': {
        paperLayer.scale(hor, ver);
        break;
      }
    }
  }
  setLayerPivot(id: string): void {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.layerType) {
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
  updateTooltip(): void {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.toBounds.width)} x ${Math.round(this.toBounds.height)}`, this.to, {up: true});
  }
  updateRef(): void {
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
  scaleLayers(): void {
    // used when dragging
    // scales layers by current scale values
    switch(this.handle) {
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight': {
        const fb = this.fromBounds;
        const maxDim = fb.width > fb.height ? this.scale.x : this.scale.y;
        this.state.layer.present.selected.forEach((layer: string) => {
          const paperLayer = getPaperLayer(layer);
          this.clearLayerScale(paperLayer, this.state.layer.present.byId[layer]);
          this.setLayerPivot(layer);
          this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
          if (this.shiftModifier || this.preserveAspectRatio) {
            this.scaleLayer(layer, maxDim, maxDim);
          } else {
            this.scaleLayer(layer, this.scale.x, this.scale.y);
          }
        });
        break;
      }
      case 'topCenter':
      case 'bottomCenter': {
        this.state.layer.present.selected.forEach((layer: string) => {
          const paperLayer = getPaperLayer(layer);
          this.clearLayerScale(paperLayer, this.state.layer.present.byId[layer]);
          this.setLayerPivot(layer);
          this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
          this.scaleLayer(layer, this.shiftModifier || this.preserveAspectRatio ? this.scale.y : 1, this.scale.y);
        });
        break;
      }
      case 'leftCenter':
      case 'rightCenter': {
        this.state.layer.present.selected.forEach((layer: string) => {
          const paperLayer = getPaperLayer(layer);
          this.clearLayerScale(paperLayer, this.state.layer.present.byId[layer]);
          this.setLayerPivot(layer);
          this.scaleLayer(layer, this.horizontalFlip ? -1 : 1, this.verticalFlip ? -1 : 1);
          this.scaleLayer(layer, this.scale.x, this.shiftModifier || this.preserveAspectRatio ? this.scale.x : 1);
        });
        break;
      }
    }
    updateSelectionFrame(this.state.layer.present, this.handle);
    this.updateTooltip();
    this.snapTool.updateGuides();
    updateMeasureFrame(this.state.layer.present, this.getMeasureGuides());
  }
  updateToBounds(overrides?: any): void {
    if (this.shiftModifier || this.preserveAspectRatio) {
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
    this.scale.x = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
    this.scale.y = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
    this.snapTool.snapBounds = this.toBounds;
  }
  adjustHandle(): void {
    // updates handle, horizontalFlip, and verticalFlip based on to and from points
    switch(this.handle) {
      case 'topLeft': {
        if (this.to.x > this.from.x && this.to.y > this.from.y) {
          this.horizontalFlip = !this.horizontalFlip;
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'bottomRight';
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topRight';
            this.state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomLeft';
            this.state.layer.present.selected.forEach((layer: string) => {
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
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'topLeft';
            this.state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y > this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'bottomRight';
            this.state.layer.present.selected.forEach((layer: string) => {
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
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x > this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomRight';
            this.state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topLeft';
            this.state.layer.present.selected.forEach((layer: string) => {
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
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, -1);
          });
        } else {
          if (this.to.x < this.from.x) {
            this.horizontalFlip = !this.horizontalFlip;
            this.handle = 'bottomLeft';
            this.state.layer.present.selected.forEach((layer: string) => {
              this.scaleLayer(layer, -1, 1);
            });
          }
          if (this.to.y < this.from.y) {
            this.verticalFlip = !this.verticalFlip;
            this.handle = 'topRight';
            this.state.layer.present.selected.forEach((layer: string) => {
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
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, 1, -1);
          });
        }
        break;
      }
      case 'bottomCenter': {
        if (this.to.y < this.from.y) {
          this.verticalFlip = !this.verticalFlip;
          this.handle = 'topCenter';
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, 1, -1);
          });
        }
        break;
      }
      case 'leftCenter': {
        if (this.to.x > this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'rightCenter';
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, 1);
          });
        }
        break;
      }
      case 'rightCenter': {
        if (this.to.x < this.from.x) {
          this.horizontalFlip = !this.horizontalFlip;
          this.handle = 'leftCenter';
          this.state.layer.present.selected.forEach((layer: string) => {
            this.scaleLayer(layer, -1, 1);
          });
        }
        break;
      }
    }
  }
  clearLayersScale(): void {
    // clears current scaling from layers
    if (this.state.layer.present.selected.length > 0) {
      this.state.layer.present.selected.forEach((layer) => {
        const paperLayer = getPaperLayer(layer);
        if (paperLayer.data.layerType !== 'Text') {
          const layerItem = this.state.layer.present.byId[layer];
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
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.enabled && this.to) {
          this.updateToBounds();
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
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.enabled && this.to) {
          this.updateToBounds();
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
      const selectionBounds = getSelectionBounds(this.state.layer.present);
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
      this.state.layer.present.selected.forEach((layer) => {
        this.setLayerPivot(layer);
      });
      // set from bounds
      this.fromBounds = selectionBounds;
      this.to = event.point;
      // set to bounds with from and event point points
      this.updateToBounds();
      //this.updateRef();
      let allSelectedLayers: string[] = [];
      this.state.layer.present.selected.forEach((id) => {
        const layerAndDescendants = getLayerAndDescendants(this.state.layer.present, id);
        allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
      });
      this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
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
      this.snapTool.snapBounds = this.toBounds;
      this.snapTool.updateXSnap({
        event: event,
        snapTo: {
          left: this.handle === 'topLeft' || this.handle === 'bottomLeft' || this.handle === 'leftCenter',
          right: this.handle === 'topRight' || this.handle === 'bottomRight' || this.handle === 'rightCenter',
          center: false
        },
        handleSnap: (closestXSnap) => {
          switch(closestXSnap.bounds.side) {
            case 'left':
              snapBounds.left = closestXSnap.snapPoint.point;
              break;
            case 'right':
              snapBounds.right = closestXSnap.snapPoint.point;
              break;
          }
        },
        handleSnapped: (snapPoint) => {
          switch(this.handle) {
            case 'topLeft':
            case 'bottomLeft':
            case 'leftCenter':
              snapBounds.left = snapPoint.point;
              break;
            case 'topRight':
            case 'bottomRight':
            case 'rightCenter':
              snapBounds.right = snapPoint.point;
              break;
          }
        }
      });
      this.snapTool.updateYSnap({
        event: event,
        snapTo: {
          top: this.handle === 'topLeft' || this.handle === 'topCenter' || this.handle === 'topRight',
          bottom: this.handle === 'bottomLeft' || this.handle === 'bottomCenter' || this.handle === 'bottomRight',
          center: false
        },
        handleSnap: (closestYSnap) => {
          switch(closestYSnap.bounds.side) {
            case 'top':
              snapBounds.top = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.bottom = closestYSnap.snapPoint.point;
              break;
          }
        },
        handleSnapped: (snapPoint) => {
          switch(this.handle) {
            case 'topCenter':
            case 'topLeft':
            case 'topRight':
              snapBounds.top = snapPoint.point;
              break;
            case 'bottomCenter':
            case 'bottomLeft':
            case 'bottomRight':
              snapBounds.bottom = snapPoint.point;
              break;
          }
        }
      });
      this.updateToBounds(snapBounds);
      this.scaleLayers();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.scale.x || this.scale.y) {
        if (this.state.layer.present.selected.length > 0) {
          const scaledLayers = this.state.layer.present.selected.filter((id) => this.state.layer.present.byId[id].type !== 'Text');
          if (scaledLayers.length > 0) {
            // set selected layers back to the default pivot point
            // needs to be before resize dispatch to correctly set layer position
            scaledLayers.forEach((id) => {
              const paperLayer = getPaperLayer(id);
              // const layerItem = this.state.layer.present.byId[id];
              // if (layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Rounded') {
              //   applyShapeMethods(paperLayer);
              // }
              paperLayer.pivot = null;
            });
            // dispatch resize layers
            store.dispatch(scaleLayers({layers: scaledLayers, scale: this.scale, verticalFlip: this.verticalFlip, horizontalFlip: this.horizontalFlip}));
            // update selection frame
            updateSelectionFrame(this.state.layer.present);
          }
        }
      }
      this.disable();
    }
  }
}

export default ResizeTool;