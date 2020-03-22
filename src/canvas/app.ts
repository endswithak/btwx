import paper from 'paper';

interface RenderApp {
  canvas: HTMLCanvasElement;
}

const renderApp = ({ canvas }: RenderApp): void => {
  paper.setup(canvas);
};

export default renderApp;