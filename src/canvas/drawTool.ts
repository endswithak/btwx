import paper, { Color, Tool } from 'paper';
import { renderDrawingShape, renderDrawingTooltip, getParent } from './utils';
import renderLayer from './base/layer';

const drawTool: {
  tool: paper.Tool;
  drawShapeType: 'artboard' | 'rectangle' | 'ellipse' | 'rounded' | 'polygon' | 'star';
  outline: paper.Path;
  tooltip: paper.PointText;
  from: paper.Point;
  to: paper.Point;
  parent: paper.Layer;
  shiftModifier: boolean;
  dispatch(): void;
  destroy(): void;
  updateTooltip(): void;
  updateOutline(): void;
  create({
    drawShapeType,
    dispatch
  }: {
    drawShapeType: 'artboard' | 'rectangle' | 'ellipse' | 'rounded' | 'polygon' | 'star';
    dispatch: any;
  }): void;
} = {
  tool: null,
  drawShapeType: null,
  outline: null,
  tooltip: null,
  from: null,
  to: null,
  parent: null,
  shiftModifier: false,
  dispatch: null,
  destroy: function() {
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
  },
  updateTooltip: function() {
    if (this.tooltip) {
      this.tooltip.remove();
    }
    this.tooltip = renderDrawingTooltip({
      shape: this.drawShapeType,
      to: this.to,
      from: this.from,
      shiftModifier: this.shiftModifier,
      zoom: paper.view.zoom
    });
  },
  updateOutline: function() {
    if (this.outline) {
      this.outline.remove();
    }
    this.outline = renderDrawingShape({
      shape: this.drawShapeType,
      from: this.from,
      to: this.to,
      shiftModifier: this.shiftModifier,
      shapeOpts: {
        selected: true
      }
    });
  },
  create: function({drawShapeType, dispatch}) {
    this.tool = new Tool();
    this.drawShapeType = drawShapeType;
    this.outline = null;
    this.from = null;
    this.to = null;
    this.parent = null;
    this.shiftModifier = null;
    this.dispatch = dispatch;

    this.tool.onKeyDown = ((event: paper.KeyEvent): void => {
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
    });

    this.tool.onKeyUp = ((event: paper.KeyEvent): void => {
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
    });

    this.tool.onMouseDown = ((event: paper.ToolEvent): void => {
      this.parent = getParent({item: event.item});
      this.from = event.point;
    });

    this.tool.onMouseDrag = ((event: paper.ToolEvent): void => {
      this.to = event.point;
      this.updateTooltip();
      this.updateOutline();
    });

    this.tool.onMouseUp = ((event: paper.ToolEvent): void => {
      if (this.to) {
        renderLayer({
          shape: renderDrawingShape({
            shape: this.drawShapeType,
            from: this.from,
            to: this.to,
            shiftModifier: this.shiftModifier,
            shapeOpts: {
              fillColor: Color.random(),
              name: this.drawShapeType
            }
          }),
          dispatch: this.dispatch,
          layerOpts: {
            name: this.drawShapeType,
            parent: this.parent
          }
        });
        this.destroy();
      }
    });
  }
};

export default drawTool;