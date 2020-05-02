import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getLayerDepth, getParentLayer, getNearestScopeAncestor, isScopeGroupLayer, getLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers, increaseLayerScope, decreaseLayerScope, clearLayerScope, setLayerHover, newLayerScope, copyLayerToClipboard, copyLayersToClipboard, pasteLayersFromClipboard } from '../store/actions/layer';
import store, { StoreDispatch, StoreGetState } from '../store';
import AreaSelect from './areaSelect';
import { enableRectangleDrawTool, enableEllipseDrawTool } from '../store/actions/tool';

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
    this.tool.on('mouseenter', (e: { paperLayer: paper.Item; event: paper.ToolEvent }) => this.onMouseEnter(e));
    this.tool.on('mouseleave', (e: { paperLayer: paper.Item; event: paper.ToolEvent }) => this.onMouseLeave(e));
    this.tool.onKeyDown = (e: paper.KeyEvent) => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent) => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent) => this.onMouseUp(e);
    paper.view.onDoubleClick = (e: paper.MouseEvent) => this.onDoubleClick(e);
    this.areaSelect = null;
    this.shiftModifier = false;
    this.metaModifier = false;
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
      case 'c': {
        if (event.modifiers.meta && state.layer.selected.length > 0) {
          this.dispatch(copyLayersToClipboard({layers: state.layer.selected}));
        }
        break;
      }
      case 'v': {
        if (event.modifiers.meta && state.layer.clipboard.length > 0) {
          if (event.modifiers.shift) {
            this.dispatch(pasteLayersFromClipboard({overSelection: true}));
          } else {
            this.dispatch(pasteLayersFromClipboard({overSelection: false}));
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
        if (state.layer.selected.length > 0) {
          if (state.layer.scope.length !== 0) {
            this.dispatch(selectLayer({id: state.layer.scope[state.layer.scope.length - 1], newSelection: true}));
          } else {
            this.dispatch(deselectAllLayers());
          }
          this.dispatch(decreaseLayerScope());
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
  onMouseEnter(e: { paperLayer: paper.Item; event: paper.ToolEvent }) {
    const state = this.getState();
    const hitLayerPaperId = e.paperLayer.id;
    const id = getLayerByPaperId(state.layer, hitLayerPaperId).id;
    const nearestScopeAncestor = getNearestScopeAncestor(state.layer, id);
    this.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
  }
  onMouseLeave(e: { paperLayer: paper.Item; event: paper.ToolEvent }) {
    this.dispatch(setLayerHover({id: null}));
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = this.getState();
    const hitResult = getPagePaperLayer(state.layer).hitTest(event.point);
    if (hitResult) {
      const hitLayerPaperId = hitResult.item.id;
      const id = getLayerByPaperId(state.layer, hitLayerPaperId).id;
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer, id);
      this.dispatch(newLayerScope({id: nearestScopeAncestor.id}));
      if (this.shiftModifier) {
        this.toggleLayerSelection(nearestScopeAncestor.id);
      } else {
        this.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
      }
    } else {
      this.areaSelect = new AreaSelect(event.point);
      if (!this.shiftModifier) {
        if (state.layer.selected.length > 0) {
          this.dispatch(clearLayerScope());
          this.dispatch(deselectAllLayers());
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
    if (this.areaSelect && this.areaSelect.to) {
      this.areaSelect.layers().forEach((id: string) => {
        this.toggleLayerSelection(id);
      });
    }
    this.areaSelect = null;
  }
  onDoubleClick(event: paper.MouseEvent): void {
    let state = this.getState();
    const hitResult = getPagePaperLayer(state.layer).hitTest(event.point);
    if (hitResult) {
      const layer = getLayerByPaperId(state.layer, hitResult.item.id);
      let nearestScopeAncestor = getNearestScopeAncestor(state.layer, layer.id);
      if (isScopeGroupLayer(state.layer, nearestScopeAncestor.id)) {
        this.tool.emit('mouseleave', { paperLayer: hitResult.item, event: event });
        this.dispatch(increaseLayerScope({id: nearestScopeAncestor.id}));
        state = this.getState();
        nearestScopeAncestor = getNearestScopeAncestor(state.layer, layer.id);
        this.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
        this.tool.emit('mouseenter', { paperLayer: hitResult.item, event: event });
      }
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