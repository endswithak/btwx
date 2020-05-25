import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool, enableDragTool } from '../store/actions/tool';
import { addShape, setLayerHover, increaseLayerScope, selectLayer, newLayerScope, deselectLayer, moveLayerBy, moveLayersBy, enableLayerDrag, disableLayerDrag, deepSelectLayer, openAnimationSelect, closeAnimationSelect } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer, getLayer, getPagePaperLayer } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { applyShapeMethods } from './shapeUtils';
import { paperMain } from './index';
import Tooltip from './tooltip';

class DrawTool {
  tool: paper.Tool;
  drawShapeType: em.ShapeType;
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
  constructor({drawShapeType}: {drawShapeType: em.ShapeType}) {
    this.tool = new paperMain.Tool();
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
        return new paperMain.Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          //applyMatrix: false,
          ...shapeOpts
        });
      case 'Ellipse':
        return new paperMain.Path.Ellipse({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          //applyMatrix: false,
          ...shapeOpts
        });
      case 'Rounded':
        return new paperMain.Path.Rectangle({
          from: this.from,
          to: this.shiftModifier ? this.constrainedDims : this.to,
          radius: 8,
          //applyMatrix: false,
          ...shapeOpts
        });
      case 'Polygon':
        return new paperMain.Path.RegularPolygon({
          center: this.centerPoint,
          radius: this.maxDim / 2,
          sides: 5,
          //applyMatrix: false,
          ...shapeOpts
        });
      case 'Star':
        return new paperMain.Path.Star({
          center: this.centerPoint,
          radius1: this.maxDim / 2,
          radius2: (this.maxDim / 2) / 2,
          points: 5,
          //applyMatrix: false,
          ...shapeOpts
        });
    }
  }
  updateTooltip(): void {
    let tooltipContent;
    switch(this.drawShapeType) {
      case 'Rectangle':
      case 'Ellipse':
      case 'Rounded':
        tooltipContent = `${Math.round(this.shiftModifier ? this.maxDim : this.dims.width)} x ${Math.round(this.shiftModifier ? this.maxDim : this.dims.height)}`;
        break;
      case 'Polygon':
      case 'Star':
        tooltipContent = `${Math.round(this.maxDim)} x ${Math.round(this.maxDim)}`;
        break;
    }
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(tooltipContent, this.to, {drag: true, up: true});
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
      const state = store.getState();
      const newPaperLayer = this.renderShape({
        fillColor: new Color('#cccccc'),
        strokeColor: new Color('#999999'),
        strokeWidth: 1,
        //applyMatrix: false
      });
      applyShapeMethods(newPaperLayer);
      const overlappedLayers = getPaperLayer(state.layer.present.page).getItems({
        data: (data: any) => {
          if (data.id === 'ArtboardBackground') {
            return true;
          } else {
            const topParent = getNearestScopeAncestor(state.layer.present, data.id);
            return topParent.id === data.id;
          }
        },
        overlapping: this.outline.bounds
      });
      const artboardOverlapped = () => {
        if (overlappedLayers.length > 0 && overlappedLayers.some((item) => item.data.id === 'ArtboardBackground')) {
          const firstArtboard = overlappedLayers.find((item) => item.data.id === 'ArtboardBackground');
          return firstArtboard.parent.data.id;
        } else {
          return false;
        }
      }
      store.dispatch(addShape({
        parent: state.layer.present.scope.length > 0 ? state.layer.present.scope[state.layer.present.scope.length - 1] : artboardOverlapped() ? artboardOverlapped() : state.layer.present.page,
        frame: {
          x: newPaperLayer.position.x,
          y: newPaperLayer.position.y,
          width: newPaperLayer.bounds.width,
          height: newPaperLayer.bounds.height
        },
        shapeType: this.drawShapeType,
        paperLayer: newPaperLayer
      }));
      store.dispatch(enableSelectionTool());
    }
  }
}

export default DrawTool;