import paper, { Path, Color, Point, PointText, Size } from 'paper';
import PaperApp from './app';
import PaperArtboard from './base/artboard';
import PaperPage from './base/page';

interface RenderCanvas {
  dispatch: any;
  canvas: HTMLCanvasElement;
}

const renderCanvas = async ({ canvas, dispatch }: RenderCanvas): void => {
  const app = new PaperApp({canvas, dispatch});
  app.page.addChild({
    node: new PaperArtboard({
      size: {width: 375, height: 812},
      position: {x: 0, y: 0}
    })
  });
  dispatch({
    type: 'set-paper-app',
    paperApp: app
  });
};

export default renderCanvas;