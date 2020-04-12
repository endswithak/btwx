import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import PaperGroup from './base/group';
import PaperShape from './base/shape';
import PaperApp from './app';
import PaperArtboard from './base/artboard';
import PaperPage from './base/page';
import TreeNode from './base/treeNode';

class SelectionTool {
  app: PaperApp;
  tool: paper.Tool;
  shiftModifier: boolean;
  metaModifier: boolean;
  areaSelect: {
    active: boolean;
    from: paper.Point;
    to: paper.Point;
    shape: paper.Path;
  };
  constructor({app}: {app: PaperApp}) {
    this.tool = new Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e) => this.onKeyDown(e);
    this.tool.onKeyUp = (e) => this.onKeyUp(e);
    this.tool.onMouseDown = (e) => this.onMouseDown(e);
    this.tool.onMouseDrag = (e) => this.onMouseDrag(e);
    this.tool.onMouseUp = (e) => this.onMouseUp(e);
    this.app = app;
    this.areaSelect = {
      active: false,
      to: null,
      from: null,
      shape: null
    };
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  clearProps(): void {
    if (this.areaSelect.shape) {
      this.areaSelect.shape.remove();
    }
    this.areaSelect = {
      active: false,
      to: null,
      from: null,
      shape: null
    };
  }
  renderAreaSelectShape(shapeOpts: any) {
    if (this.areaSelect.shape) {
      this.areaSelect.shape.remove();
    }
    return new Path.Rectangle({
      from: this.areaSelect.from,
      to: this.areaSelect.to,
      selected: true,
      ...shapeOpts
    });
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'g': {
        if (event.modifiers.meta) {
          const topSelection = this.app.selection[0];
          const newGroup = topSelection.parent.addChildAbove({
            node: new PaperGroup({}),
            above: topSelection
          });
          this.app.selection.forEach((item) => {
            item.remove();
            newGroup.addChild({
              node: item
            });
          });
          this.clearSelection();
        }
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'escape': {
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'backspace': {
        this.app.selection.forEach((layer) => {
          (layer as TreeNode).remove();
        });
        this.app.dispatch({
          type: 'clear-selection'
        });
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
    const hitTest = this.app.page.paperItem.hitTest(event.point);
    if (hitTest && this.getInteractiveParent(hitTest.item.data.node).type !== 'Artboard') {
      // const layer = hitTest.item.data.layer;
      // this.updateSelection(layer);
      //console.log(this.getParentGroup(hitTest.item.data.layer));
      if (this.shiftModifier) {
        this.updateSelection(this.getInteractiveParent(hitTest.item.data.node));
      } else {
        this.app.dispatch({
          type: 'new-selection',
          layer: this.getInteractiveParent(hitTest.item.data.node)
        });
      }
    } else {
      this.areaSelect.active = true;
      this.areaSelect.from = event.point;
      if (!this.shiftModifier) {
        this.app.dispatch({
          type: 'clear-selection'
        });
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.areaSelect.active) {
      this.areaSelect.to = event.point;
      this.areaSelect.shape = this.renderAreaSelectShape({});
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.areaSelect.active && this.areaSelect.to) {
      if (this.areaSelect.shape) {
        this.areaSelect.shape.remove();
        this.areaSelect.to = null;
      }
      this.areaSelect.active = false;
      this.app.page.paperItem.getItems({
        data: (value: any) => {
          return value.node && value.node.interactive;
        },
        overlapping: this.areaSelect.shape.bounds
      }).forEach((item: paper.Item) => {
        const node = item.data.node;
        if (node.type === 'Artboard') {
          if (item.isInside(this.areaSelect.shape.bounds)) {
            this.updateSelection(node);
          }
        } else {
          this.updateSelection(node);
        }
      });
    }
    this.clearProps();
  }
  updateSelection(layer: PaperShape | PaperGroup): void {
    if (this.isSelected(layer.id)) {
      this.app.dispatch({
        type: 'remove-from-selection',
        layer: layer
      });
    } else {
      this.app.dispatch({
        type: 'add-to-selection',
        layer: layer
      });
    }
  }
  getInteractiveParent(item: PaperShape | PaperGroup) {
    let parent = item;
    while(!parent.interactive) {
      parent = parent.parent;
    }
    return parent;
  }
  getParentGroup(item: PaperShape | PaperGroup) {
    let parent = this.getInteractiveParent(item);
    while(parent.type === 'Shape') {
      parent = parent.parent;
    }
    return parent;
  }
  isSelected(id: string): boolean {
    if (this.app.selection.find(item => item.id === id)) {
      return true;
    } else {
      return false;
    }
  }
  getIndex(id: string): number {
    return this.app.selection.findIndex(layer => layer.id === id);
  }
  addToSelection(layer: PaperShape | PaperGroup): any {
    layer.selected = true;
    layer.paperItem.selected = true;
    this.app.selection.push(layer);
    return this.app.selection;
  }
  removeFromSelection(layer: PaperShape | PaperGroup): any {
    layer.selected = false;
    layer.paperItem.selected = false;
    this.app.selection.splice(this.getIndex(layer.id), 1);
    return this.app.selection;
  }
  clearSelection(): any {
    this.app.selection.forEach((item) => {
      item.selected = false;
      item.paperItem.selected = false;
    });
    this.app.selection = [];
    return this.app.selection;
  }
}

export default SelectionTool;