import { getPaperLayer } from '../store/selectors/layer';
import { removeLayers, escapeLayerScope } from '../store/actions/layer';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import DragTool from './dragTool';
import ResizeTool from './resizeTool';
import CopyTool from './copyTool';
import GroupTool from './groupTool';
import GradientTool from './gradientTool';
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
  undoRedoTool: UndoRedoTool;
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
    this.copyTool = new CopyTool();
    this.groupTool = new GroupTool();
    this.insertTool = new InsertTool();
    this.gradientTool = new GradientTool();
    this.undoRedoTool = new UndoRedoTool();
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.resizeTool.onKeyDown(event);
    this.areaSelectTool.onKeyDown(event);
    this.dragTool.onKeyDown(event);
    this.copyTool.onKeyDown(event);
    this.groupTool.onKeyDown(event);
    this.insertTool.onKeyDown(event);
    this.undoRedoTool.onKeyDown(event);
    switch(event.key) {
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
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.insertTool.enabled = false;
    const state = store.getState();
    const layerState = state.layer.present;
    const hitResult = paperMain.project.hitTest(event.point);
    const isFillGradientEditorOpen = state.fillGradientEditor.isOpen;
    const isStrokeGradientEditorOpen = state.strokeGradientEditor.isOpen;
    const gradientEditorOpen = isFillGradientEditorOpen || isStrokeGradientEditorOpen;
    if (hitResult) {
      if (hitResult.item.data.id === 'selectionFrameHandle') {
        if (layerState.selected.length >= 1) {
          if (hitResult.item.data.handle === 'move') {
            this.dragTool.enable();
            this.dragTool.moveHandle = true;
            this.dragTool.onMouseDown(event);
          }
          if (!layerState.selected.every((id: string) => layerState.byId[id].type === 'Text') && hitResult.item.data.handle !== 'move') {
            this.resizeTool.enable(hitResult.item.data.handle);
            this.resizeTool.onMouseDown(event);
          }
        }
      } else if (hitResult.item.data.id === 'gradientFrameHandle') {
        this.gradientTool.enable(hitResult.item.data.handle, (() => {
          if (isFillGradientEditorOpen) {
            return 'fill';
          }
          if (isStrokeGradientEditorOpen) {
            return 'stroke';
          }
        })());
        this.gradientTool.onMouseDown(event);
      } else {
        this.dragTool.enable();
        this.dragTool.onMouseDown(event);
      }
    } else {
      if (!gradientEditorOpen) {
        this.areaSelectTool.enable();
        this.areaSelectTool.onMouseDown(event);
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseDrag(event);
    this.dragTool.onMouseDrag(event);
    this.resizeTool.onMouseDrag(event);
    this.gradientTool.onMouseDrag(event);
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.insertTool.enabled = true;
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
    this.resizeTool.onMouseUp(event);
    this.gradientTool.onMouseUp(event);
  }
}

export default SelectionTool;