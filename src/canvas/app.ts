import paper, { Point } from 'paper';
import DrawTool from './drawTool';
import SelectionTool from './selectionTool';
import PaperPage from './base/page';
import PaperArtboard from './base/artboard';
import PaperGroup from './base/group';
import PaperShape from './base/shape';

interface PaperAppProps {
  canvas: HTMLCanvasElement;
  dispatch: any;
  page?: PaperPage;
}

class PaperApp {
  dispatch: any;
  scope: paper.PaperScope;
  drawTool: DrawTool;
  selectionTool: SelectionTool;
  page: PaperPage;
  selection: (PaperGroup | PaperShape)[];
  constructor({canvas, dispatch, page}: PaperAppProps) {
    paper.setup(canvas);
    this.scope = paper;
    this.dispatch = dispatch;
    this.page = page ? page : new PaperPage({dispatch});
    this.selection = [];
    this.selectionTool = new SelectionTool({
      app: this
    });
    this.drawTool = new DrawTool({
      app: this
    });
    // this.scope.view.on('click', (e: paper.ToolEvent) => {
    //   if (!this.page.paperItem.hitTest(e.point)) {
    //     dispatch({
    //       type: 'set-selected-layer',
    //       layer: null
    //     });
    //   }
    // });
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