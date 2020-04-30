import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getActivePagePaperLayer, getLayerByPaperId } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers } from '../store/actions/layer';
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
    const state = this.getState();
    switch(event.key) {
      case 'g': {
        if (event.modifiers.meta && state.layer.selected.length > 0) {
          if (event.modifiers.shift) {
            this.dispatch(ungroupLayers({layers: state.layer.selected}));
          } else {
            this.dispatch(groupLayers({layers: state.layer.selected}));
          }
        }
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
        if (this.areaSelect) {
          this.areaSelect.clear();
          this.areaSelect = null;
        }
        // if (state.layers.activeGroup) {
        //   this.dispatch(setActiveGroup({id: null}));
        // }
        if (state.layer.selected.length > 0) {
          this.dispatch(deselectAllLayers());
        }
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        this.dispatch(removeLayers({layers: state.layer.selected}));
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
        this.toggleLayerSelection(id);
      } else {
        this.dispatch(selectLayer({id, newSelection: true}));
      }
    } else {
      this.areaSelect = new AreaSelect(event.point);
      if (!this.shiftModifier) {
        if (state.layer.selected.length > 0) {
          this.dispatch(deselectAllLayers());
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
          this.toggleLayerSelection(id);
        });
      }
      this.areaSelect.clear();
      this.areaSelect = null;
    }
  }
  toggleLayerSelection(id: string): void {
    const state = this.getState();
    if (state.layer.selected.includes(id)) {
      this.dispatch(deselectLayer({id}));
    } else {
      this.dispatch(selectLayer({id}));
    }
  }
}

export default SelectionTool;