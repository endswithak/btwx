import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { Store } from 'redux';
import { getLayer, getPaperLayer, getActivePage, getParentLayer, getActivePagePaperLayer } from '../store/selectors';
import { clearSelection, addToSelection, removeFromSelection, newSelection } from '../store/actions/layers';
import store, { StoreDispatch, StoreGetState } from '../store';
import LayerNode from './base/layerNode';
import StyleNode from './base/styleNode';

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
        // if (event.modifiers.meta) {
        //   const topSelection = [...this.app.selection].reduce((total, current) => {
        //     const topGroup = this.getTopParentGroup(current);
        //     return topGroup.getIndex() <= total.getIndex() ? current : total;
        //   }, this.app.selection[0]);
        //   const topSelectionParent = topSelection.parent;
        //   const topSelectionIndex = topSelection.getIndex();
        //   this.app.dispatch({
        //     type: 'add-node-at',
        //     node: new LayerNode({layerType: 'Group'}),
        //     toNode: topSelectionParent,
        //     index: topSelectionIndex
        //   });
        //   const newGroup = topSelectionParent.children[topSelectionIndex];
        //   this.app.dispatch({
        //     type: 'add-nodes',
        //     nodes: this.app.selection,
        //     toNode: newGroup
        //   });
        //   this.app.dispatch({
        //     type: 'new-selection',
        //     layer: newGroup
        //   });
        // }
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        // this.app.selection.forEach((node) => {
        //   this.app.dispatch({
        //     type: 'remove-node',
        //     node: node,
        //     fromNode: node.parent
        //   });
        // });
        // this.app.dispatch({
        //   type: 'clear-selection'
        // });
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
    const state = this.getState();
    this.hitResult = getPaperLayer(state, state.layers.activePage).hitTest(event.point);
    if (this.hitResult) {
      const hitLayerId = this.hitResult.item.data.layerId;
      if (this.shiftModifier) {
        this.updateSelection(hitLayerId);
      } else {
        this.dispatch(newSelection({
          id: hitLayerId
        }));
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
      const overlappedItems = getActivePagePaperLayer(this.getState()).getItems({
        data: (value: any) => {
          const topParent = this.getTopParentGroup(value.layerId);
          return topParent.id === value.id;
        },
        overlapping: this.areaSelect.shape.bounds
      });
      overlappedItems.forEach((item: paper.Item) => {
        const node = item.data.layerId;
        if (getLayer(this.getState(), node).layerType === 'Artboard') {
          if (item.isInside(this.areaSelect.shape.bounds)) {
            this.updateSelection(node);
          }
        } else {
          this.updateSelection(node);
        }
      });
    }
    this.clearProps();
  }
  updateSelection(id: string): void {
    if (this.isSelected(id)) {
      this.dispatch(removeFromSelection({ id }));
    } else {
      this.dispatch(addToSelection({ id }));
    }
  }
  getTopParentGroup(id: string) {
    let currentNode = getLayer(this.getState(), id);
    while(getParentLayer(this.getState(), currentNode.id).layerType === 'Group') {
      currentNode = getParentLayer(this.getState(), currentNode.id);
    }
    return currentNode;
  }
  isSelected(id: string): boolean {
    if (this.getState().layers.selection.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
}

export default SelectionTool;