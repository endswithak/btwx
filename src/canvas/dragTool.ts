import store from '../store';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants, getInViewSnapPoints } from '../store/selectors/layer';
import { updateSelectionFrame, updateActiveArtboardFrame } from '../store/utils/layer';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR, THEME_GUIDE_COLOR } from '../constants';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class DragTool {
  state: RootState;
  originalSelection: string[];
  duplicateSelection: string[];
  enabled: boolean;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  snap: {
    x: em.SnapPoint;
    y: em.SnapPoint;
  };
  snapTool: SnapTool;
  snapPoints: em.SnapPoint[];
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  ref: paper.Path.Rectangle;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  centerOffset: paper.Point;
  moveHandle: boolean;
  constructor() {
    this.state = null;
    this.moveHandle = false;
    this.originalSelection = null;
    this.duplicateSelection = null;
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
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
    this.ref = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.snapTool = null;
  }
  enable(moveHandle = false) {
    this.state = store.getState();
    store.dispatch(setCanvasDragging({dragging: true}));
    this.enabled = true;
    this.snapTool = new SnapTool();
    this.moveHandle = moveHandle;
  }
  disable() {
    store.dispatch(setCanvasDragging({dragging: false}));
    this.state = null;
    this.moveHandle = false;
    this.originalSelection = null;
    this.duplicateSelection = null;
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.ref = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.snapTool = null;
  }
  updateRef() {
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = new paperMain.Path.Rectangle({
      rectangle: this.toBounds,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom
    });
    this.ref.removeOn({
      drag: true,
      up: true
    });
  }
  updateSnapPoints() {
    let allSelectedLayers: string[] = [];
    this.state.layer.present.selected.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(this.state.layer.present, id);
      allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
    });
    this.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
  }
  duplicate() {
    store.dispatch(duplicateLayers({layers: this.originalSelection}));
    this.state = store.getState();
    this.duplicateSelection = this.state.layer.present.selected;
    this.updateSnapPoints();
    this.originalSelection.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const layerItem = this.state.layer.present.byId[id];
      paperLayer.position.x = layerItem.frame.x;
      paperLayer.position.y = layerItem.frame.y;
    });
  }
  clearDuplicate() {
    store.dispatch(removeDuplicatedLayers({layers: this.duplicateSelection, newSelection: this.originalSelection}));
    this.state = store.getState();
    this.duplicateSelection = null;
    this.updateSnapPoints();
  }
  translateLayers() {
    if (this.altModifier && !this.duplicateSelection) {
      this.duplicate();
    }
    const translate = {
      x: this.toBounds.center.x - this.fromBounds.center.x,
      y: this.toBounds.center.y - this.fromBounds.center.y
    };
    const selection = this.altModifier ? this.duplicateSelection : this.originalSelection;
    selection.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const layerItem = this.state.layer.present.byId[id];
      paperLayer.position.x = layerItem.frame.x + translate.x;
      paperLayer.position.y = layerItem.frame.y + translate.y;
    });
    updateSelectionFrame(this.state.layer.present, this.moveHandle ? 'move' : 'none');
    updateActiveArtboardFrame(this.state.layer.present);
    this.snapTool.updateGuides({
      snapPoints: this.snapPoints,
      bounds: this.toBounds,
      xSnap: this.snap.x,
      ySnap: this.snap.y
    });
  }
  onKeyDown(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'alt': {
        this.altModifier = true;
        if ((this.x || this.y) && !this.duplicateSelection) {
          this.duplicate();
          this.translateLayers();
          this.snapTool.updateGuides({
            snapPoints: this.snapPoints,
            bounds: this.toBounds,
            xSnap: this.snap.x,
            ySnap: this.snap.y
          });
        }
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        if ((this.x || this.y) && this.duplicateSelection) {
          this.clearDuplicate();
          this.translateLayers();
          this.snapTool.updateGuides({
            snapPoints: this.snapPoints,
            bounds: this.toBounds,
            xSnap: this.snap.x,
            ySnap: this.snap.y
          });
        }
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      // get selection bounds
      const selectionBounds = getSelectionBounds(this.state.layer.present);
      this.originalSelection = this.state.layer.present.selected;
      this.fromBounds = selectionBounds;
      this.from = event.point;
      this.to = event.point;
      this.toBounds = new paperMain.Rectangle(this.fromBounds);
      this.updateSnapPoints();
      updateSelectionFrame(this.state.layer.present, this.moveHandle ? 'move' : 'none');
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.to = event.point;
      this.toBounds.center.x = this.fromBounds.center.x + this.x;
      this.toBounds.center.y = this.fromBounds.center.y + this.y;
      const snapBounds = this.toBounds.clone();
      if (this.snap.x) {
        // check if event delta will exceed X snap point min/max threshold
        if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
          // if exceeded, adjust selection bounds...
          // clear X snap, and reset X snap threshold
          this.snap.x = null;
        } else {
          switch(this.snap.x.boundsSide) {
            case 'left':
              snapBounds.center.x = this.snap.x.point + (this.fromBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = this.snap.x.point;
              break;
            case 'right':
              snapBounds.center.x = this.snap.x.point - (this.fromBounds.width / 2);
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
            left: true,
            right: true,
            center: true
          }
        });
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
          switch(closestXSnap.bounds.side) {
            case 'left':
              snapBounds.center.x = closestXSnap.snapPoint.point + (this.fromBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              snapBounds.center.x = closestXSnap.snapPoint.point - (this.fromBounds.width / 2);
              break;
          }
          this.snap.x = {
            ...closestXSnap.snapPoint,
            breakThreshold: 0,
            boundsSide: closestXSnap.bounds.side as 'left' | 'right' | 'center'
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
          switch(this.snap.y.boundsSide) {
            case 'top':
              snapBounds.center.y = this.snap.y.point + (this.fromBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = this.snap.y.point;
              break;
            case 'bottom':
              snapBounds.center.y = this.snap.y.point - (this.fromBounds.height / 2);
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
            top: true,
            bottom: true,
            center: true
          }
        });
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestYSnap.distance <= (1 / paperMain.view.zoom) * 2) {
          switch(closestYSnap.bounds.side) {
            case 'top':
              snapBounds.center.y = closestYSnap.snapPoint.point + (this.fromBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.center.y = closestYSnap.snapPoint.point - (this.fromBounds.height / 2);
              break;
          }
          this.snap.y = {
            ...closestYSnap.snapPoint,
            breakThreshold: 0,
            boundsSide: closestYSnap.bounds.side as 'top' | 'bottom' | 'center'
          };
        }
      }
      this.toBounds = snapBounds;
      this.translateLayers();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x || this.y) {
        if (this.state.layer.present.selected.length > 0) {
          store.dispatch(moveLayersBy({layers: this.state.layer.present.selected, x: this.x, y: this.y}));
        }
        if (this.ref) {
          this.ref.remove();
        }
      } else {
        updateSelectionFrame(this.state.layer.present);
      }
      this.disable();
    }
  }
}

export default DragTool;