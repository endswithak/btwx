import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { moveLayersBy } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants, getInViewSnapPoints } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR, THEME_GUIDE_COLOR } from '../constants';
import SnapTool from './snapTool';

class DragTool {
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
  ref: paper.Path.Rectangle;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  centerOffset: paper.Point;
  constructor() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
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
  enable() {
    this.enabled = true;
    this.snapTool = new SnapTool;
  }
  disable() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
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
  onEscape() {
    if (this.enabled) {
      if (this.x || this.y) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            const paperItem = state.layer.present.byId[layer];
            paperLayer.position.x = paperItem.frame.x;
            paperLayer.position.y = paperItem.frame.y;
          });
        }
      }
    }
    this.disable();
  }
  updateRef() {
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = new paperMain.Path.Rectangle({
      rectangle: this.toBounds,
      strokeColor: THEME_PRIMARY_COLOR,
    });
    this.ref.removeOn({
      drag: true,
      up: true
    });
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState();
    // get selection bounds
    const selectionBounds = getSelectionBounds(state.layer.present);
    this.fromBounds = selectionBounds;
    this.from = event.point;
    this.to = event.point;
    this.toBounds = new paperMain.Rectangle(this.fromBounds);
    this.updateRef();
    // get all the possible snap points of layers in view...
    // that are not selected and add to snapPoints
    let allSelectedLayers: string[] = [];
    state.layer.present.selected.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(state.layer.present, id);
      allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
    });
    this.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.to = event.point;
      this.toBounds.center.x = this.fromBounds.center.x + this.x;
      this.toBounds.center.y = this.fromBounds.center.y + this.y;
      const snapBounds = this.toBounds.clone();
      const state = store.getState();
      // remove any existing hover or selection frame
      if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
        paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
      }
      if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
        paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
      }
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
      const translate = {x: this.toBounds.center.x - this.fromBounds.center.x, y: this.toBounds.center.y - this.fromBounds.center.y};
      this.updateRef();
      state.layer.present.selected.forEach((id) => {
        const paperLayer = getPaperLayer(id);
        const layerItem = state.layer.present.byId[id];
        paperLayer.position.x = layerItem.frame.x + translate.x;
        paperLayer.position.y = layerItem.frame.y + translate.y;
      });
      this.snapTool.updateGuides({
        snapPoints: this.snapPoints,
        bounds: this.toBounds,
        xSnap: this.snap.x,
        ySnap: this.snap.y
      });
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      if (this.x || this.y) {
        if (state.layer.present.selected.length > 0) {
          store.dispatch(moveLayersBy({layers: state.layer.present.selected, x: this.x, y: this.y}));
        }
      } else {
        updateSelectionFrame(state.layer.present);
      }
    }
    this.disable();
  }
}

export default DragTool;