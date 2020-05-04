import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getLayerDepth, getParentLayer, getNearestScopeAncestor, isScopeGroupLayer, getLayer, getPaperLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers, increaseLayerScope, decreaseLayerScope, clearLayerScope, setLayerHover, newLayerScope, copyLayerToClipboard, copyLayersToClipboard, pasteLayersFromClipboard, moveLayerBy, moveLayersBy, escapeLayerScope } from '../store/actions/layer';
import store, { StoreDispatch, StoreGetState } from '../store';
import AreaSelect from './areaSelect';
import { enableRectangleDrawTool, enableEllipseDrawTool, enableDragTool } from '../store/actions/tool';

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
      case 'g': {
        if (event.modifiers.meta && state.layer.selected.length > 0) {
          if (event.modifiers.shift) {
            store.dispatch(ungroupLayers({layers: state.layer.selected}));
          } else {
            store.dispatch(groupLayers({layers: state.layer.selected}));
          }
        }
        break;
      }
      case 'c': {
        if (event.modifiers.meta) {
          store.dispatch(copyLayersToClipboard({layers: state.layer.selected}));
        }
        break;
      }
      case 'v': {
        if (event.modifiers.meta && state.layer.clipboard.allIds.length > 0) {
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
        if (state.layer.hover) {
          const paperLayer = getPaperLayer(state.layer, state.layer.hover);
          paperLayer.emit('mouseenter', event);
        }
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        store.dispatch(removeLayers({layers: state.layer.selected}));
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
    const hitResult = getPagePaperLayer(state.layer).hitTest(event.point);
    if (hitResult) {
      //store.dispatch(enableDragTool());
    } else {
      this.areaSelect = new AreaSelect(event.point);
      if (!this.shiftModifier) {
        if (state.layer.selected.length > 0) {
          store.dispatch(deselectAllLayers());
        }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    const state = store.getState();
    if (this.areaSelect) {
      this.areaSelect.update(event.point);
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    const state = store.getState();
    if (this.areaSelect && this.areaSelect.to) {
      this.areaSelect.layers().forEach((id: string) => {
        if (state.layer.selected.includes(id)) {
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