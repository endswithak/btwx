import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getLayerDepth, getParentLayer, getNearestScopeAncestor, isScopeGroupLayer, getLayer, getPaperLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers, increaseLayerScope, decreaseLayerScope, clearLayerScope, setLayerHover, newLayerScope, copyLayerToClipboard, copyLayersToClipboard, pasteLayersFromClipboard, moveLayerBy, moveLayersBy, escapeLayerScope, deepSelectLayer } from '../store/actions/layer';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import { enableRectangleDrawTool, enableEllipseDrawTool, enableDragTool } from '../store/actions/tool';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame, updateActiveArtboardFrame } from '../store/utils/layer';
import { applyShapeMethods } from './shapeUtils';
import { applyArtboardMethods } from './artboardUtils';
import DragTool from './dragTool';

const redo = () => {
  store.dispatch(ActionCreators.redo());
  paper.project.clear();
  const state = store.getState();
  paper.project.importJSON(state.layer.present.paperProject);
  Object.keys(state.layer.present.byId).forEach((key) => {
    if (state.layer.present.byId[key].type === 'Shape') {
      applyShapeMethods(getPaperLayer(key));
    }
    if (state.layer.present.byId[key].type === 'ArtboardBackground') {
      applyArtboardMethods(getPaperLayer(key));
    }
  });
  updateHoverFrame(state.layer.present);
  updateSelectionFrame(state.layer.present);
  updateActiveArtboardFrame(state.layer.present);
}

const undo = () => {
  store.dispatch(ActionCreators.undo());
  paper.project.clear();
  const state = store.getState();
  paper.project.importJSON(state.layer.present.paperProject);
  Object.keys(state.layer.present.byId).forEach((key) => {
    if (state.layer.present.byId[key].type === 'Shape') {
      applyShapeMethods(getPaperLayer(key));
    }
    if (state.layer.present.byId[key].type === 'ArtboardBackground') {
      applyArtboardMethods(getPaperLayer(key));
    }
  });
  updateHoverFrame(state.layer.present);
  updateSelectionFrame(state.layer.present);
  updateActiveArtboardFrame(state.layer.present);
}

class SelectionTool {
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  hitResult: paper.HitResult;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  constructor() {
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent) => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent) => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent) => this.onMouseUp(e);
    this.areaSelectTool = new AreaSelectTool();
    this.dragTool = new DragTool();
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {
    const state = store.getState();
    switch(event.key) {
      case 'z': {
        if (event.modifiers.meta) {
          if (event.modifiers.shift) {
            redo();
          } else {
            undo();
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
        this.areaSelectTool.shiftModifier = true;
        this.dragTool.shiftModifier = true;
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
        this.areaSelectTool.onEscape();
        this.dragTool.onEscape();
        store.dispatch(escapeLayerScope());
        if (state.layer.present.hover) {
          const paperLayer = getPaperLayer(state.layer.present.hover);
          paperLayer.emit('mouseenter', event);
        }
        break;
      }
      case 'meta': {
        this.areaSelectTool.metaModifier = true;
        this.dragTool.metaModifier = true;
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        if (state.layer.present.selected.length > 0) {
          store.dispatch(removeLayers({layers: state.layer.present.selected}));
        }
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.areaSelectTool.shiftModifier = false;
        this.dragTool.shiftModifier = false;
        this.shiftModifier = false;
        break;
      }
      case 'meta': {
        this.areaSelectTool.metaModifier = false;
        this.dragTool.metaModifier = false;
        this.metaModifier = false;
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState();
    const hitResult = getPaperLayer(state.layer.present.page).hitTest(event.point);
    if (hitResult) {
      this.dragTool.enable();
      this.dragTool.onMouseDown(event);
    } else {
      this.areaSelectTool.enable();
      this.areaSelectTool.onMouseDown(event);
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseDrag(event);
    this.dragTool.onMouseDrag(event);
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
  }
}

export default SelectionTool;