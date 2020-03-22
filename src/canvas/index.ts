import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderApp from './app';
import renderArtboard from './artboard';
import { getSymbolsPage } from './utils';

interface RenderCanvas {
  sketchDocument: FileFormat.Document;
  sketchPages: FileFormat.Page[];
  canvas: HTMLCanvasElement;
}

const renderCanvas = async ({ sketchDocument, sketchPages, canvas }: RenderCanvas): Promise<void> => {
  const page = sketchPages[0];
  const symbolsPage = getSymbolsPage({sketchPages});
  const symbols = symbolsPage ? symbolsPage.layers as FileFormat.SymbolMaster[] : null;
  const artboard = page.layers[0] as FileFormat.Artboard;
  renderApp({canvas});
  renderArtboard({artboard, symbols});
};

export default renderCanvas;