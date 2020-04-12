import paper, { Point } from 'paper';
import DrawTool from './drawTool';
import SelectionTool from './selectionTool';
import PaperPage from './base/page';
import PaperArtboard from './base/artboard';
import PaperGroup from './base/group';
import PaperShape from './base/shape';
import Tree from './base/tree';
import PaperDocument from './base/document';
import TreeNode from './base/treeNode';

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
  selection: TreeNode[];
  constructor({canvas, dispatch}: PaperAppProps) {
    paper.setup(canvas);
    this.scope = paper;
    this.dispatch = dispatch;
    this.pageTree = new Tree({
      rootNode: new PaperPage({})
    });
    this.page = this.pageTree.root;
    this.selection = [];
    this.selectionTool = new SelectionTool({
      app: this
    });
    this.drawTool = new DrawTool({
      app: this
    });
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