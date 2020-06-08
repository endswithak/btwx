import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { moveLayersBy } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR, THEME_GUIDE_COLOR } from '../constants';

class DragTool {
  enabled: boolean;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  snap: {
    x: {
      id: string;
      axis: string;
      side: string;
      point: number;
    };
    y: {
      id: string;
      axis: string;
      side: string;
      point: number;
    };
  };
  snapPoints: {
    id: string;
    axis: string;
    side: string;
    point: number;
  }[];
  breakSnapThreshold: {
    x: {
      max: number;
      min: number;
      current: number;
    };
    y: {
      max: number;
      min: number;
      current: number;
    };
  };
  boundsGuide: paper.Path.Rectangle;
  leftGuide: paper.Path.Line;
  rightGuide: paper.Path.Line;
  topGuide: paper.Path.Line;
  bottomGuide: paper.Path.Line;
  centerXGuide: paper.Path.Line;
  centerYGuide: paper.Path.Line;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.boundsGuide = null;
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
    this.breakSnapThreshold = {
      x: {
        max: 16,
        min: -16,
        current: 0
      },
      y: {
        max: 16,
        min: -16,
        current: 0
      },
    };
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
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.breakSnapThreshold.x.current = 0;
    this.breakSnapThreshold.y.current = 0;
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
  updateGuide(guide: paper.Path.Line, point1: paper.Point, point2: paper.Point) {
    if (guide) {
      guide.remove();
    }
    guide = new paperMain.Path.Line(point1, point2);
    guide.strokeColor = new paper.Color(THEME_GUIDE_COLOR);
    guide.removeOn({
      up: true,
      drag: true
    });
  }
  closestXSnapPoint() {
    // possible X snap points
    const xSnaps = this.snapPoints.filter((snapPoint) => snapPoint.axis === 'x');
    // bounding box snap points
    const xSnapBounds = [{side: 'left', point: this.boundsGuide.bounds.left}, {side: 'right', point: this.boundsGuide.bounds.right}, {side: 'center', point: this.boundsGuide.bounds.center.x}];
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
    const ySnapBounds = [{side: 'top', point: this.boundsGuide.bounds.top}, {side: 'bottom', point: this.boundsGuide.bounds.bottom}, {side: 'center', point: this.boundsGuide.bounds.center.y}];
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
    // create guide with selection bounds
    this.boundsGuide = new paperMain.Path.Rectangle({
      rectangle: selectionBounds,
      strokeColor: THEME_PRIMARY_COLOR
    });
    this.boundsGuide.removeOn({
      up: true
    });
    // set from point
    this.from = this.boundsGuide.position;
    // get all the possible snap points of layers in view...
    // that are not selected and add to snapPoints
    let allSelectedLayers: string[] = [];
    state.layer.present.selected.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(state.layer.present, id);
      allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
    });
    let allInViewLayers: string[] = [];
    state.layer.present.inView.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(state.layer.present, id);
      allInViewLayers = [...allInViewLayers, ...layerAndDescendants];
    });
    const inViewNotSelected = allInViewLayers.filter((id) => !allSelectedLayers.includes(id));
    inViewNotSelected.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      let bounds;
      if (paperLayer.data.type === 'Artboard') {
        bounds = paperLayer.getItem({data: { id: 'ArtboardBackground' }}).bounds;
      } else {
        bounds = paperLayer.bounds;
      }
      const left = {
        id: id,
        axis: 'x',
        side: 'left',
        point: bounds.left
      };
      const centerX = {
        id: id,
        axis: 'x',
        side: 'center',
        point: bounds.center.x
      };
      const centerY = {
        id: id,
        axis: 'y',
        side: 'center',
        point: bounds.center.y
      };
      const right = {
        id: id,
        axis: 'x',
        side: 'right',
        point: bounds.right
      };
      const top = {
        id: id,
        axis: 'y',
        side: 'top',
        point: bounds.top
      };
      const bottom = {
        id: id,
        axis: 'y',
        side: 'bottom',
        point: bounds.bottom
      };
      this.snapPoints.push(left, right, top, bottom, centerX, centerY);
    });
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      // remove any existing hover or selection frame
      if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
        paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
      }
      if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
        paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
      }
      // check if there is an active X snap point
      if (this.snap.x) {
        // check if event delta will exceed X snap point min/max threshold
        if (this.breakSnapThreshold.x.current + event.delta.x < this.breakSnapThreshold.x.min || this.breakSnapThreshold.x.current + event.delta.x > this.breakSnapThreshold.x.max) {
          // if exceeded, adjust selection bounds...
          // clear X snap, and reset X snap threshold
          this.boundsGuide.position.x += (this.breakSnapThreshold.x.current + event.delta.x);
          this.snap.x = null;
          this.breakSnapThreshold.x.current = 0;
        } else {
          // if not exceeded, update X snap threshold
          this.breakSnapThreshold.x.current += event.delta.x;
        }
      }
      // if no active X snap
      else {
        // update selection bounds X position
        this.boundsGuide.position.x += event.delta.x;
        // get closest X snap point
        const closestXSnap = this.closestXSnapPoint();
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestXSnap.distance <= 2) {
          switch(closestXSnap.bounds.side) {
            case 'left':
              this.boundsGuide.bounds.left = closestXSnap.snapPoint.point;
              break;
            case 'center':
              this.boundsGuide.bounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              this.boundsGuide.bounds.right = closestXSnap.snapPoint.point;
              break;
          }
          this.snap.x = closestXSnap.snapPoint;
          this.breakSnapThreshold.x.current = 0;
        }
      }
      // check if there is an active Y snap point
      if (this.snap.y) {
        // check if event delta will exceed Y snap point min/max threshold
        if (this.breakSnapThreshold.y.current + event.delta.y < this.breakSnapThreshold.y.min || this.breakSnapThreshold.y.current + event.delta.y > this.breakSnapThreshold.y.max) {
          // if exceeded, adjust selection bounds...
          // clear Y snap, and reset Y snap threshold
          this.boundsGuide.position.y += (this.breakSnapThreshold.y.current + event.delta.y);
          this.snap.y = null;
          this.breakSnapThreshold.y.current = 0;
        } else {
          // if not exceeded, update Y snap threshold
          this.breakSnapThreshold.y.current += event.delta.y;
        }
      }
      // if no active Y snap
      else {
        // update selection bounds Y position
        this.boundsGuide.position.y += event.delta.y;
        // get closest Y snap point
        const closestYSnap = this.closestYSnapPoint();
        // if selection bounds is within 2 units from...
        // closest point, snap to that point
        if (closestYSnap.distance <= 2) {
          switch(closestYSnap.bounds.side) {
            case 'top':
              this.boundsGuide.bounds.top = closestYSnap.snapPoint.point;
              break;
            case 'center':
              this.boundsGuide.bounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              this.boundsGuide.bounds.bottom = closestYSnap.snapPoint.point;
              break;
          }
          this.snap.y = closestYSnap.snapPoint;
          this.breakSnapThreshold.y.current = 0;
        }
      }
      // find all snapPoints that match current selection bounds side
      const leftSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.left) === Math.round(snapPoint.point));
      const centerXSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.center.x) === Math.round(snapPoint.point));
      const rightSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.right) === Math.round(snapPoint.point));
      const topSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.top) === Math.round(snapPoint.point));
      const centerYSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.center.y) === Math.round(snapPoint.point));
      const bottomSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.bottom) === Math.round(snapPoint.point));
      // if any snap points match, find their min/max...
      // vertical/horizontal position and add relevant guide
      if (leftSnaps.length > 0) {
        const topLeftPoints: paper.Point[] = [this.boundsGuide.bounds.topLeft];
        const bottomLeftPoints: paper.Point[] = [this.boundsGuide.bounds.bottomLeft];
        leftSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topLeftPoints.push(paperLayer.bounds.topLeft);
          bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
        });
        const minTopLeft = new paper.Point(this.boundsGuide.bounds.left, topLeftPoints.reduce(paper.Point.min).y);
        const maxBottomLeft = new paper.Point(this.boundsGuide.bounds.left, bottomLeftPoints.reduce(paper.Point.max).y);
        this.updateGuide(this.leftGuide, minTopLeft, maxBottomLeft);
      }
      if (rightSnaps.length > 0) {
        const topRightPoints: paper.Point[] = [this.boundsGuide.bounds.topRight];
        const bottomRightPoints: paper.Point[] = [this.boundsGuide.bounds.bottomRight];
        rightSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topRightPoints.push(paperLayer.bounds.topRight);
          bottomRightPoints.push(paperLayer.bounds.bottomRight);
        });
        const minTopRight = new paper.Point(this.boundsGuide.bounds.right, topRightPoints.reduce(paper.Point.min).y);
        const maxBottomRight = new paper.Point(this.boundsGuide.bounds.right, bottomRightPoints.reduce(paper.Point.max).y);
        this.updateGuide(this.rightGuide, minTopRight, maxBottomRight);
      }
      if (centerXSnaps.length > 0) {
        const topCenterPoints: paper.Point[] = [this.boundsGuide.bounds.topCenter];
        const bottomCenterPoints: paper.Point[] = [this.boundsGuide.bounds.bottomCenter];
        centerXSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topCenterPoints.push(paperLayer.bounds.topCenter);
          bottomCenterPoints.push(paperLayer.bounds.bottomCenter);
        });
        const minTopCenter = new paper.Point(this.boundsGuide.bounds.topCenter.x, topCenterPoints.reduce(paper.Point.min).y);
        const maxBottomCenter = new paper.Point(this.boundsGuide.bounds.bottomCenter.x, bottomCenterPoints.reduce(paper.Point.max).y);
        this.updateGuide(this.centerXGuide, minTopCenter, maxBottomCenter);
      }
      if (topSnaps.length > 0) {
        const topLeftPoints: paper.Point[] = [this.boundsGuide.bounds.topLeft];
        const topRightPoints: paper.Point[] = [this.boundsGuide.bounds.topRight];
        topSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topLeftPoints.push(paperLayer.bounds.topLeft);
          topRightPoints.push(paperLayer.bounds.topRight);
        });
        const minTopLeft = new paper.Point(topLeftPoints.reduce(paper.Point.min).x, this.boundsGuide.bounds.top);
        const maxTopRight = new paper.Point(topRightPoints.reduce(paper.Point.max).x, this.boundsGuide.bounds.top);
        this.updateGuide(this.topGuide, minTopLeft, maxTopRight);
      }
      if (bottomSnaps.length > 0) {
        const bottomLeftPoints: paper.Point[] = [this.boundsGuide.bounds.bottomLeft];
        const bottomRightPoints: paper.Point[] = [this.boundsGuide.bounds.bottomRight];
        bottomSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
          bottomRightPoints.push(paperLayer.bounds.bottomRight);
        });
        const minBottomLeft = new paper.Point(bottomLeftPoints.reduce(paper.Point.min).x, this.boundsGuide.bounds.bottom);
        const maxBottomRight = new paper.Point(bottomRightPoints.reduce(paper.Point.max).x, this.boundsGuide.bounds.bottom);
        this.updateGuide(this.bottomGuide, minBottomLeft, maxBottomRight);
      }
      if (centerYSnaps.length > 0) {
        const leftCenterPoints: paper.Point[] = [this.boundsGuide.bounds.leftCenter];
        const rightCenterPoints: paper.Point[] = [this.boundsGuide.bounds.rightCenter];
        centerYSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          leftCenterPoints.push(paperLayer.bounds.leftCenter);
          rightCenterPoints.push(paperLayer.bounds.rightCenter);
        });
        const minLeftCenter = new paper.Point(leftCenterPoints.reduce(paper.Point.min).x, this.boundsGuide.bounds.leftCenter.y);
        const maxLeftCenter = new paper.Point(rightCenterPoints.reduce(paper.Point.max).x, this.boundsGuide.bounds.rightCenter.y);
        this.updateGuide(this.centerYGuide, minLeftCenter, maxLeftCenter);
      }
      // update to, x, and y values
      this.to = this.boundsGuide.position;
      this.x = this.to.x - this.from.x;
      this.y = this.to.y - this.from.y;
      // update selected layers positions
      state.layer.present.selected.forEach((id) => {
        const paperLayer = getPaperLayer(id);
        const layerItem = state.layer.present.byId[id];
        paperLayer.position.x = layerItem.frame.x + this.x;
        paperLayer.position.y = layerItem.frame.y + this.y;
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