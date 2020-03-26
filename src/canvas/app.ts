import paper, { Point } from 'paper';

interface RenderApp {
  canvas: HTMLCanvasElement;
}

const renderApp = ({ canvas }: RenderApp): void => {
  paper.setup(canvas);
  paper.view.on('wheel', (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const nextZoom = paper.view.zoom - e.deltaY * 0.01;
      paper.view.center.x = e.clientX;
      paper.view.center.y = e.clientY;
      if (e.deltaY < 0 && nextZoom < 30) {
        paper.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        paper.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom < 0) {
        paper.view.zoom = 0.001;
      }
    } else {
      paper.view.translate(new Point(e.deltaX * -1, e.deltaY * -1));
    }
  });
};

export default renderApp;