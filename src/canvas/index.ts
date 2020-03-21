import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderApp from './app';
import renderArtboard from './artboard';

interface RenderCanvas {
  sketchPages: FileFormat.Page[];
  canvas: HTMLCanvasElement;
}

const renderCanvas = async ({ sketchPages, canvas }: RenderCanvas): Promise<void> => {
  const page = sketchPages[0];
  const artboard = page.layers[0] as FileFormat.Artboard;
  await renderApp({canvas});
  await renderArtboard({artboard});
};

export default renderCanvas;