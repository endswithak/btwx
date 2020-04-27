import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getActivePagePaperLayer, getLayerByPaperId, getTopParentGroup } from '../store/selectors/layers';
import { addLayerToSelection, removeLayerFromSelection, newSelection, clearSelection, groupSelection, ungroupSelection, deleteSelection } from '../store/actions/selection';
import store, { StoreDispatch, StoreGetState } from '../store';

class SelectionTool {
  getState: StoreGetState;
  dispatch: StoreDispatch;
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  hitResult: paper.HitResult;
  areaSelect: {
    active: boolean;
    from: paper.Point;
    to: paper.Point;
    shape: paper.Path;
  };
  constructor() {
    this.getState = store.getState;
    this.dispatch = store.dispatch;
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e) => this.onKeyDown(e);
    this.tool.onKeyUp = (e) => this.onKeyUp(e);
    this.tool.onMouseDown = (e) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e) => this.onMouseUp(e);
    this.areaSelect = {
      active: false,
      to: null,
      from: null,
      shape: null
    };
    this.shiftModifier = false;
    this.metaModifier = false;
    this.hitResult = null;
  }
  clearProps(): void {
    if (this.areaSelect.shape) {
      this.areaSelect.shape.remove();
    }
    this.areaSelect = {
      active: false,
      to: null,
      from: null,
      shape: null
    };
  }
  renderAreaSelectShape(shapeOpts: any) {
    if (this.areaSelect.shape) {
      this.areaSelect.shape.remove();
    }
    return new Path.Rectangle({
      from: this.areaSelect.from,
      to: this.areaSelect.to,
      selected: true,
      ...shapeOpts
    });
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'g': {
        if (event.modifiers.meta && this.getState().selection.length > 0) {
          if (event.modifiers.shift) {
            this.dispatch(ungroupSelection());
          } else {
            this.dispatch(groupSelection());
          }
        }
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
        this.dispatch(clearSelection());
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        this.dispatch(deleteSelection());
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = this.getState().layers;
    this.hitResult = getActivePagePaperLayer(state).hitTest(event.point);
    if (this.hitResult) {
      const hitLayerPaperId = this.hitResult.item.id;
      const id = getLayerByPaperId(state, hitLayerPaperId).id;
      if (this.shiftModifier) {
        this.updateSelection(id);
      } else {
        this.dispatch(newSelection(id));
      }
    } else {
      this.areaSelect.active = true;
      this.areaSelect.from = event.point;
      if (!this.shiftModifier) {
        this.dispatch(clearSelection());
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.areaSelect.active) {
      this.areaSelect.to = event.point;
      this.areaSelect.shape = this.renderAreaSelectShape({});
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.areaSelect.active && this.areaSelect.to) {
      if (this.areaSelect.shape) {
        this.areaSelect.shape.remove();
        this.areaSelect.to = null;
      }
      this.areaSelect.active = false;
      const state = this.getState().layers;
      const overlappedItems = getActivePagePaperLayer(state).getItems({
        id: (paperId: number) => {
          const layerId = getLayerByPaperId(state, paperId).id;
          const topParent = getTopParentGroup(state, layerId);
          return topParent.paperLayer === paperId;
        },
        overlapping: this.areaSelect.shape.bounds
      });
      overlappedItems.forEach((item: paper.Item) => {
        const layerId = getLayerByPaperId(state, item.id).id;
        this.updateSelection(layerId);
        // if (getLayer(state, node).layerType === 'Artboard') {
        //   if (item.isInside(this.areaSelect.shape.bounds)) {
        //     this.updateSelection(node);
        //   }
        // } else {
        //   this.updateSelection(node);
        // }
      });
    }
    this.clearProps();
  }
  updateSelection(id: string): void {
    if (this.isSelected(id)) {
      this.dispatch(removeLayerFromSelection(id));
    } else {
      this.dispatch(addLayerToSelection(id));
    }
  }
  isSelected(id: string): boolean {
    if (this.getState().selection.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
}

export default SelectionTool;