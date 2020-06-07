import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { moveLayersBy } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import gsap from 'gsap';

class DragTool {
  enabled: boolean;
  xDirection: 'left' | 'right';
  yDirection: 'up' | 'down';
  x: number;
  y: number;
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
      direction: 'left' | 'right';
      max: number;
      min: number;
      current: number;
    };
    y: {
      direction: 'up' | 'down';
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
    this.xDirection = 'right';
    this.yDirection = 'down';
    this.shiftModifier = false;
    this.metaModifier = false;
    this.boundsGuide = null;
    this.leftGuide = null;
    this.rightGuide = null;
    this.topGuide = null;
    this.bottomGuide = null;
    this.centerXGuide = null;
    this.centerYGuide = null;
    this.snapPoints = null;
    this.snap = {
      x: null,
      y: null
    };
    this.breakSnapThreshold = {
      x: {
        direction: this.xDirection,
        max: 16,
        current: 0
      },
      y: {
        direction: this.yDirection,
        max: 16,
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
    this.xDirection = 'right';
    this.yDirection = 'down';
    this.snapPoints = null;
    this.snap = {
      x: null,
      y: null
    };
    this.breakSnapThreshold = {
      x: {
        direction: this.xDirection,
        max: 16,
        min: -16,
        current: 0
      },
      y: {
        direction: this.yDirection,
        max: 16,
        min: -16,
        current: 0
      },
    };
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
  updateGuide(guide, point1: paper.Point, point2: paper.Point) {
    if (guide) {
      guide.remove();
    }
    guide = new paperMain.Path.Line(point1, point2);
    guide.strokeColor = 'red';
    guide.removeOn({
      up: true,
      drag: true
    });
  }
  closestXSnapPoint() {
    const xSnaps = this.snapPoints.filter((snapPoint) => snapPoint.axis === 'x');
    const xSnapBounds = [{side: 'left', point: this.boundsGuide.bounds.left}, {side: 'right', point: this.boundsGuide.bounds.right}, {side: 'center', point: this.boundsGuide.bounds.center.x}];
    let closestXSnap;
    let closestXSnapBounds;
    let distance;
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
    const ySnaps = this.snapPoints.filter((snapPoint) => snapPoint.axis === 'y');
    const ySnapBounds = [{side: 'top', point: this.boundsGuide.bounds.top}, {side: 'bottom', point: this.boundsGuide.bounds.bottom}, {side: 'center', point: this.boundsGuide.bounds.center.y}];
    let closestYSnap;
    let closestYSnapBounds;
    let distance;
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
    const selectionBounds = getSelectionBounds(state.layer.present);
    this.boundsGuide = new paperMain.Path.Rectangle(selectionBounds);
    this.boundsGuide.strokeColor = 'red';
    this.snapPoints = [];
    state.layer.present.inView.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const bounds = paperLayer.bounds;
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
      if (this.x || this.y) {
        if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
          paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
        }
        if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
          paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
        }
      }
      if (this.snap.x) {
        if (this.breakSnapThreshold.x.current + event.delta.x < this.breakSnapThreshold.x.min || this.breakSnapThreshold.x.current + event.delta.x > this.breakSnapThreshold.x.max) {
          this.boundsGuide.position.x += (this.breakSnapThreshold.x.current + event.delta.x);
          this.snap.x = null;
          this.breakSnapThreshold.x.current = 0;
        } else {
          this.breakSnapThreshold.x.current += event.delta.x;
        }
      } else {
        this.boundsGuide.position.x += event.delta.x;
        const closestXSnap = this.closestXSnapPoint();
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
      if (this.snap.y) {
        if (this.breakSnapThreshold.y.current + event.delta.y < this.breakSnapThreshold.y.min || this.breakSnapThreshold.y.current + event.delta.y > this.breakSnapThreshold.y.max) {
          this.boundsGuide.position.y += (this.breakSnapThreshold.y.current + event.delta.y);
          this.snap.y = null;
          this.breakSnapThreshold.y.current = 0;
        } else {
          this.breakSnapThreshold.y.current += event.delta.y;
        }
      } else {
        this.boundsGuide.position.y += event.delta.y;
        const closestYSnap = this.closestYSnapPoint();
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
      const leftSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.left) === snapPoint.point);
      const centerXSnaps = this.snapPoints.filter((snapPoint) => this.boundsGuide.internalBounds.center.x === snapPoint.point);
      const centerYSnaps = this.snapPoints.filter((snapPoint) => this.boundsGuide.internalBounds.center.y === snapPoint.point);
      const rightSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.boundsGuide.bounds.right) === snapPoint.point);
      const topSnaps = this.snapPoints.filter((snapPoint) => this.boundsGuide.internalBounds.top === snapPoint.point);
      const bottomSnaps = this.snapPoints.filter((snapPoint) => this.boundsGuide.internalBounds.bottom === snapPoint.point);
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
        const topCenterPoints: paper.Point[] = [this.boundsGuide.internalBounds.topCenter];
        const bottomCenterPoints: paper.Point[] = [this.boundsGuide.internalBounds.bottomCenter];
        centerXSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topCenterPoints.push(paperLayer.internalBounds.topCenter);
          bottomCenterPoints.push(paperLayer.internalBounds.bottomCenter);
        });
        const minTopCenter = new paper.Point(this.boundsGuide.internalBounds.topCenter.x, topCenterPoints.reduce(paper.Point.min).y);
        const maxBottomCenter = new paper.Point(this.boundsGuide.internalBounds.bottomCenter.x, bottomCenterPoints.reduce(paper.Point.max).y);
        this.updateGuide(this.centerXGuide, minTopCenter, maxBottomCenter);
      }
      if (topSnaps.length > 0) {
        const topLeftPoints: paper.Point[] = [this.boundsGuide.internalBounds.topLeft];
        const topRightPoints: paper.Point[] = [this.boundsGuide.internalBounds.topRight];
        topSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          topLeftPoints.push(paperLayer.internalBounds.topLeft);
          topRightPoints.push(paperLayer.internalBounds.topRight);
        });
        const minTopLeft = new paper.Point(topLeftPoints.reduce(paper.Point.min).x, this.boundsGuide.internalBounds.top);
        const maxTopRight = new paper.Point(topRightPoints.reduce(paper.Point.max).x, this.boundsGuide.internalBounds.top);
        this.updateGuide(this.topGuide, minTopLeft, maxTopRight);
      }
      if (bottomSnaps.length > 0) {
        const bottomLeftPoints: paper.Point[] = [this.boundsGuide.internalBounds.bottomLeft];
        const bottomRightPoints: paper.Point[] = [this.boundsGuide.internalBounds.bottomRight];
        bottomSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          bottomLeftPoints.push(paperLayer.internalBounds.bottomLeft);
          bottomRightPoints.push(paperLayer.internalBounds.bottomRight);
        });
        const minBottomLeft = new paper.Point(bottomLeftPoints.reduce(paper.Point.min).x, this.boundsGuide.internalBounds.bottom);
        const maxBottomRight = new paper.Point(bottomRightPoints.reduce(paper.Point.max).x, this.boundsGuide.internalBounds.bottom);
        this.updateGuide(this.bottomGuide, minBottomLeft, maxBottomRight);
      }
      if (centerYSnaps.length > 0) {
        const leftCenterPoints: paper.Point[] = [this.boundsGuide.internalBounds.leftCenter];
        const rightCenterPoints: paper.Point[] = [this.boundsGuide.internalBounds.rightCenter];
        centerYSnaps.forEach((point) => {
          const paperLayer = getPaperLayer(point.id);
          leftCenterPoints.push(paperLayer.internalBounds.leftCenter);
          rightCenterPoints.push(paperLayer.internalBounds.rightCenter);
        });
        const minLeftCenter = new paper.Point(leftCenterPoints.reduce(paper.Point.min).x, this.boundsGuide.internalBounds.leftCenter.y);
        const maxLeftCenter = new paper.Point(rightCenterPoints.reduce(paper.Point.max).x, this.boundsGuide.internalBounds.rightCenter.y);
        this.updateGuide(this.centerYGuide, minLeftCenter, maxLeftCenter);
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      // if (this.x || this.y) {
      //   const state = store.getState();
      //   if (state.layer.present.selected.length > 0) {
      //     store.dispatch(moveLayersBy({layers: state.layer.present.selected, x: this.x, y: this.y}));
      //   }
      // }
      this.boundsGuide.remove();
      // this.leftGuide.remove();
      // this.rightGuide.remove();
      // this.topGuide.remove();
      // this.bottomGuide.remove();
    }
    this.disable();
  }
}

export default DragTool;