import { getPaperLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, removeLayers, copyLayersToClipboard, pasteLayersFromClipboard, escapeLayerScope } from '../store/actions/layer';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { applyShapeMethods } from './shapeUtils';
import { applyArtboardMethods } from './artboardUtils';
import { applyTextMethods } from './textUtils';
import DragTool from './dragTool';
import ResizeTool from './resizeTool';
import { paperMain } from './index';

const redo = () => {
  store.dispatch(ActionCreators.redo());
  paperMain.project.clear();
  const state = store.getState();
  paperMain.project.importJSON(state.layer.present.paperProject);
  Object.keys(state.layer.present.byId).forEach((key) => {
    if (state.layer.present.byId[key].type === 'Shape') {
      applyShapeMethods(getPaperLayer(key));
    }
    if (state.layer.present.byId[key].type === 'Artboard') {
      const artboardBackground = getPaperLayer(key).getItem({data: {id: 'ArtboardBackground'}});
      applyArtboardMethods(artboardBackground);
    }
    if (state.layer.present.byId[key].type === 'Text') {
      applyTextMethods(getPaperLayer(key));
    }
  });
  updateHoverFrame(state.layer.present);
  updateSelectionFrame(state.layer.present);
}

const undo = () => {
  store.dispatch(ActionCreators.undo());
  paperMain.project.clear();
  const state = store.getState();
  paperMain.project.importJSON(state.layer.present.paperProject);
  Object.keys(state.layer.present.byId).forEach((key) => {
    if (state.layer.present.byId[key].type === 'Shape') {
      applyShapeMethods(getPaperLayer(key));
    }
    if (state.layer.present.byId[key].type === 'Artboard') {
      const artboardBackground = getPaperLayer(key).getItem({data: {id: 'ArtboardBackground'}});
      applyArtboardMethods(artboardBackground);
    }
    if (state.layer.present.byId[key].type === 'Text') {
      applyTextMethods(getPaperLayer(key));
    }
  });
  updateHoverFrame(state.layer.present);
  updateSelectionFrame(state.layer.present);
}

class SelectionTool {
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  hitResult: paper.HitResult;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  resizeTool: ResizeTool;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    //this.tool.minDistance = 1;
    this.tool.onKeyDown = (e: paper.KeyEvent) => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent) => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent) => this.onMouseUp(e);
    this.areaSelectTool = new AreaSelectTool();
    this.dragTool = new DragTool();
    this.resizeTool = new ResizeTool();
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
        this.resizeTool.shiftModifier = true;
        this.shiftModifier = true;
        this.resizeTool.onShiftDown();
        break;
      }
      case 'escape': {
        this.areaSelectTool.onEscape();
        this.dragTool.onEscape();
        this.resizeTool.onEscape();
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
        this.resizeTool.metaModifier = true;
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
        this.resizeTool.shiftModifier = false;
        this.shiftModifier = false;
        this.resizeTool.onShiftUp();
        break;
      }
      case 'meta': {
        this.areaSelectTool.metaModifier = false;
        this.dragTool.metaModifier = false;
        this.resizeTool.metaModifier = false;
        this.metaModifier = false;
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState().layer.present;
    const hitResult = paperMain.project.hitTest(event.point);
    if (hitResult) {
      if (hitResult.item.data.id === 'selectionFrameHandle') {
        if (state.selected.length >= 1 && !state.selected.every((id) => state.byId[id].type === 'Text')) {
          this.resizeTool.enable(hitResult.item.data.handle);
          this.resizeTool.onMouseDown(event);
        }
      } else {
        this.dragTool.enable();
        this.dragTool.onMouseDown(event);
      }
    } else {
      this.areaSelectTool.enable();
      this.areaSelectTool.onMouseDown(event);
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseDrag(event);
    this.dragTool.onMouseDrag(event);
    this.resizeTool.onMouseDrag(event);
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
    this.resizeTool.onMouseUp(event);
  }
}

export default SelectionTool;