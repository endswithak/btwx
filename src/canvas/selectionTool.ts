import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import PaperLayer from './base/layer';
import { Fill } from './base/style/fill';
import PaperArtboard from './base/artboard';
import PaperGroup from './base/group';
import PaperShape from './base/shape';
import PaperPage from './base/page';
import PaperApp from './app';

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
    if (!this.app.page.paperItem.hitTest(event.point)) {
      this.areaSelect.active = true;
      this.areaSelect.from = event.point;
      if (!this.shiftModifier) {
        this.clearSelection();
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
          return value.layer && value.layer.interactive;
        },
        overlapping: this.areaSelect.shape.bounds
      }).forEach((item: paper.Item) => {
        const layer = item.data.layer;
        if (this.isSelected(layer.id)) {
          this.removeFromSelection(layer);
        } else {
          this.addToSelection(layer);
        }
      });
    }
  }
  isSelected(id: string): boolean {
    if (this.app.selection.find(item => item.id === id)) {
      return true;
    } else {
      return false;
    }
  }
  getIndex(id: string): number {
    return this.app.selection.findIndex(item => item.id === id);
  }
  addToSelection(layer: PaperShape | PaperGroup): void {
    layer.selected = true;
    layer.paperItem.selected = true;
    this.app.selection.push(layer);
  }
  removeFromSelection(layer: PaperShape | PaperGroup): void {
    layer.selected = false;
    layer.paperItem.selected = false;
    this.app.selection = this.app.selection.reduce((total, item) => {
      return item.id !== layer.id ? [...total, item] : [...total];
    }, []);
  }
  clearSelection() {
    this.app.selection.forEach((item) => {
      item.selected = false;
      item.paperItem.selected = false;
    });
    this.app.selection = [];
  }
}

export default SelectionTool;