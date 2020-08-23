import { getPaperLayer } from '../store/selectors/layer';
import { removeLayers, escapeLayerScope } from '../store/actions/layer';
import { setCanvasMeasuring } from '../store/actions/canvasSettings';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import DragTool from './dragTool';
import ResizeTool from './resizeTool';
import CopyTool from './copyTool';
import GroupTool from './groupTool';
import GradientTool from './gradientTool';
import LineTool from './lineTool';
import InsertTool from './insertTool';
import UndoRedoTool from './undoRedoTool';
import { paperMain } from './index';

class SelectionTool {
  tool: paper.Tool;
  hitResult: paper.HitResult;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  resizeTool: ResizeTool;
  copyTool: CopyTool;
  groupTool: GroupTool;
  insertTool: InsertTool;
  gradientTool: GradientTool;
  lineTool: LineTool;
  undoRedoTool: UndoRedoTool;
  altModifier: boolean;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.minDistance = 1;
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.areaSelectTool = new AreaSelectTool();
    this.dragTool = new DragTool();
    this.resizeTool = new ResizeTool();
    this.copyTool = new CopyTool();
    this.groupTool = new GroupTool();
    this.insertTool = new InsertTool();
    this.gradientTool = new GradientTool();
    this.undoRedoTool = new UndoRedoTool();
    this.lineTool = new LineTool();
    this.altModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.resizeTool.onKeyDown(event);
    this.areaSelectTool.onKeyDown(event);
    this.dragTool.onKeyDown(event);
    this.copyTool.onKeyDown(event);
    this.groupTool.onKeyDown(event);
    this.insertTool.onKeyDown(event);
    this.undoRedoTool.onKeyDown(event);
    this.lineTool.onKeyDown(event);
    switch(event.key) {
      case 'alt': {
        store.dispatch(setCanvasMeasuring({measuring: true}));
        break;
      }
      case 'escape': {
        const state = store.getState();
        store.dispatch(escapeLayerScope());
        if (state.layer.present.hover) {
          const paperLayer = getPaperLayer(state.layer.present.hover);
          paperLayer.emit('mouseenter', event);
        }
        break;
      }
      case 'backspace': {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(removeLayers({layers: state.layer.present.selected}));
        }
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    this.resizeTool.onKeyUp(event);
    this.areaSelectTool.onKeyUp(event);
    this.dragTool.onKeyUp(event);
    this.copyTool.onKeyUp(event);
    this.groupTool.onKeyUp(event);
    this.undoRedoTool.onKeyUp(event);
    this.lineTool.onKeyUp(event);
    switch(event.key) {
      case 'alt': {
        store.dispatch(setCanvasMeasuring({measuring: false}));
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.insertTool.enabled = false;
    const state = store.getState();
    const layerState = state.layer.present;
    const hitResult = paperMain.project.hitTest(event.point);
    const isGradientEditorOpen = state.gradientEditor.isOpen;
    if (hitResult) {
      // if hit result is selection frame handle
      if (hitResult.item.data.id === 'selectionFrameHandle') {
        // if move handle, enable drag tool
        if (hitResult.item.data.handle === 'move') {
          this.dragTool.enable(state, true);
          this.dragTool.onMouseDown(event);
        }
        // if from or to handle, enable line tool
        else if (hitResult.item.data.handle === 'from' || hitResult.item.data.handle === 'to') {
          this.lineTool.enable(state, hitResult.item.data.handle);
          this.lineTool.onMouseDown(event);
        }
        // else (hit result is resize handle), enable resize tool if no text layers are selected
        else {
          if (!layerState.selected.every((id: string) => layerState.byId[id].type === 'Text')) {
            this.resizeTool.enable(state, hitResult.item.data.handle);
            this.resizeTool.onMouseDown(event);
          }
        }
      // if hit result is gradient handle, enable gradient tool
      } else if (hitResult.item.data.id === 'gradientFrameHandle') {
        this.gradientTool.enable(hitResult.item.data.handle, state.gradientEditor.prop as 'fill' | 'stroke');
        this.gradientTool.onMouseDown(event);
      // if hit result is shape, group, text, or image, enable drag tool
      } else if (hitResult.item.data.type && (hitResult.item.data.type === 'Shape' || hitResult.item.data.type === 'Group' || hitResult.item.data.type === 'Image' || hitResult.item.data.type === 'Raster' || hitResult.item.data.type === 'Text')) {
        this.dragTool.enable(state);
        this.dragTool.onMouseDown(event);
      } else if (hitResult.item.data.type && (hitResult.item.data.type === 'Artboard' || hitResult.item.data.type === 'ArtboardBackground') && hitResult.item.parent.data.id === state.layer.present.activeArtboard) {
        this.areaSelectTool.enable(state);
        this.areaSelectTool.onMouseDown(event);
      }
    // if no hit result, enable area select tool
    } else {
      if (!isGradientEditorOpen) {
        this.areaSelectTool.enable(state);
        this.areaSelectTool.onMouseDown(event);
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseDrag(event);
    this.dragTool.onMouseDrag(event);
    this.resizeTool.onMouseDrag(event);
    this.gradientTool.onMouseDrag(event);
    this.lineTool.onMouseDrag(event);
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.insertTool.enabled = true;
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
    this.resizeTool.onMouseUp(event);
    this.gradientTool.onMouseUp(event);
    this.lineTool.onMouseUp(event);
  }
}

export default SelectionTool;