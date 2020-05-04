import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getLayerDepth, getParentLayer, getNearestScopeAncestor, isScopeGroupLayer, getLayer, getPaperLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers, increaseLayerScope, decreaseLayerScope, clearLayerScope, setLayerHover, newLayerScope, copyLayerToClipboard, copyLayersToClipboard, pasteLayersFromClipboard, moveLayerBy, moveLayersBy, escapeLayerScope } from '../store/actions/layer';
import store, { StoreDispatch, StoreGetState } from '../store';
import AreaSelect from './areaSelect';
import { enableRectangleDrawTool, enableEllipseDrawTool, enableDragTool } from '../store/actions/tool';
import { ActionCreators } from 'redux-undo';

class SelectionTool {
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  hitResult: paper.HitResult;
  areaSelect: AreaSelect;
  constructor() {
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent) => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent) => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent) => this.onMouseUp(e);
    this.areaSelect = null;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {
    const state = store.getState();
    switch(event.key) {
      case 'z': {
        if (event.modifiers.meta) {
          if (event.modifiers.shift) {
            store.dispatch(ActionCreators.redo());
            paper.project.clear();
            paper.project.importJSON(store.getState().layer.present.paperProject);
          } else {
            store.dispatch(ActionCreators.undo());
            paper.project.clear();
            paper.project.importJSON(store.getState().layer.present.paperProject);
          }
        }
        break;
      }
      case 'g': {
        if (event.modifiers.meta && state.layer.present.selected.length > 0) {
          if (event.modifiers.shift) {
            store.dispatch(ungroupLayers({layers: state.layer.present.selected}));
          } else {
            store.dispatch(groupLayers({layers: state.layer.present.selected}));
          }
        }
        break;
      }
      case 'c': {
        if (event.modifiers.meta) {
          store.dispatch(copyLayersToClipboard({layers: state.layer.present.selected}));
        }
        break;
      }
      case 'v': {
        if (event.modifiers.meta && state.layer.present.clipboard.allIds.length > 0) {
          if (event.modifiers.shift) {
            store.dispatch(pasteLayersFromClipboard({overSelection: true}));
          } else {
            store.dispatch(pasteLayersFromClipboard({overSelection: false}));
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
        store.dispatch(escapeLayerScope());
        if (state.layer.present.hover) {
          const paperLayer = getPaperLayer(state.layer.present.hover);
          paperLayer.emit('mouseenter', event);
        }
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        store.dispatch(removeLayers({layers: state.layer.present.selected}));
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
    const state = store.getState();
    const hitResult = getPaperLayer(state.layer.present.page).hitTest(event.point);
    if (hitResult) {
      //store.dispatch(enableDragTool());
    } else {
      this.areaSelect = new AreaSelect(event.point);
      if (!this.shiftModifier) {
        if (state.layer.present.selected.length > 0) {
          store.dispatch(deselectAllLayers());
        }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.areaSelect) {
      this.areaSelect.update(event.point);
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    const state = store.getState();
    if (this.areaSelect && this.areaSelect.to) {
      this.areaSelect.layers().forEach((id: string) => {
        if (state.layer.present.selected.includes(id)) {
          store.dispatch(deselectLayer({id}));
        } else {
          store.dispatch(selectLayer({id}));
        }
      });
    }
    this.areaSelect = null;
  }
}

export default SelectionTool;