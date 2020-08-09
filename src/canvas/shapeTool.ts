import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { v4 as uuidv4 } from 'uuid';
import store from '../store';
import { enableSelectionTool } from '../store/actions/tool';
import { addShape } from '../store/actions/layer';
import { getPagePaperLayer, getLayerAndDescendants, getPaperLayer } from '../store/selectors/layer';
import { applyShapeMethods } from './shapeUtils';
import { paperMain } from './index';
import Tooltip from './tooltip';
import { DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, THEME_PRIMARY_COLOR, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
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
          radius: (this.maxDim / 2) * DEFAULT_ROUNDED_RADIUS,
          ...shapeOpts
        });
        break;
      case 'Polygon':
        shape = new paperMain.Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: DEFAULT_POLYGON_SIDES,
          ...shapeOpts
        });
        break;
      case 'Star':
        shape = new paperMain.Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) * DEFAULT_STAR_RADIUS,
          points: DEFAULT_STAR_POINTS,
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
    const x = this.snapTool.snap.x ? this.snapTool.snap.x.point : this.to.x;
    const y = this.snapTool.snap.y ? this.snapTool.snap.y.point : this.to.y;
    if (this.shiftModifier) {
      if (this.snapTool.snap.x && this.snapTool.snap.y) {
        return;
      } else {
        if (this.snapTool.snap.x) {
          return;
        }
        if (this.snapTool.snap.y) {
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
    this.snapTool.snapBounds = this.toBounds;
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
          this.snapTool.snapBounds = this.toBounds;
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
          this.snapTool.snapBounds = this.toBounds;
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
      this.toBounds = new paperMain.Rectangle({
        point: event.point,
        size: new paperMain.Size(1, 1)
      });
      const snapBounds = this.toBounds.clone();
      this.snapTool.snapPoints = state.layer.present.inView.snapPoints;
      this.snapTool.snapBounds = this.toBounds;
      this.snapTool.updateXSnap({
        event: event,
        snapTo: {
          left: true,
          right: false,
          center: false
        },
        handleSnapped: (snapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'left':
              snapBounds.center.x = snapPoint.point + (this.toBounds.width / 2);
              break;
            case 'center':
              snapBounds.center.x = snapPoint.point;
              break;
            case 'right':
              snapBounds.center.x = snapPoint.point - (this.toBounds.width / 2);
              break;
          }
        },
        handleSnap: (closestXSnap) => {
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
        }
      });
      this.snapTool.updateYSnap({
        event: event,
        snapTo: {
          top: true,
          bottom: false,
          center: false
        },
        handleSnapped: (snapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'top':
              snapBounds.center.y = snapPoint.point + (this.toBounds.height / 2);
              break;
            case 'center':
              snapBounds.center.y = snapPoint.point;
              break;
            case 'bottom':
              snapBounds.center.y = snapPoint.point - (this.toBounds.height / 2);
              break;
          }
        },
        handleSnap: (closestYSnap) => {
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
        }
      });
      this.toBounds = snapBounds;
      this.snapTool.snapBounds = this.toBounds;
      this.snapTool.updateGuides();
      //this.updateRef();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState();
    this.drawing = true;
    this.insertTool.enabled = false;
    const from = event.point;
    if (this.snapTool.snap.x) {
      from.x = this.snapTool.snap.x.point;
    }
    if (this.snapTool.snap.y) {
      from.y = this.snapTool.snap.y.point;
    }
    this.from = new paperMain.Point(from.x, from.y);
    this.snapTool.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => {
      if (snapPoint.axis === 'x') {
        return snapPoint.point !== this.from.x;
      } else {
        return snapPoint.point !== this.from.y;
      }
    });
    this.snapTool.snap.x = null;
    this.snapTool.snap.y = null;
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
    this.snapTool.snapBounds = this.toBounds;
    this.snapTool.updateXSnap({
      event: event,
      snapTo: {
        left: true,
        right: true,
        center: false
      }
    });
    this.snapTool.updateYSnap({
      event: event,
      snapTo: {
        top: true,
        bottom: true,
        center: false
      }
    });
    this.updateToBounds();
    this.updateTooltip();
    this.updateOutline();
    this.snapTool.updateGuides();
    //this.updateRef();
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.to) {
      if (this.to.x - this.from.x !== 0 && this.to.y - this.from.y !== 0) {
        const state = store.getState();
        const id = uuidv4();
        const fill = DEFAULT_FILL_STYLE();
        const stroke = DEFAULT_STROKE_STYLE();
        const paperLayer = this.renderShape({
          fillColor: { hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a },
          strokeColor: { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a },
          strokeWidth: stroke.width,
          data: {
            id: id,
            type: 'Shape'
          }
        });
        const shapeSpecificProps = (() => {
          switch(this.shapeType) {
            case 'Ellipse':
            case 'Rectangle':
              return {};
            case 'Rounded':
              return {
                radius: DEFAULT_ROUNDED_RADIUS
              };
            case 'Star':
              return {
                points: DEFAULT_STAR_POINTS,
                radius: DEFAULT_STAR_RADIUS
              }
            case 'Polygon':
              return {
                sides: DEFAULT_STAR_POINTS
              }
            default:
              return {};
          }
        })();
        store.dispatch(addShape({
          id: id,
          type: 'Shape',
          parent: (() => {
            const overlappedArtboard = getPagePaperLayer(state.layer.present).getItem({
              data: (data: any) => {
                return data.id === 'ArtboardBackground';
              },
              overlapping: this.outline.bounds
            });
            return overlappedArtboard ? overlappedArtboard.parent.data.id : state.layer.present.page;
          })(),
          name: this.shapeType,
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          },
          master: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          },
          shapeType: this.shapeType,
          pathData: paperLayer.pathData,
          selected: false,
          mask: false,
          masked: false,
          tweenEvents: [],
          tweens: [],
          style: DEFAULT_STYLE(),
          transform: DEFAULT_TRANSFORM,
          booleanOperation: 'none',
          closed: true,
          ...shapeSpecificProps
        }));
      }
      store.dispatch(enableSelectionTool());
    }
  }
}

export default ShapeTool;