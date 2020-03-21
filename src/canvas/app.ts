import paper from 'paper';

interface RenderApp {
  canvas: HTMLCanvasElement;
}

const renderApp = async ({ canvas }: RenderApp): Promise<void> => {
  paper.setup(canvas);
};

export default renderApp;