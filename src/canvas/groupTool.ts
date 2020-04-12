import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import PaperGroup from './base/group';
import PaperShape from './base/shape';
import PaperApp from './app';

class GroupTool {
  app: PaperApp;
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor({app}: {app: PaperApp}) {
    this.tool = new Tool();
    this.tool.onKeyDown = (e) => this.onKeyDown(e);
    this.tool.onKeyUp = (e) => this.onKeyUp(e);
    this.tool.onMouseDown = (e) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e) => this.onMouseUp(e);
    this.app = app;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {

  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {

  }
  onMouseUp(event: paper.ToolEvent): void {

  }
  getInteractiveParent(item: PaperShape | PaperGroup) {
    let parent = item;
    while(!parent.interactive && parent.type !== 'Artboard') {
      parent = parent.parent;
    }
    return parent;
  }
  getParentGroup(item: PaperShape | PaperGroup) {
    let parent = this.getInteractiveParent(item);
    while(parent.type === 'Group') {
      parent = parent.parent;
    }
    return parent;
  }
}

export default GroupTool;