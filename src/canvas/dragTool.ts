import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { moveLayersBy } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants, getInViewSnapPoints } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR, THEME_GUIDE_COLOR } from '../constants';
import Guide from './guide';
import MeasureGuide from './measureGuide';

class DragTool {
  enabled: boolean;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  snap: {
    x: {
      snapPoint: em.SnapPoint;
      breakThreshold: number;
      boundsSide: 'left' | 'right' | 'center';
    };
    y: {
      snapPoint: em.SnapPoint;
      breakThreshold: number;
      boundsSide: 'top' | 'bottom' | 'center';
    };
  };
  snapPoints: em.SnapPoint[];
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
  leftGuide: Guide;
  rightGuide: Guide;
  topGuide: Guide;
  bottomGuide: Guide;
  centerXGuide: Guide;
  centerYGuide: Guide;
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
    this.leftGuide = null;
    this.rightGuide = null;
    this.topGuide = null;
    this.bottomGuide = null;
    this.centerXGuide = null;
    this.centerYGuide = null;
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
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.leftGuide = null;
    this.rightGuide = null;
    this.topGuide = null;
    this.bottomGuide = null;
    this.centerXGuide = null;
    this.centerYGuide = null;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.ref = null;
    this.fromBounds = null;
    this.toBounds = null;
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
  updateToBounds(overrides?: any) {
    this.toBounds = new paperMain.Rectangle({
      rectangle: this.fromBounds,
      top: this.fromBounds.top,
      bottom: this.fromBounds.bottom,
      left: this.fromBounds.left,
      right: this.fromBounds.right
    });
  }
  updateGuide(guide: Guide, point1: paper.Point, point2: paper.Point) {
    if (guide) {
      guide.paperLayer.remove();
    }
    guide = new Guide(point1, point2, { up: true, drag: true });
  }
  updateGuides() {
    // find all snapPoints that match current selection bounds side
    const leftSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.left) === Math.round(snapPoint.point));
    const centerXSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.center.x) === Math.round(snapPoint.point));
    const rightSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.right) === Math.round(snapPoint.point));
    const topSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.top) === Math.round(snapPoint.point));
    const centerYSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.center.y) === Math.round(snapPoint.point));
    const bottomSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.toBounds.bottom) === Math.round(snapPoint.point));
    // if any snap points match, find their min/max...
    // vertical/horizontal position and add relevant guide
    if (this.snap.x && leftSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [this.toBounds.topLeft];
      const bottomLeftPoints: paper.Point[] = [this.toBounds.bottomLeft];
      leftSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
      });
      const minTopLeft = new paperMain.Point(this.toBounds.left, topLeftPoints.reduce(paper.Point.min).y);
      const maxBottomLeft = new paperMain.Point(this.toBounds.left, bottomLeftPoints.reduce(paper.Point.max).y);
      this.updateGuide(this.leftGuide, minTopLeft, maxBottomLeft);
    }
    if (this.snap.x && rightSnaps.length > 0) {
      const topRightPoints: paper.Point[] = [this.toBounds.topRight];
      const bottomRightPoints: paper.Point[] = [this.toBounds.bottomRight];
      rightSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topRightPoints.push(paperLayer.bounds.topRight);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minTopRight = new paperMain.Point(this.toBounds.right, topRightPoints.reduce(paper.Point.min).y);
      const maxBottomRight = new paperMain.Point(this.toBounds.right, bottomRightPoints.reduce(paper.Point.max).y);
      this.updateGuide(this.rightGuide, minTopRight, maxBottomRight);
    }
    if (this.snap.x && centerXSnaps.length > 0) {
      const topCenterPoints: paper.Point[] = [this.toBounds.topCenter];
      const bottomCenterPoints: paper.Point[] = [this.toBounds.bottomCenter];
      centerXSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topCenterPoints.push(paperLayer.bounds.topCenter);
        bottomCenterPoints.push(paperLayer.bounds.bottomCenter);
      });
      const minTopCenter = new paperMain.Point(this.toBounds.topCenter.x, topCenterPoints.reduce(paper.Point.min).y);
      const maxBottomCenter = new paperMain.Point(this.toBounds.bottomCenter.x, bottomCenterPoints.reduce(paper.Point.max).y);
      this.updateGuide(this.centerXGuide, minTopCenter, maxBottomCenter);
    }
    if (this.snap.y && topSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [this.toBounds.topLeft];
      const topRightPoints: paper.Point[] = [this.toBounds.topRight];
      topSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        topRightPoints.push(paperLayer.bounds.topRight);
      });
      const minTopLeft = new paperMain.Point(topLeftPoints.reduce(paper.Point.min).x, this.toBounds.top);
      const maxTopRight = new paperMain.Point(topRightPoints.reduce(paper.Point.max).x, this.toBounds.top);
      this.updateGuide(this.topGuide, minTopLeft, maxTopRight);
    }
    if (this.snap.y && bottomSnaps.length > 0) {
      const bottomLeftPoints: paper.Point[] = [this.toBounds.bottomLeft];
      const bottomRightPoints: paper.Point[] = [this.toBounds.bottomRight];
      bottomSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minBottomLeft = new paperMain.Point(bottomLeftPoints.reduce(paper.Point.min).x, this.toBounds.bottom);
      const maxBottomRight = new paperMain.Point(bottomRightPoints.reduce(paper.Point.max).x, this.toBounds.bottom);
      this.updateGuide(this.bottomGuide, minBottomLeft, maxBottomRight);
    }
    if (this.snap.y && centerYSnaps.length > 0) {
      const leftCenterPoints: paper.Point[] = [this.toBounds.leftCenter];
      const rightCenterPoints: paper.Point[] = [this.toBounds.rightCenter];
      centerYSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        leftCenterPoints.push(paperLayer.bounds.leftCenter);
        rightCenterPoints.push(paperLayer.bounds.rightCenter);
      });
      const minLeftCenter = new paperMain.Point(leftCenterPoints.reduce(paper.Point.min).x, this.toBounds.leftCenter.y);
      const maxLeftCenter = new paperMain.Point(rightCenterPoints.reduce(paper.Point.max).x, this.toBounds.rightCenter.y);
      this.updateGuide(this.centerYGuide, minLeftCenter, maxLeftCenter);
    }
  }
  updateMeasureGuide(guide: MeasureGuide, distance: string, point1: paper.Point, point2: paper.Point) {
    if (guide) {
      guide.paperLayer.remove();
    }
    guide = new MeasureGuide(distance, point1, point2, { up: true, drag: true });
  }
  closestSnapPoint(snapPoints: em.SnapPoint[], side: em.SnapBound) {
    let closestSnap;
    let distance;
    for(let i = 0; i < snapPoints.length; i++) {
      const snap = snapPoints[i];
      const pointMax = Math.max(side.point, snap.point);
      const pointMin = Math.min(side.point, snap.point);
      const pointDistance = pointMax - pointMin;
      if (!distance || pointDistance < distance) {
        closestSnap = snap;
        distance = pointDistance;
      }
    }
    return {
      snapPoint: closestSnap,
      distance: distance
    }
  }
  closestXSnapPoint() {
    // possible X snap points
    const xSnaps = this.snapPoints.filter((snapPoint) => snapPoint.axis === 'x');
    // bounding box snap points
    const xSnapBounds: em.SnapBound[] = [{side: 'left', point: this.toBounds.left}, {side: 'right', point: this.toBounds.right}, {side: 'center', point: this.toBounds.center.x}];
    let closestXSnap;
    let closestXSnapBounds;
    let distance;
    // For each bounding box snap point, loop through...
    // every possible X snap point and return the closest...
    // bounding snap point and X snap point
    for(let i = 0; i < xSnapBounds.length; i++) {
      const xSnapBound = xSnapBounds[i];
      for(let j = 0; j < xSnaps.length; j++) {
        const xSnap = xSnaps[j];
        const pointMax = Math.max(xSnapBound.point, xSnap.point);
        const pointMin = Math.min(xSnapBound.point, xSnap.point);
        const pointDistance = pointMax - pointMin;
        if (!distance || pointDistance < distance) {
          closestXSnap = xSnap;
          closestXSnapBounds = xSnapBound;
          distance = pointDistance;
        }
      }
    }
    return {
      bounds: closestXSnapBounds,
      snapPoint: closestXSnap,
      distance: distance
    }
  }
  closestYSnapPoint() {
    // possible Y snap points
    const ySnaps = this.snapPoints.filter((snapPoint) => snapPoint.axis === 'y');
    // bounding box snap points
    const ySnapBounds: em.SnapBound[] = [{side: 'top', point: this.toBounds.top}, {side: 'bottom', point: this.toBounds.bottom}, {side: 'center', point: this.toBounds.center.y}];
    let closestYSnap;
    let closestYSnapBounds;
    let distance;
    // For each bounding box snap point, loop through...
    // every possible Y snap point and return the closest...
    // bounding snap point and Y snap point
    for(let i = 0; i < ySnapBounds.length; i++) {
      const ySnapBound = ySnapBounds[i];
      for(let j = 0; j < ySnaps.length; j++) {
        const ySnap = ySnaps[j];
        const pointMax = Math.max(ySnapBound.point, ySnap.point);
        const pointMin = Math.min(ySnapBound.point, ySnap.point);
        const pointDistance = pointMax - pointMin;
        if (!distance || pointDistance < distance) {
          closestYSnap = ySnap;
          closestYSnapBounds = ySnapBound;
          distance = pointDistance;
        }
      }
    }
    return {
      bounds: closestYSnapBounds,
      snapPoint: closestYSnap,
      distance: distance
    }
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
    this.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => !allSelectedLayers.includes(snapPoint.id));
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
              snapBounds.center.x = this.snap.x.snapPoint.point + (this.fromBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = this.snap.x.snapPoint.point;
              break;
            case 'right':
              snapBounds.center.x = this.snap.x.snapPoint.point - (this.fromBounds.width / 2);
              break;
          }
          // if not exceeded, update X snap threshold
          this.snap.x.breakThreshold += event.delta.x;
        }
      } else {
        const closestXSnap = this.closestXSnapPoint();
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
            snapPoint: closestXSnap.snapPoint,
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
              snapBounds.center.y = this.snap.y.snapPoint.point + (this.fromBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = this.snap.y.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.center.y = this.snap.y.snapPoint.point - (this.fromBounds.height / 2);
              break;
          }
          // if not exceeded, update Y snap threshold
          this.snap.y.breakThreshold += event.delta.y;
        }
      } else {
        const closestYSnap = this.closestYSnapPoint();
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
            snapPoint: closestYSnap.snapPoint,
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
      this.updateGuides();
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