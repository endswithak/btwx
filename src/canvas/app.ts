import paper, { Point } from 'paper';
import DrawTool from './drawTool';
import SelectionTool from './selectionTool';
import Tree from './base/tree';
import LayerNode from './base/layerNode';

interface PaperAppProps {
  canvas: HTMLCanvasElement;
  dispatch: any;
}

class PaperApp {
  dispatch: any;
  scope: paper.PaperScope;
  drawTool: DrawTool;
  selectionTool: SelectionTool;
  pageTree: Tree;
  page: PaperPage;
  undoIndex: number;
  selection: LayerNode[];
  constructor({canvas, dispatch}: PaperAppProps) {
    paper.setup(canvas);
    this.scope = paper;
    this.dispatch = dispatch;
    this.pageTree = new Tree({
      rootNode: new LayerNode({layerType: 'Page'})
    });
    this.page = this.pageTree.root;
    this.selection = [];
    this.selectionTool = new SelectionTool({
      app: this
    });
    this.drawTool = new DrawTool({
      app: this
    });
    this.undoIndex = 0;
  }
  onWheel(e: WheelEvent): void {
    if (e.ctrlKey) {
      e.preventDefault();
      const nextZoom = this.scope.view.zoom - e.deltaY * 0.01;
      this.scope.view.center.x = e.clientX;
      this.scope.view.center.y = e.clientY;
      if (e.deltaY < 0 && nextZoom < 30) {
        this.scope.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        this.scope.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom < 0) {
        this.scope.view.zoom = 0.001;
      }
    } else {
      this.scope.view.translate(new Point(e.deltaX * -1, e.deltaY * -1));
    }
  }
}

export default PaperApp;