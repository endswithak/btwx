import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store, { StoreDispatch, StoreGetState } from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool, enableDragTool } from '../store/actions/tool';
import { addShape, setLayerHover, increaseLayerScope, selectLayer, newLayerScope, deselectLayer, moveLayerBy, moveLayersBy, enableLayerDrag, disableLayerDrag, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';

class DrawTool {
  getState: StoreGetState;
  dispatch: StoreDispatch;
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
  shiftModifier: boolean;
  constructor({drawShapeType}: {drawShapeType: em.ShapeType}) {
    this.getState = store.getState;
    this.dispatch = store.dispatch;
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
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
    this.shiftModifier = false;
  }
  renderShape(shapeOpts: any) {
    switch(this.drawShapeType) {
      case 'Rectangle':
        return new Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          ...shapeOpts
        });
      case 'Ellipse':
        return new Path.Ellipse({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          ...shapeOpts
        });
      case 'Rounded':
        return new Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          radius: 8,
          ...shapeOpts
        });
      case 'Polygon':
        return new Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: 5,
          ...shapeOpts
        });
      case 'Star':
        return new Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) / 2,
          points: 5,
          ...shapeOpts
        });
    }
  }
  renderTooltip(tooltipOpts: any) {
    const baseProps = {
      point: [this.to.x + (30 / paper.view.zoom), this.to.y + (30 / paper.view.zoom)],
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paper.view.zoom,
      ...tooltipOpts
    }
    switch(this.drawShapeType) {
      case 'Rectangle':
      case 'Ellipse':
      case 'Rounded':
        return new PointText({
          ...baseProps,
          content: `${Math.round(this.shiftModifier ? this.maxDim : this.dims.width)} x ${Math.round(this.shiftModifier ? this.maxDim : this.dims.height)}`,
        });
      case 'Polygon':
      case 'Star':
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
    this.tooltip = this.renderTooltip({});
    this.tooltip.removeOn({
      drag: true,
      up: true
    });
  }
  updateOutline(): void {
    if (this.outline) {
      this.outline.remove();
    }
    this.outline = this.renderShape({
      selected: true,
    });
    this.outline.removeOn({
      drag: true,
      up: true
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
        if (this.tooltip) {
          this.tooltip.remove();
        }
        if (this.outline) {
          this.outline.remove();
        }
        this.dispatch(enableSelectionTool());
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
      const state = this.getState();
      const newPaperLayer = this.renderShape({
        fillColor: '#ccc',
        strokeColor: '#999',
        strokeWidth: 1,
        onMouseEnter: function(e: paper.MouseEvent) {
          const state = store.getState();
          const layer = getLayerByPaperId(state.layer, this.id);
          const nearestScopeAncestor = getNearestScopeAncestor(state.layer, layer.id);
          store.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
        },
        onMouseLeave: function(e: paper.MouseEvent) {
          store.dispatch(setLayerHover({id: null}));
        },
        onDoubleClick: function(e: paper.MouseEvent) {
          const state = store.getState();
          const layer = getLayerByPaperId(state.layer, this.id);
          store.dispatch(deepSelectLayer({id: layer.id}));
        },
        onMouseDown: function(e: paper.MouseEvent) {
          const state = store.getState();
          const layer = getLayerByPaperId(state.layer, this.id);
          const nearestScopeAncestor = getNearestScopeAncestor(state.layer, layer.id);
          if (e.modifiers.shift) {
            if (layer.selected) {
              store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
            } else {
              store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
            }
          } else {
            if (!state.layer.selected.includes(nearestScopeAncestor.id)) {
              store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
            }
          }
        }
      });
      this.dispatch(addShape({
        parent: state.layer.scope.length > 0 ? state.layer.scope[state.layer.scope.length - 1] : state.layer.page,
        frame: {
          x: newPaperLayer.position.x,
          y: newPaperLayer.position.y,
          width: newPaperLayer.bounds.width,
          height: newPaperLayer.bounds.height
        },
        shapeType: this.drawShapeType,
        paperLayer: newPaperLayer.id
      }));
      this.dispatch(enableSelectionTool());
    }
  }
}

export default DrawTool;