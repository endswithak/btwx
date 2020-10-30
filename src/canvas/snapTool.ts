import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import Guide from './guide';

class SnapTool {
  leftGuide: Guide;
  rightGuide: Guide;
  topGuide: Guide;
  bottomGuide: Guide;
  centerXGuide: Guide;
  centerYGuide: Guide;
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
  snapPoints: Btwx.SnapPoint[];
  xSnapsPoints: Btwx.SnapPoint[];
  ySnapPoints: Btwx.SnapPoint[];
  snapBounds: paper.Rectangle;
  snap: {
    x: Btwx.SnapPoint;
    y: Btwx.SnapPoint;
  };
  constructor() {
    this.snapBounds = null;
    this.snapPoints = [];
    this.leftGuide = null;
    this.rightGuide = null;
    this.topGuide = null;
    this.bottomGuide = null;
    this.centerXGuide = null;
    this.centerYGuide = null;
    this.snapBreakThreshholdMin = -8 / paperMain.view.zoom;
    this.snapBreakThreshholdMax = 8 / paperMain.view.zoom;
    this.snap = {
      x: null,
      y: null
    };
  }
  removeGuides(): void {
    if (this.leftGuide) {
      this.leftGuide.paperLayer.remove();
      this.leftGuide = null;
    }
    if (this.rightGuide) {
      this.rightGuide.paperLayer.remove();
      this.rightGuide = null;
    }
    if (this.topGuide) {
      this.topGuide.paperLayer.remove();
      this.topGuide = null;
    }
    if (this.bottomGuide) {
      this.bottomGuide.paperLayer.remove();
      this.bottomGuide = null;
    }
    if (this.centerXGuide) {
      this.centerXGuide.paperLayer.remove();
      this.centerXGuide = null;
    }
    if (this.centerYGuide) {
      this.centerYGuide.paperLayer.remove();
      this.centerYGuide = null;
    }
  }
  updateGuides(): void {
    this.removeGuides();
    // find all snapPoints that match current selection bounds side
    // const leftSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.left) === Math.round(snapPoint.point) && snapPoint.axis === 'x');
    // const centerXSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.center.x) === Math.round(snapPoint.point) && snapPoint.axis === 'x');
    // const rightSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.right) === Math.round(snapPoint.point) && snapPoint.axis === 'x');
    // const topSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.top) === Math.round(snapPoint.point) && snapPoint.axis === 'y');
    // const centerYSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.center.y) === Math.round(snapPoint.point) && snapPoint.axis === 'y');
    // const bottomSnaps = this.snapPoints.filter((snapPoint) => Math.round(this.snapBounds.bottom) === Math.round(snapPoint.point) && snapPoint.axis === 'y');
    const leftSnaps = this.xSnapsPoints.filter((snapPoint) => this.snapBounds.left.toFixed(2) === snapPoint.point.toFixed(2));
    const centerXSnaps = this.xSnapsPoints.filter((snapPoint) => this.snapBounds.center.x.toFixed(2) === snapPoint.point.toFixed(2));
    const rightSnaps = this.xSnapsPoints.filter((snapPoint) => this.snapBounds.right.toFixed(2) === snapPoint.point.toFixed(2));
    const topSnaps = this.ySnapPoints.filter((snapPoint) => this.snapBounds.top.toFixed(2) === snapPoint.point.toFixed(2));
    const centerYSnaps = this.ySnapPoints.filter((snapPoint) => this.snapBounds.center.y.toFixed(2) === snapPoint.point.toFixed(2));
    const bottomSnaps = this.ySnapPoints.filter((snapPoint) => this.snapBounds.bottom.toFixed(2) === snapPoint.point.toFixed(2));
    // if any snap points match, find their min/max...
    // vertical/horizontal position and add relevant guide
    if (this.snap.x && leftSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [this.snapBounds.topLeft];
      const bottomLeftPoints: paper.Point[] = [this.snapBounds.bottomLeft];
      leftSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
      });
      const minTopLeft = new paperMain.Point(this.snapBounds.left, topLeftPoints.reduce(paperMain.Point.min).y);
      const maxBottomLeft = new paperMain.Point(this.snapBounds.left, bottomLeftPoints.reduce(paperMain.Point.max).y);
      this.leftGuide = new Guide(minTopLeft, maxBottomLeft, { up: true });
    }
    if (this.snap.x && rightSnaps.length > 0) {
      const topRightPoints: paper.Point[] = [this.snapBounds.topRight];
      const bottomRightPoints: paper.Point[] = [this.snapBounds.bottomRight];
      rightSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topRightPoints.push(paperLayer.bounds.topRight);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minTopRight = new paperMain.Point(this.snapBounds.right, topRightPoints.reduce(paperMain.Point.min).y);
      const maxBottomRight = new paperMain.Point(this.snapBounds.right, bottomRightPoints.reduce(paperMain.Point.max).y);
      this.rightGuide = new Guide(minTopRight, maxBottomRight, { up: true });
    }
    if (this.snap.x && centerXSnaps.length > 0) {
      const topCenterPoints: paper.Point[] = [this.snapBounds.topCenter];
      const bottomCenterPoints: paper.Point[] = [this.snapBounds.bottomCenter];
      centerXSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topCenterPoints.push(paperLayer.bounds.topCenter);
        bottomCenterPoints.push(paperLayer.bounds.bottomCenter);
      });
      const minTopCenter = new paperMain.Point(this.snapBounds.topCenter.x, topCenterPoints.reduce(paperMain.Point.min).y);
      const maxBottomCenter = new paperMain.Point(this.snapBounds.bottomCenter.x, bottomCenterPoints.reduce(paperMain.Point.max).y);
      this.centerXGuide = new Guide(minTopCenter, maxBottomCenter, { up: true });
    }
    if (this.snap.y && topSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [this.snapBounds.topLeft];
      const topRightPoints: paper.Point[] = [this.snapBounds.topRight];
      topSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        topRightPoints.push(paperLayer.bounds.topRight);
      });
      const minTopLeft = new paperMain.Point(topLeftPoints.reduce(paperMain.Point.min).x, this.snapBounds.top);
      const maxTopRight = new paperMain.Point(topRightPoints.reduce(paperMain.Point.max).x, this.snapBounds.top);
      this.topGuide = new Guide(minTopLeft, maxTopRight, { up: true });
    }
    if (this.snap.y && bottomSnaps.length > 0) {
      const bottomLeftPoints: paper.Point[] = [this.snapBounds.bottomLeft];
      const bottomRightPoints: paper.Point[] = [this.snapBounds.bottomRight];
      bottomSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minBottomLeft = new paperMain.Point(bottomLeftPoints.reduce(paperMain.Point.min).x, this.snapBounds.bottom);
      const maxBottomRight = new paperMain.Point(bottomRightPoints.reduce(paperMain.Point.max).x, this.snapBounds.bottom);
      this.bottomGuide = new Guide(minBottomLeft, maxBottomRight, { up: true });
    }
    if (this.snap.y && centerYSnaps.length > 0) {
      const leftCenterPoints: paper.Point[] = [this.snapBounds.leftCenter];
      const rightCenterPoints: paper.Point[] = [this.snapBounds.rightCenter];
      centerYSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        leftCenterPoints.push(paperLayer.bounds.leftCenter);
        rightCenterPoints.push(paperLayer.bounds.rightCenter);
      });
      const minLeftCenter = new paperMain.Point(leftCenterPoints.reduce(paperMain.Point.min).x, this.snapBounds.leftCenter.y);
      const maxLeftCenter = new paperMain.Point(rightCenterPoints.reduce(paperMain.Point.max).x, this.snapBounds.rightCenter.y);
      this.centerYGuide = new Guide(minLeftCenter, maxLeftCenter, { up: true });
    }
  }
  closestSnapPoint({snapPoints, side}: {snapPoints: Btwx.SnapPoint[]; side: Btwx.SnapBound}): { snapPoint: Btwx.SnapPoint; distance: number } {
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
  closestXSnapPoint({snapTo}: {snapTo: { left: boolean; right: boolean; center: boolean }}): { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number } {
    const xSnaps = this.xSnapsPoints;
    const snapBounds = Object.keys(snapTo).reduce((result: Btwx.SnapBound[], current: 'left' | 'right' | 'center') => {
      if (snapTo[current]) {
        switch(current) {
          case 'left':
            result = [...result, {side: current, point: this.snapBounds.left}];
            break;
          case 'right':
            result = [...result, {side: current, point: this.snapBounds.right}];
            break;
          case 'center':
            result = [...result, {side: current, point: this.snapBounds.center.x}];
            break;
        }
      }
      return result;
    }, []);
    let closestXSnap;
    let closestXSnapBounds;
    let distance;
    // For each bounding box snap point, loop through...
    // every possible X snap point and return the closest...
    // bounding snap point and X snap point
    for(let i = 0; i < snapBounds.length; i++) {
      const xSnapBound = snapBounds[i];
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
  closestYSnapPoint({snapTo}: {snapTo: { top: boolean; bottom: boolean; center: boolean }}): { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number } {
    const ySnaps = this.ySnapPoints;
    const snapBounds = Object.keys(snapTo).reduce((result: Btwx.SnapBound[], current: 'top' | 'bottom' | 'center') => {
      if (snapTo[current]) {
        switch(current) {
          case 'top':
            result = [...result, {side: current, point: this.snapBounds.top}];
            break;
          case 'bottom':
            result = [...result, {side: current, point: this.snapBounds.bottom}];
            break;
          case 'center':
            result = [...result, {side: current, point: this.snapBounds.center.y}];
            break;
        }
      }
      return result;
    }, []);
    let closestYSnap;
    let closestYSnapBounds;
    let distance;
    // For each bounding box snap point, loop through...
    // every possible Y snap point and return the closest...
    // bounding snap point and Y snap point
    for(let i = 0; i < snapBounds.length; i++) {
      const ySnapBound = snapBounds[i];
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
  updateXSnap({
    event,
    snapTo,
    handleSnapped,
    handleSnap
  }: {
    event: paper.ToolEvent;
    snapTo: { left: boolean; right: boolean; center: boolean };
    handleSnapped?(snapPoint: Btwx.SnapPoint): void;
    handleSnap?({ bounds, snapPoint, distance }: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }): void;
  }): void {
    if (this.snap.x) {
      // check if event delta will exceed X snap point min/max threshold
      if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
        // if exceeded, adjust selection bounds...
        // clear X snap, and reset X snap threshold
        this.snap.x = null;
      } else {
        if (handleSnapped) {
          handleSnapped(this.snap.x);
        }
        // if not exceeded, update X snap threshold
        this.snap.x.breakThreshold += event.delta.x;
      }
    } else {
      const closestXSnap = this.closestXSnapPoint({
        snapTo: snapTo
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        if (handleSnap) {
          handleSnap(closestXSnap);
        }
        this.snap.x = {
          ...closestXSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestXSnap.bounds.side as 'left' | 'right' | 'center'
        };
      }
    }
  }
  updateYSnap({
    event,
    snapTo,
    handleSnapped,
    handleSnap
  }: {
    event: paper.ToolEvent;
    snapTo: { top: boolean; bottom: boolean; center: boolean };
    handleSnapped?(snapPoint: Btwx.SnapPoint): void;
    handleSnap?({ bounds, snapPoint, distance }: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }): void;
  }): void {
    if (this.snap.y) {
      // check if event delta will exceed Y snap point min/max threshold
      if (this.snap.y.breakThreshold + event.delta.y < this.snapBreakThreshholdMin || this.snap.y.breakThreshold + event.delta.y > this.snapBreakThreshholdMax) {
        // if exceeded, adjust selection bounds...
        // clear Y snap, and reset Y snap threshold
        this.snap.y = null;
      } else {
        if (handleSnapped) {
          handleSnapped(this.snap.y);
        }
        // if not exceeded, update Y snap threshold
        this.snap.y.breakThreshold += event.delta.y;
      }
    } else {
      const closestYSnap = this.closestYSnapPoint({
        snapTo: snapTo
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestYSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        if (handleSnap) {
          handleSnap(closestYSnap);
        }
        this.snap.y = {
          ...closestYSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestYSnap.bounds.side as 'top' | 'bottom' | 'center'
        };
      }
    }
  }
}

export default SnapTool;