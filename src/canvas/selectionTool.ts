import { getPaperLayer } from '../store/selectors/layer';
import { removeLayers, escapeLayerScope } from '../store/actions/layer';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import DragTool from './dragTool';
import ResizeTool from './resizeTool';
import CopyTool from './copyTool';
import GroupTool from './groupTool';
import InsertTool from './insertTool';
import { paperMain } from './index';

class SelectionTool {
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  hitResult: paper.HitResult;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  resizeTool: ResizeTool;
  copyTool: CopyTool;
  groupTool: GroupTool;
  insertTool: InsertTool;
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
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.resizeTool.onKeyDown(event);
    this.areaSelectTool.onKeyDown(event);
    this.dragTool.onKeyDown(event);
    this.copyTool.onKeyDown(event);
    this.groupTool.onKeyDown(event);
    this.insertTool.onKeyDown(event);
    const state = store.getState();
    switch(event.key) {
      case 'alt': {
        this.altModifier = true;
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
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
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.insertTool.enabled = false;
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
    this.insertTool.enabled = true;
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
    this.resizeTool.onMouseUp(event);
  }
}

export default SelectionTool;