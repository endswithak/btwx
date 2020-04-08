import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import PaperLayer from './base/layer';
import { Fill } from './base/style/fill';

class DrawTool {
  tool: paper.Tool;
  drawShapeType: em.ShapeType;
  outline: paper.Path;
  tooltip: paper.PointText;
  from: paper.Point;
  to: paper.Point;
  pointDiff: paper.Point;
  dims: paper.Size;
  maxDim: number;
  constrainedDims: paper.Point;
  centerPoint: paper.Point;
  parent: paper.Layer;
  shiftModifier: boolean;
  dispatch: any;
  constructor(drawShapeType: em.ShapeType, dispatch: any) {
    this.tool = new Tool();
    this.tool.onKeyDown = (e) => this.onKeyDown(e);
    this.tool.onKeyUp = (e) => this.onKeyUp(e);
    this.tool.onMouseDown = (e) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e) => this.onMouseUp(e);
    this.drawShapeType = drawShapeType;
    this.outline = null;
    this.tooltip = null;
    this.from = null;
    this.to = null;
    this.pointDiff = new Point(0, 0);
    this.dims = new Size(0, 0);
    this.maxDim = 0;
    this.constrainedDims = new Point(0, 0);
    this.centerPoint = new Point(0, 0);
    this.parent = null;
    this.shiftModifier = false;
    this.dispatch = dispatch;
  }
  destroy(): void {
    if (this.tooltip) {
      this.tooltip.remove();
    }
    if (this.outline) {
      this.outline.remove();
    }
    if (this.tool) {
      this.tool.remove();
    }
    if (this.dispatch) {
      this.dispatch({
        type: 'disable-draw-shape'
      });
    }
  }
  renderShape(shapeOpts: any) {
    switch(this.drawShapeType) {
      case 'rectangle':
        return new Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          ...shapeOpts
        });
      case 'ellipse':
        return new Path.Ellipse({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          ...shapeOpts
        });
      case 'rounded':
        return new Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          radius: 8,
          ...shapeOpts
        });
      case 'polygon':
        return new Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: 5,
          ...shapeOpts
        });
      case 'star':
        return new Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) / 2,
          points: 5,
          ...shapeOpts
        });
    }
  }
  renderTooltip() {
    const baseProps = {
      point: [this.to.x + (30 / paper.view.zoom), this.to.y + (30 / paper.view.zoom)],
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paper.view.zoom
    }
    switch(this.drawShapeType) {
      case 'rectangle':
      case 'ellipse':
      case 'rounded':
        return new PointText({
          ...baseProps,
          content: `${Math.round(this.shiftModifier ? this.maxDim : this.dims.width)} x ${Math.round(this.shiftModifier ? this.maxDim : this.dims.height)}`,
        });
      case 'polygon':
      case 'star':
        return new PointText({
          ...baseProps,
          content: `${Math.round(this.maxDim)} x ${Math.round(this.maxDim)}`
        });
    }
  }
  updateTooltip(): void {
    if (this.tooltip) {
      this.tooltip.remove();
    }
    this.tooltip = this.renderTooltip();
  }
  updateOutline(): void {
    if (this.outline) {
      this.outline.remove();
    }
    this.outline = this.renderShape({
      selected: true
    });
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.outline) {
          this.updateTooltip();
          this.updateOutline();
        }
        break;
      }
      case 'escape': {
        this.destroy();
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.outline) {
          this.updateTooltip();
          this.updateOutline();
        }
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    //this.parent = getParent({item: event.item});
    this.from = event.point;
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.to = event.point;
    this.pointDiff = new Point(this.to.x - this.from.x, this.to.y - this.from.y);
    this.dims = new Size(this.pointDiff.x < 0 ? this.pointDiff.x * -1 : this.pointDiff.x, this.pointDiff.y < 0 ? this.pointDiff.y * -1 : this.pointDiff.y);
    this.maxDim = Math.max(this.dims.width, this.dims.height);
    this.constrainedDims = new Point(this.pointDiff.x < 0 ? this.from.x - this.maxDim : this.from.x + this.maxDim, this.pointDiff.y < 0 ? this.from.y - this.maxDim : this.from.y + this.maxDim);
    this.centerPoint = new Point((this.from.x + this.to.x) / 2, (this.from.y + this.to.y) / 2);
    this.updateTooltip();
    this.updateOutline();
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.to) {
      paper.project.deselectAll();
      new PaperLayer({
        shape: this.renderShape({
          fillColor: Color.random(),
          name: this.drawShapeType
        }),
        isGroup: false,
        layerOpts: {
          name: this.drawShapeType,
          parent: this.parent
        },
        dispatch: this.dispatch,
        style: {
          fills: [new Fill({})]
        }
      });
      this.destroy();
    }
  }
}

export default DrawTool;