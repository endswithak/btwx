import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool } from '../store/actions/tool';
import { addArtboard } from '../store/actions/layer';
import { applyArtboardMethods } from './artboardUtils';
import { paperMain } from './index';
import Tooltip from './tooltip';
import SnapTool from './snapTool';
import InsertTool from './insertTool';
import { DEFAULT_ARTBOARD_BACKGROUND_COLOR, THEME_PRIMARY_COLOR } from '../constants';

class ArtboardTool {
  tool: paper.Tool;
  drawing: boolean;
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
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.onMouseMove = (e: paper.ToolEvent): void => this.onMouseMove(e);
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.drawing = false;
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
  renderShape(shapeOpts: any): paper.Path.Rectangle {
    const shape = new paperMain.Path.Rectangle({
      from: this.from,
      to: this.shiftModifier ? this.constrainedDims : this.to,
      ...shapeOpts
    });
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
  updateToBounds(): void {
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
    const state = store.getState();
    if (!state.artboardPresetEditor.isOpen) {
      this.insertTool.onKeyDown(event);
    }
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
    const state = store.getState();
    if (!state.artboardPresetEditor.isOpen) {
      this.insertTool.onKeyUp(event);
    }
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
        size: new paperMain.Size(4, 4)
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
    this.pointDiff = new Point(this.to.x - this.from.x, this.to.y - this.from.y);
    this.dims = new Size(this.pointDiff.x < 0 ? this.pointDiff.x * -1 : this.pointDiff.x, this.pointDiff.y < 0 ? this.pointDiff.y * -1 : this.pointDiff.y);
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
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.to) {
      if (this.to.x - this.from.x !== 0 && this.to.y - this.from.y !== 0) {
        const state = store.getState();
        const newPaperLayer = this.renderShape({
          fillColor: new Color(DEFAULT_ARTBOARD_BACKGROUND_COLOR),
        });
        applyArtboardMethods(newPaperLayer);
        store.dispatch(addArtboard({
          parent: state.layer.present.page,
          frame: {
            x: newPaperLayer.position.x,
            y: newPaperLayer.position.y,
            width: newPaperLayer.bounds.width,
            height: newPaperLayer.bounds.height,
            innerWidth: newPaperLayer.bounds.width,
            innerHeight: newPaperLayer.bounds.height
          },
          paperLayer: newPaperLayer
        }));
      }
      store.dispatch(enableSelectionTool());
    }
  }
}

export default ArtboardTool;