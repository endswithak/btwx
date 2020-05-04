import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store, { StoreDispatch, StoreGetState } from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool } from '../store/actions/tool';
import { addShape, setLayerHover, increaseLayerScope, selectLayer, newLayerScope, deselectLayer, moveLayerBy, moveLayersBy, enableLayerDrag, disableLayerDrag } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';

class DragTool {
  tool: paper.Tool;
  from: paper.Point;
  to: paper.Point;
  shiftModifier: boolean;
  constructor() {
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {

  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {
    const state = store.getState();
    if (state.layer.selected.length > 0) {
      store.dispatch(moveLayersBy({layers: state.layer.selected, x: event.delta.x, y: event.delta.y}));
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    store.dispatch(enableSelectionTool());
  }
}

export default DragTool;