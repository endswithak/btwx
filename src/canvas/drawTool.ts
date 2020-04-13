import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { Fill } from './base/style/fill';
import PaperShape from './base/shape';
import PaperApp from './app';

class DrawTool {
  app: PaperApp;
  tool: paper.Tool;
  enabled: boolean;
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
  shiftModifier: boolean;
  shapeCount: {
    rectangle: number;
    rounded: number;
    ellipse: number;
    polygon: number;
    star: number;
  };
  constructor({app}: {app: PaperApp}) {
    this.app = app;
    this.tool = new Tool();
    this.enabled = false;
    this.tool.onKeyDown = (e) => this.onKeyDown(e);
    this.tool.onKeyUp = (e) => this.onKeyUp(e);
    this.tool.onMouseDown = (e) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e) => this.onMouseUp(e);
    this.drawShapeType = 'rectangle';
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
    this.shapeCount = {
      rectangle: 0,
      rounded: 0,
      ellipse: 0,
      polygon: 0,
      star: 0
    };
  }
  clearProps(): void {
    if (this.tooltip) {
      this.tooltip.remove();
    }
    if (this.outline) {
      this.outline.remove();
    }
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
  }
  enable(shape: em.ShapeType): void {
    this.clearProps();
    this.tool.activate();
    this.drawShapeType = shape;
    this.enabled = true;
  }
  disable(): void {
    this.clearProps();
    this.app.selectionTool.tool.activate();
    this.enabled = false;
  }
  updateShapeCount() {
    switch(this.drawShapeType) {
      case 'rectangle':
        this.shapeCount.rectangle++
        break;
      case 'ellipse':
        this.shapeCount.ellipse++
        break;
      case 'rounded':
        this.shapeCount.rounded++
        break;
      case 'polygon':
        this.shapeCount.polygon++
        break;
      case 'star':
        this.shapeCount.star++
        break;
    }
  }
  getShapeCount() {
    switch(this.drawShapeType) {
      case 'rectangle':
        return this.shapeCount.rectangle;
      case 'ellipse':
        return this.shapeCount.ellipse;
      case 'rounded':
        return this.shapeCount.rounded;
      case 'polygon':
        return this.shapeCount.polygon;
      case 'star':
        return this.shapeCount.star;
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
        //this.disable();
        this.app.dispatch({
          type: 'disable-draw-tool'
        });
        break;
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
      // this.app.page.addChild({
      //   node: new PaperShape({
      //     shape: this.renderShape({
      //       name: this.drawShapeType,
      //       insert: false
      //     }),
      //     name: this.drawShapeType,
      //     style: {
      //       fills: [new Fill({})]
      //     }
      //   })
      // });
      this.updateShapeCount();
      this.app.dispatch({
        type: 'add-node',
        node: new PaperShape({
          shape: this.renderShape({
            name: this.drawShapeType,
            insert: false
          }),
          name: `${this.drawShapeType}-${this.getShapeCount()}`,
          style: {
            fills: [new Fill({})]
          }
        }),
        toNode: this.app.page
      });
      this.app.dispatch({
        type: 'disable-draw-tool'
      });
    }
  }
}

export default DrawTool;