import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getActivePagePaperLayer, getLayerByPaperId } from '../store/selectors/layer';
import { newSelection, clearSelection, groupSelection, ungroupSelection, deleteSelection, toggleLayerSelection } from '../store/actions/selection';
import store, { StoreDispatch, StoreGetState } from '../store';
import AreaSelect from './areaSelect';

class SelectionTool {
  getState: StoreGetState;
  dispatch: StoreDispatch;
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  hitResult: paper.HitResult;
  areaSelect: AreaSelect;
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
    this.areaSelect = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.hitResult = null;
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'g': {
        if (event.modifiers.meta && this.getState().selection.allIds.length > 0) {
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
        const state = this.getState();
        if (this.areaSelect) {
          this.areaSelect.clear();
          this.areaSelect = null;
        }
        // if (state.layers.activeGroup) {
        //   this.dispatch(setActiveGroup({id: null}));
        // }
        if (state.selection.allIds.length > 0) {
          this.dispatch(clearSelection());
        }
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
    // if (state.activeGroup) {
    //   this.hitResult = getPaperLayer(state, state.activeGroup).getItem({
    //     id: (paperId: number) => {
    //       const layerId = getLayerByPaperId(state, paperId).id;
    //       const topParent = getTopParentGroup(state, layerId);
    //       return topParent.paperLayer === paperId;
    //     },
    //     overlapping: new paper.Rectangle(event.point, new paper.Size(1,1))
    //   });
    // } else {
    //   this.hitResult = getActivePagePaperLayer(state).getItem({
    //     id: (paperId: number) => {
    //       const layerId = getLayerByPaperId(state, paperId).id;
    //       const topParent = getTopParentGroup(state, layerId);
    //       return topParent.paperLayer === paperId;
    //     },
    //     overlapping: new paper.Rectangle(event.point, new paper.Size(1,1))
    //   });
    // }
    const state = this.getState();
    this.hitResult = getActivePagePaperLayer(state.layer).hitTest(event.point);
    if (this.hitResult) {
      const hitLayerPaperId = this.hitResult.item.id;
      const id = getLayerByPaperId(state.layer, hitLayerPaperId).id;
      if (this.shiftModifier) {
        this.dispatch(toggleLayerSelection(id));
      } else {
        this.dispatch(newSelection(id));
      }
    } else {
      this.areaSelect = new AreaSelect(event.point);
      if (!this.shiftModifier) {
        if (state.selection.allIds.length > 0) {
          this.dispatch(clearSelection());
        }
        // if (state.layer.activeGroup) {
        //   this.dispatch(setActiveGroup({id: null}));
        // }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.areaSelect) {
      this.areaSelect.update(event.point);
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.areaSelect) {
      if (this.areaSelect.to) {
        this.areaSelect.layers().forEach((id: string) => {
          this.dispatch(toggleLayerSelection(id));
        });
      }
      this.areaSelect.clear();
      this.areaSelect = null;
    }
  }
}

export default SelectionTool;