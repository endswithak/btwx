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
  constructor() {
    this.leftGuide = null;
    this.rightGuide = null;
    this.topGuide = null;
    this.bottomGuide = null;
    this.centerXGuide = null;
    this.centerYGuide = null;
  }
  removeGuides() {
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
  updateGuides({snapPoints, xSnap, ySnap, bounds}: {snapPoints: em.SnapPoint[], xSnap: em.SnapPoint, ySnap: em.SnapPoint, bounds: paper.Rectangle}) {
    this.removeGuides();
    // find all snapPoints that match current selection bounds side
    const leftSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.left) === Math.round(snapPoint.point));
    const centerXSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.center.x) === Math.round(snapPoint.point));
    const rightSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.right) === Math.round(snapPoint.point));
    const topSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.top) === Math.round(snapPoint.point));
    const centerYSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.center.y) === Math.round(snapPoint.point));
    const bottomSnaps = snapPoints.filter((snapPoint) => Math.round(bounds.bottom) === Math.round(snapPoint.point));
    // if any snap points match, find their min/max...
    // vertical/horizontal position and add relevant guide
    if (xSnap && leftSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [bounds.topLeft];
      const bottomLeftPoints: paper.Point[] = [bounds.bottomLeft];
      leftSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
      });
      const minTopLeft = new paperMain.Point(bounds.left, topLeftPoints.reduce(paperMain.Point.min).y);
      const maxBottomLeft = new paperMain.Point(bounds.left, bottomLeftPoints.reduce(paperMain.Point.max).y);
      this.leftGuide = new Guide(minTopLeft, maxBottomLeft, { up: true, drag: true, move: true });
    }
    if (xSnap && rightSnaps.length > 0) {
      const topRightPoints: paper.Point[] = [bounds.topRight];
      const bottomRightPoints: paper.Point[] = [bounds.bottomRight];
      rightSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topRightPoints.push(paperLayer.bounds.topRight);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minTopRight = new paperMain.Point(bounds.right, topRightPoints.reduce(paperMain.Point.min).y);
      const maxBottomRight = new paperMain.Point(bounds.right, bottomRightPoints.reduce(paperMain.Point.max).y);
      this.rightGuide = new Guide(minTopRight, maxBottomRight, { up: true, drag: true, move: true });
    }
    if (xSnap && centerXSnaps.length > 0) {
      const topCenterPoints: paper.Point[] = [bounds.topCenter];
      const bottomCenterPoints: paper.Point[] = [bounds.bottomCenter];
      centerXSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topCenterPoints.push(paperLayer.bounds.topCenter);
        bottomCenterPoints.push(paperLayer.bounds.bottomCenter);
      });
      const minTopCenter = new paperMain.Point(bounds.topCenter.x, topCenterPoints.reduce(paperMain.Point.min).y);
      const maxBottomCenter = new paperMain.Point(bounds.bottomCenter.x, bottomCenterPoints.reduce(paperMain.Point.max).y);
      this.centerXGuide = new Guide(minTopCenter, maxBottomCenter, { up: true, drag: true, move: true });
    }
    if (ySnap && topSnaps.length > 0) {
      const topLeftPoints: paper.Point[] = [bounds.topLeft];
      const topRightPoints: paper.Point[] = [bounds.topRight];
      topSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        topLeftPoints.push(paperLayer.bounds.topLeft);
        topRightPoints.push(paperLayer.bounds.topRight);
      });
      const minTopLeft = new paperMain.Point(topLeftPoints.reduce(paperMain.Point.min).x, bounds.top);
      const maxTopRight = new paperMain.Point(topRightPoints.reduce(paperMain.Point.max).x, bounds.top);
      this.topGuide = new Guide(minTopLeft, maxTopRight, { up: true, drag: true, move: true });
    }
    if (ySnap && bottomSnaps.length > 0) {
      const bottomLeftPoints: paper.Point[] = [bounds.bottomLeft];
      const bottomRightPoints: paper.Point[] = [bounds.bottomRight];
      bottomSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        bottomLeftPoints.push(paperLayer.bounds.bottomLeft);
        bottomRightPoints.push(paperLayer.bounds.bottomRight);
      });
      const minBottomLeft = new paperMain.Point(bottomLeftPoints.reduce(paperMain.Point.min).x, bounds.bottom);
      const maxBottomRight = new paperMain.Point(bottomRightPoints.reduce(paperMain.Point.max).x, bounds.bottom);
      this.bottomGuide = new Guide(minBottomLeft, maxBottomRight, { up: true, drag: true, move: true });
    }
    if (ySnap && centerYSnaps.length > 0) {
      const leftCenterPoints: paper.Point[] = [bounds.leftCenter];
      const rightCenterPoints: paper.Point[] = [bounds.rightCenter];
      centerYSnaps.forEach((point) => {
        const paperLayer = getPaperLayer(point.id);
        leftCenterPoints.push(paperLayer.bounds.leftCenter);
        rightCenterPoints.push(paperLayer.bounds.rightCenter);
      });
      const minLeftCenter = new paperMain.Point(leftCenterPoints.reduce(paperMain.Point.min).x, bounds.leftCenter.y);
      const maxLeftCenter = new paperMain.Point(rightCenterPoints.reduce(paperMain.Point.max).x, bounds.rightCenter.y);
      this.centerYGuide = new Guide(minLeftCenter, maxLeftCenter, { up: true, drag: true, move: true });
    }
  }
  closestSnapPoint({snapPoints, side}: {snapPoints: em.SnapPoint[], side: em.SnapBound}) {
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
  closestXSnapPoint({snapPoints, bounds, snapTo}: {snapPoints: em.SnapPoint[], bounds: paper.Rectangle, snapTo: { left: boolean; right: boolean; center: boolean; }}) {
    const xSnaps = snapPoints.filter((snapPoint) => snapPoint.axis === 'x');
    const snapBounds = Object.keys(snapTo).reduce((result: em.SnapBound[], current: 'left' | 'right' | 'center') => {
      if (snapTo[current]) {
        switch(current) {
          case 'left':
            result = [...result, {side: current, point: bounds.left}];
            break;
          case 'right':
            result = [...result, {side: current, point: bounds.right}];
            break;
          case 'center':
            result = [...result, {side: current, point: bounds.center.x}];
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
  closestYSnapPoint({snapPoints, bounds, snapTo}: {snapPoints: em.SnapPoint[], bounds: paper.Rectangle, snapTo: { top: boolean; bottom: boolean; center: boolean }}) {
    const ySnaps = snapPoints.filter((snapPoint) => snapPoint.axis === 'y');
    const snapBounds = Object.keys(snapTo).reduce((result: em.SnapBound[], current: 'top' | 'bottom' | 'center') => {
      if (snapTo[current]) {
        switch(current) {
          case 'top':
            result = [...result, {side: current, point: bounds.top}];
            break;
          case 'bottom':
            result = [...result, {side: current, point: bounds.bottom}];
            break;
          case 'center':
            result = [...result, {side: current, point: bounds.center.y}];
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
}

export default SnapTool;