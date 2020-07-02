import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool } from '../store/actions/tool';
import { addShape } from '../store/actions/layer';
import { getPagePaperLayer, getLayerAndDescendants, getPaperLayer } from '../store/selectors/layer';
import { applyShapeMethods } from './shapeUtils';
import { paperMain } from './index';
import Tooltip from './tooltip';
import { DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DEFAULT_GRADIENT_STYLE, THEME_PRIMARY_COLOR } from '../constants';
import SnapTool from './snapTool';
import InsertTool from './insertTool';

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
  snapTool: SnapTool;
  snap: {
    x: em.SnapPoint;
    y: em.SnapPoint;
  };
  snapPoints: em.SnapPoint[];
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
  toBounds: paper.Rectangle;
  insertTool: InsertTool;
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
    this.snapTool = new SnapTool();
    this.snapBreakThreshholdMin = -8;
    this.snapBreakThreshholdMax = 8;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.toBounds = null;
    this.insertTool = new InsertTool();
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
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom
    });
    this.outline.removeOn({
      drag: true,
      up: true
    });
  }
  updateToBounds() {
    const x = this.snap.x ? this.snap.x.point : this.to.x;
    const y = this.snap.y ? this.snap.y.point : this.to.y;
    if (this.shiftModifier) {
      if (this.snap.x && this.snap.y) {
        return;
      } else {
        if (this.snap.x) {
          return;
        }
        if (this.snap.y) {
          return;
        }
      }
      return;
    } else {
      this.toBounds = new paperMain.Rectangle({
        from: this.from,
        to: new paperMain.Point(x, y)
      });
    }
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.insertTool.onKeyDown(event);
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
          //this.updateRef();
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
    this.insertTool.onKeyUp(event);
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
          //this.updateRef();
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
              snapBounds.center.x = this.snap.x.point + (this.toBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = this.snap.x.point;
              break;
            case 'right':
              snapBounds.center.x = this.snap.x.point - (this.toBounds.width / 2);
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
            right: false,
            center: false
          }
        });
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
            ...closestXSnap.snapPoint,
            breakThreshold: 0,
            boundsSide: closestXSnap.bounds.side
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
              snapBounds.center.y = this.snap.y.point + (this.toBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = this.snap.y.point;
              break;
            case 'bottom':
              snapBounds.center.y = this.snap.y.point - (this.toBounds.height / 2);
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
            bottom: false,
            center: false
          }
        });
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
            ...closestYSnap.snapPoint,
            breakThreshold: 0,
            boundsSide: closestYSnap.bounds.side
          };
        }
      }
      this.toBounds = snapBounds;
      this.snapTool.updateGuides({
        snapPoints: this.snapPoints,
        bounds: this.toBounds,
        xSnap: this.snap.x,
        ySnap: this.snap.y
      });
      //this.updateRef();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.drawing = true;
    this.insertTool.enabled = false;
    const from = event.point;
    if (this.snap.x) {
      from.x = this.snap.x.point;
    }
    if (this.snap.y) {
      from.y = this.snap.y.point;
    }
    this.from = from;
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.to = event.point;
    this.pointDiff = new paperMain.Point(this.to.x - this.from.x, this.to.y - this.from.y);
    this.dims = new paperMain.Size(this.pointDiff.x < 0 ? this.pointDiff.x * -1 : this.pointDiff.x, this.pointDiff.y < 0 ? this.pointDiff.y * -1 : this.pointDiff.y);
    this.maxDim = Math.max(this.dims.width, this.dims.height);
    this.constrainedDims = new Point(this.pointDiff.x < 0 ? this.from.x - this.maxDim : this.from.x + this.maxDim, this.pointDiff.y < 0 ? this.from.y - this.maxDim : this.from.y + this.maxDim);
    this.toBounds = new paperMain.Rectangle({
      from: this.from,
      to: this.shiftModifier ? this.constrainedDims : this.to
    });
    if (this.snap.x) {
      // check if event delta will exceed X snap point min/max threshold
      if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
        // if exceeded, adjust selection bounds...
        // clear X snap, and reset X snap threshold
        this.snap.x = null;
      } else {
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
          center: false
        }
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        this.snap.x = {
          ...closestXSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestXSnap.bounds.side
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
          center: false
        }
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestYSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        this.snap.y = {
          ...closestYSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestYSnap.bounds.side
        };
      }
    }
    this.updateToBounds();
    this.snapTool.updateGuides({
      snapPoints: this.snapPoints,
      bounds: this.toBounds,
      xSnap: this.snap.x,
      ySnap: this.snap.y
    });
    this.updateTooltip();
    this.updateOutline();
    //this.updateRef();
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