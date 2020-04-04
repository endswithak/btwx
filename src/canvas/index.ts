import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderApp from './app';
import renderArtboard from './artboard';
import { getSymbolsPage, getBase64Images } from './utils';

interface RenderCanvas {
  sketchDocument: FileFormat.Document;
  sketchPages: FileFormat.Page[];
  sketchImages: {
    [id: string]: Buffer;
  };
  dispatch: any;
  canvas: HTMLCanvasElement;
}

const renderCanvas = async ({ sketchDocument, sketchImages, sketchPages, canvas, dispatch }: RenderCanvas): Promise<paper.Project> => {
  const page = sketchPages.find((sketchPage) => sketchPage.name === 'sketch-animate');
  const symbolsPage = getSymbolsPage({sketchPages});
  const symbols = symbolsPage ? symbolsPage.layers as FileFormat.SymbolMaster[] : null;
  const artboards = page.layers.filter((layer) => layer._class === 'artboard') as FileFormat.Artboard[];
  const images = getBase64Images({sketchImages});
  renderApp({canvas, dispatch});
  artboards.forEach((artboard) => {
    renderArtboard({artboard, symbols, images, dispatch});
  });
  return paper.project;
};

export default renderCanvas;