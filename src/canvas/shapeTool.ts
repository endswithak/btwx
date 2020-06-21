import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool } from '../store/actions/tool';
import { addShape } from '../store/actions/layer';
import { getPagePaperLayer, getLayerAndDescendants, getPaperLayer } from '../store/selectors/layer';
import { applyShapeMethods } from './shapeUtils';
import { paperMain } from './index';
import Tooltip from './tooltip';
import Guide from './guide';
import { DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DEFAULT_GRADIENT_STYLE, THEME_PRIMARY_COLOR } from '../constants';

class ShapeTool {
  ref: paper.Path.Rectangle;
  drawing: boolean;
  tool: paper.Tool;
  shapeType: em.ShapeType;
  outline: paper.Path;
  tooltip: Tooltip;
  from: paper.Point;
  to: paper.Point;
  pointDiff: paper.Point;
  dims: paper.Size;
  maxDim: number;
  constrainedDims: paper.Point;
  centerPoint: paper.Point;
  shiftModifier: boolean;
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
  toBounds: paper.Rectangle;
  constructor(shapeType: em.ShapeType) {
    this.ref = null;
    this.drawing = false;
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.onMouseMove = (e: paper.ToolEvent): void => this.onMouseMove(e);
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.shapeType = shapeType;
    this.outline = null;
    this.tooltip = null;
    this.from = null;
    this.to = null;
    this.pointDiff = new Point(0, 0);
    this.dims = new Size(0, 0);
    this.maxDim = 0;
    this.constrainedDims = new Point(0, 0);
    this.centerPoint = new Point(0, 0);
    this.shiftModifier = false;
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
    this.toBounds = null;
  }
  updateRef() {
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = new paperMain.Path.Rectangle({
      rectangle: this.toBounds,
      strokeColor: THEME_PRIMARY_COLOR
    });
    this.ref.removeOn({
      drag: true,
      up: true
    });
  }
  renderShape(shapeOpts: any) {
    let shape;
    switch(this.shapeType) {
      case 'Rectangle':
        shape = new paperMain.Path.Rectangle({
          from: this.from,
          to: this.to,
          ...shapeOpts
        });
        break;
      case 'Ellipse':
        shape = new paperMain.Path.Ellipse({
          from: this.from,
          to: this.to,
          ...shapeOpts
        });
        break;
      case 'Rounded':
        shape = new paperMain.Path.Rectangle({
          from: this.from,
          to: this.to,
          radius: 8,
          ...shapeOpts
        });
        break;
      case 'Polygon':
        shape = new paperMain.Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: 5,
          ...shapeOpts
        });
        break;
      case 'Star':
        shape = new paperMain.Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) / 2,
          points: 5,
          ...shapeOpts
        });
        break;
    }
    shape.bounds.width = this.toBounds.width;
    shape.bounds.height = this.toBounds.height;
    shape.position = this.toBounds.center;
    return shape;
  }
  updateTooltip(): void {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.toBounds.width)} x ${Math.round(this.toBounds.height)}`, this.to, {drag: true, up: true});
  }
  updateOutline(): void {
    if (this.outline) {
      this.outline.remove();
    }
    this.outline = this.renderShape({
      strokeColor: THEME_PRIMARY_COLOR
    });
    this.outline.removeOn({
      drag: true,
      up: true
    });
  }
  updateGuide(guide: Guide, point1: paper.Point, point2: paper.Point) {
    if (guide) {
      guide.paperLayer.remove();
    }
    guide = new Guide(point1, point2, { up: true, drag: true, move: true });
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
    const xSnapBounds = this.drawing ? [{side: 'left', point: this.toBounds.left}] : [{side: 'left', point: this.toBounds.left}, {side: 'right', point: this.toBounds.right}];
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
    const ySnapBounds = [{side: 'top', point: this.toBounds.top}];
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
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.outline) {
          this.toBounds = new paperMain.Rectangle({
            from: this.from,
            to: this.shiftModifier ? this.constrainedDims : this.to
          });
          this.updateTooltip();
          this.updateOutline();
          this.updateRef();
        }
        break;
      }
      case 'escape': {
        if (this.tooltip) {
          this.tooltip.paperLayer.remove();
        }
        if (this.outline) {
          this.outline.remove();
        }
        store.dispatch(enableSelectionTool());
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.outline) {
          this.toBounds = new paperMain.Rectangle({
            from: this.from,
            to: this.shiftModifier ? this.constrainedDims : this.to
          });
          this.updateTooltip();
          this.updateOutline();
          this.updateRef();
        }
        break;
      }
    }
  }
  onMouseMove(event: paper.ToolEvent): void {
    if (!this.drawing) {
      const state = store.getState();
      this.snapPoints = state.layer.present.inView.snapPoints;
      this.toBounds = new paperMain.Rectangle({
        point: event.point,
        size: new paperMain.Size(4, 4)
      });
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
              snapBounds.center.x = this.snap.x.snapPoint.point + (this.toBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = this.snap.x.snapPoint.point;
              break;
            case 'right':
              snapBounds.center.x = this.snap.x.snapPoint.point - (this.toBounds.width / 2);
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
              snapBounds.center.x = closestXSnap.snapPoint.point + (this.toBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              snapBounds.center.x = closestXSnap.snapPoint.point - (this.toBounds.width / 2);
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
              snapBounds.center.y = this.snap.y.snapPoint.point + (this.toBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = this.snap.y.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.center.y = this.snap.y.snapPoint.point - (this.toBounds.height / 2);
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
              snapBounds.center.y = closestYSnap.snapPoint.point + (this.toBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              snapBounds.center.y = closestYSnap.snapPoint.point - (this.toBounds.height / 2);
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
      this.updateGuides();
      this.updateRef();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.drawing = true;
    const from = event.point;
    if (this.snap.x) {
      from.x = this.snap.x.snapPoint.point;
    }
    if (this.snap.y) {
      from.y = this.snap.y.snapPoint.point;
    }
    this.from = from;
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.to = event.point;
    this.pointDiff = new Point(this.to.x - this.from.x, this.to.y - this.from.y);
    this.dims = new Size(this.pointDiff.x < 0 ? this.pointDiff.x * -1 : this.pointDiff.x, this.pointDiff.y < 0 ? this.pointDiff.y * -1 : this.pointDiff.y);
    this.maxDim = Math.max(this.dims.width, this.dims.height);
    this.constrainedDims = new Point(this.pointDiff.x < 0 ? this.from.x - this.maxDim : this.from.x + this.maxDim, this.pointDiff.y < 0 ? this.from.y - this.maxDim : this.from.y + this.maxDim);
    //this.centerPoint = new Point((this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2);
    this.toBounds = new paperMain.Rectangle({
      from: this.from,
      to: this.shiftModifier ? this.constrainedDims : this.to
    });
    // const snapBounds = this.toBounds.clone();
    // if (this.snap.x) {
    //   // check if event delta will exceed X snap point min/max threshold
    //   if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
    //     // if exceeded, adjust selection bounds...
    //     // clear X snap, and reset X snap threshold
    //     this.snap.x = null;
    //   } else {
    //     switch(this.snap.x.boundsSide) {
    //       case 'left':
    //         snapBounds.left = this.snap.x.snapPoint.point;
    //         break;
    //       case 'right':
    //         snapBounds.right = this.snap.x.snapPoint.point;
    //         break;
    //     }
    //     // if not exceeded, update X snap threshold
    //     this.snap.x.breakThreshold += event.delta.x;
    //   }
    // } else {
    //   const closestXSnap = this.closestXSnapPoint();
    //   // if selection bounds is within 2 units from...
    //   // closest point, snap to that point
    //   if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
    //     switch(closestXSnap.bounds.side) {
    //       case 'left':
    //         snapBounds.left = closestXSnap.snapPoint.point;
    //         break;
    //       case 'right':
    //         snapBounds.right = closestXSnap.snapPoint.point;
    //         break;
    //     }
    //     this.snap.x = {
    //       snapPoint: closestXSnap.snapPoint,
    //       breakThreshold: 0,
    //       boundsSide: closestXSnap.bounds.side as 'left' | 'right' | 'center'
    //     };
    //   }
    // }
    // this.toBounds = snapBounds;
    this.updateGuides();
    this.updateTooltip();
    this.updateOutline();
    this.updateRef();
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.to) {
      const state = store.getState();
      const newPaperLayer = this.renderShape({
        fillColor: new Color(DEFAULT_FILL_STYLE.color),
        strokeColor: new Color(DEFAULT_STROKE_STYLE.color),
        strokeWidth: DEFAULT_STROKE_STYLE.width,
        //applyMatrix: false
      });
      applyShapeMethods(newPaperLayer);
      const overlappedArtboard = getPagePaperLayer(state.layer.present).getItem({
        data: (data: any) => {
          return data.id === 'ArtboardBackground';
        },
        overlapping: this.outline.bounds
      });
      store.dispatch(addShape({
        parent: overlappedArtboard ? overlappedArtboard.parent.data.id : state.layer.present.page,
        frame: {
          x: newPaperLayer.position.x,
          y: newPaperLayer.position.y,
          width: newPaperLayer.bounds.width,
          height: newPaperLayer.bounds.height
        },
        shapeType: this.shapeType,
        paperLayer: newPaperLayer
      }));
      store.dispatch(enableSelectionTool());
    }
  }
}

export default ShapeTool;