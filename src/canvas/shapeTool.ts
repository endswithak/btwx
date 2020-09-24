import store from '../store';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { addShapeThunk } from '../store/actions/layer';
import { getPagePaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import { isBetween } from '../utils';
import Tooltip from './tooltip';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, THEME_PRIMARY_COLOR, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import SnapTool from './snapTool';

class ShapeTool {
  ref: paper.Path.Rectangle;
  drawing: boolean;
  tool: paper.Tool;
  shapeType: em.ShapeType;
  pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  outline: paper.Path;
  tooltip: Tooltip;
  from: paper.Point;
  x: number;
  y: number;
  to: paper.Point;
  vector: paper.Point;
  dims: paper.Size;
  maxDim: number;
  constrainedDims: paper.Point;
  centerPoint: paper.Point;
  shiftModifier: boolean;
  snapTool: SnapTool;
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
    this.vector = null;
    this.dims = null;
    this.maxDim = 0;
    this.x = 0;
    this.y = 0;
    this.constrainedDims = new paperMain.Point(0, 0);
    this.centerPoint = new paperMain.Point(0, 0);
    this.shiftModifier = false;
    this.snapTool = new SnapTool();
    this.toBounds = null;
  }
  disable() {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    if (this.outline) {
      this.outline.remove();
    }
    this.snapTool.removeGuides();
    store.dispatch(setCanvasDrawing({drawing: false}));
    store.dispatch(toggleShapeToolThunk(this.shapeType) as any);
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
    switch(this.shapeType) {
      case 'Rectangle':
        return new paperMain.Path.Rectangle({
          from: this.toBounds.topLeft,
          to: this.toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Ellipse':
        return new paperMain.Path.Ellipse({
          from: this.toBounds.topLeft,
          to: this.toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Rounded':
        return new paperMain.Path.Rectangle({
          from: this.toBounds.topLeft,
          to: this.toBounds.bottomRight,
          radius: (this.maxDim / 2) * DEFAULT_ROUNDED_RADIUS,
          ...shapeOpts
        });
      case 'Polygon': {
        const shape = new paperMain.Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: DEFAULT_POLYGON_SIDES,
          ...shapeOpts
        });
        shape.bounds.width = this.toBounds.width;
        shape.bounds.height = this.toBounds.height;
        shape.position = this.toBounds.center;
        return shape;
      }
      case 'Star': {
        const shape = new paperMain.Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) * DEFAULT_STAR_RADIUS,
          points: DEFAULT_STAR_POINTS,
          ...shapeOpts
        });
        shape.bounds.width = this.toBounds.width;
        shape.bounds.height = this.toBounds.height;
        shape.position = this.toBounds.center;
        return shape;
      }
      case 'Line': {
        const isHorizontal = isBetween(this.vector.angle, 0, 45) || isBetween(this.vector.angle, -45, 0) || isBetween(this.vector.angle, 135, 180) || isBetween(this.vector.angle, -180, -135);
        const isVertical = isBetween(this.vector.angle, -90, -45) || isBetween(this.vector.angle, -135, -90) || isBetween(this.vector.angle, 45, 90) || isBetween(this.vector.angle, 90, 135);
        const lineTo = (() => {
          if (this.shiftModifier) {
            if (isHorizontal) {
              return new paperMain.Point(this.snapTool.snap.x ? this.snapTool.snap.x.point : this.to.x, this.from.y);
            } else if (isVertical) {
              return new paperMain.Point(this.from.x, this.snapTool.snap.y ? this.snapTool.snap.y.point : this.to.y);
            } else {
              return this.to;
            }
          } else {
            return this.to;
          }
        })();
        const shape = new paperMain.Path.Line({
          from: this.from,
          to: lineTo,
          ...shapeOpts
        });
        if (this.shiftModifier) {
          if (isVertical) {
            this.toBounds.width = 1;
            this.snapTool.snapBounds = this.toBounds;
          }
          if (isHorizontal) {
            this.toBounds.height = 1;
            this.snapTool.snapBounds = this.toBounds;
          }
        } else {
          shape.bounds.width = this.toBounds.width;
          shape.bounds.height = this.toBounds.height;
          shape.position = this.toBounds.center;
        }
        return shape;
      }
    }
  }
  updateTooltip(): void {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.toBounds.width)} x ${Math.round(this.toBounds.height)}`, this.to, {up: true});
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
      up: true
    });
  }
  updateToBounds() {
    const x = this.snapTool.snap.x ? this.snapTool.snap.x.point : this.to.x;
    const y = this.snapTool.snap.y ? this.snapTool.snap.y.point : this.to.y;
    if (this.shiftModifier) {
      const xSnap = this.snapTool.snap.x;
      const ySnap = this.snapTool.snap.y;
      const setXSnapBounds = () => {
        const newSize = Math.abs(xSnap.point - this.from.x);
        this.toBounds = new paperMain.Rectangle({
          from: this.from,
          to: new paperMain.Point(xSnap.point, (() => {
            switch(this.pivot) {
              case 'bottomLeft':
              case 'bottomRight':
                return this.from.y - newSize;
              case 'topLeft':
              case 'topRight':
                return this.from.y + newSize;
            }
          })())
        });
      }
      const setYSnapBounds = () => {
        const newSize = Math.abs(ySnap.point - this.from.y);
        this.toBounds = new paperMain.Rectangle({
          from: this.from,
          to: new paperMain.Point((() => {
            switch(this.pivot) {
              case 'bottomLeft':
              case 'topLeft':
                return this.from.x + newSize;
              case 'bottomRight':
              case 'topRight':
                return this.from.x - newSize;
            }
          })(), ySnap.point)
        });
      }
      if (xSnap && ySnap) {
        const xMax = Math.max(xSnap.point, this.toBounds[xSnap.boundsSide as 'left' | 'right']);
        const xMin = Math.min(xSnap.point, this.toBounds[xSnap.boundsSide as 'left' | 'right']);
        const yMax = Math.max(ySnap.point, this.toBounds[ySnap.boundsSide as 'top' | 'bottom']);
        const yMin = Math.min(ySnap.point, this.toBounds[ySnap.boundsSide as 'top' | 'bottom']);
        const xSnapDistance = xMax - xMin;
        const ySnapDistance = yMax - yMin;
        const closestSnapPoint: 'x' | 'y' = xSnapDistance <= ySnapDistance ? 'x' : 'y';
        switch(closestSnapPoint) {
          case 'x':
            setXSnapBounds();
            break;
          case 'y':
            setYSnapBounds();
            break;
        }
      } else {
        if (xSnap) {
          setXSnapBounds();
        }
        if (ySnap) {
          setYSnapBounds();
        }
      }
    } else {
      this.toBounds = new paperMain.Rectangle({
        from: this.from,
        to: new paperMain.Point(x, y)
      });
    }
    this.snapTool.snapBounds = this.toBounds;
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.outline) {
          this.updateToBounds();
          this.updateOutline();
          this.updateTooltip();
          this.snapTool.updateGuides();
          //this.updateRef();
        }
        break;
      }
      case 'escape': {
        this.disable();
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.outline) {
          this.updateToBounds();
          this.updateOutline();
          this.updateTooltip();
          this.snapTool.updateGuides();
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
              this.toBounds.center.x = snapPoint.point + (this.toBounds.width / 2);
              break;
            case 'center':
              this.toBounds.center.x = snapPoint.point;
              break;
            case 'right':
              this.toBounds.center.x = snapPoint.point - (this.toBounds.width / 2);
              break;
          }
        },
        handleSnap: (closestXSnap) => {
          switch(closestXSnap.bounds.side) {
            case 'left':
              this.toBounds.center.x = closestXSnap.snapPoint.point + (this.toBounds.width / 2);
              break;
            case 'center':
              this.toBounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              this.toBounds.center.x = closestXSnap.snapPoint.point - (this.toBounds.width / 2);
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
              this.toBounds.center.y = snapPoint.point + (this.toBounds.height / 2);
              break;
            case 'center':
              this.toBounds.center.y = snapPoint.point;
              break;
            case 'bottom':
              this.toBounds.center.y = snapPoint.point - (this.toBounds.height / 2);
              break;
          }
        },
        handleSnap: (closestYSnap) => {
          switch(closestYSnap.bounds.side) {
            case 'top':
              this.toBounds.center.y = closestYSnap.snapPoint.point + (this.toBounds.height / 2);
              break;
            case 'center':
              this.toBounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              this.toBounds.center.y = closestYSnap.snapPoint.point - (this.toBounds.height / 2);
              break;
          }
        }
      });
      this.snapTool.updateGuides();
      //this.updateRef();
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState();
    store.dispatch(setCanvasDrawing({drawing: true}));
    this.drawing = true;
    this.from = new paperMain.Point((
      this.snapTool.snap.x ? this.snapTool.snap.x.point : event.point.x
    ),(
      this.snapTool.snap.y ? this.snapTool.snap.y.point : event.point.y
    ));
    this.snapTool.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => {
      if (snapPoint.axis === 'x') {
        return !isBetween(snapPoint.point, this.from.x - 1, this.from.x + 1);
      }
      if (snapPoint.axis === 'y') {
        return !isBetween(snapPoint.point, this.from.y - 1, this.from.y + 1);
      }
    });
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.x += event.delta.x;
    this.y += event.delta.y;
    this.pivot = `${this.y < 0 ? 'bottom' : 'top'}${this.x < 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    this.to = event.point;
    this.vector = this.to.subtract(this.from);
    this.dims = new paperMain.Rectangle({from: this.from, to: this.to}).size;
    this.maxDim = Math.max(this.dims.width, this.dims.height);
    this.constrainedDims = new paperMain.Point(this.vector.x < 0 ? this.from.x - this.maxDim : this.from.x + this.maxDim, this.vector.y < 0 ? this.from.y - this.maxDim : this.from.y + this.maxDim);
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
    this.updateOutline();
    this.updateTooltip();
    this.snapTool.updateGuides();
    //this.updateRef();
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.to) {
      if (this.to.x - this.from.x !== 0 || this.to.y - this.from.y !== 0) {
        const state = store.getState();
        const paperLayer = this.renderShape({
          insert: false
        });
        const fromPoint = (paperLayer as paper.Path).firstSegment.point;
        const toPoint = (paperLayer as paper.Path).lastSegment.point;
        const vector = toPoint.subtract(fromPoint);
        store.dispatch(addShapeThunk({
          layer: {
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
              height: paperLayer.bounds.height,
              innerWidth: this.shapeType === 'Line' ? vector.length : paperLayer.bounds.width,
              innerHeight: this.shapeType === 'Line' ? 0 : paperLayer.bounds.height
            },
            shapeType: this.shapeType,
            style: {
              ...DEFAULT_STYLE,
              fill: {
                ...DEFAULT_STYLE.fill,
                enabled: this.shapeType !== 'Line'
              }
            },
            transform: {
              ...DEFAULT_TRANSFORM,
              rotation: this.shapeType === 'Line' ? vector.angle : DEFAULT_TRANSFORM.rotation
            },
            pathData: paperLayer.pathData,
            ...(() => {
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
                case 'Line':
                  return {
                    from: {
                      x: (fromPoint.x - paperLayer.position.x) / vector.length,
                      y: (fromPoint.y - paperLayer.position.y) / vector.length
                    },
                    to: {
                      x: (toPoint.x - paperLayer.position.x) / vector.length,
                      y: (toPoint.y - paperLayer.position.y) / vector.length
                    }
                  }
                default:
                  return {};
              }
            })()
          }
        }) as any);
      }
    }
    this.disable();
  }
}

export default ShapeTool;