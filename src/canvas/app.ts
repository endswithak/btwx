import paper, { Point } from 'paper';
import DrawTool from './drawTool';

class PaperApp {
  dispatch: any;
  scope: paper.PaperScope;
  drawTool: DrawTool;
  constructor(canvas: HTMLCanvasElement, dispatch: any) {
    paper.setup(canvas);
    this.scope = paper;
    this.dispatch = dispatch;
    this.drawTool = null;
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
  enableDrawTool(shape: em.ShapeType): void {
    this.drawTool = new DrawTool(shape, this.dispatch);
  }
  disableDrawTool(): void {
    if (this.drawTool) {
      this.drawTool.destroy();
      this.drawTool = null;
    }
  }
}

export default PaperApp;