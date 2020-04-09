import paper, { Path, Color, Point, PointText, Size } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import PaperApp from './app';
import PaperArtboard from './base/artboard';
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

const renderCanvas = async ({ sketchDocument, sketchImages, sketchPages, canvas, dispatch }: RenderCanvas): Promise<PaperApp> => {
  // const page = sketchPages.find((sketchPage) => sketchPage.name === 'sketch-animate');
  // const symbolsPage = getSymbolsPage({sketchPages});
  // const symbols = symbolsPage ? symbolsPage.layers as FileFormat.SymbolMaster[] : null;
  // const artboards = page.layers.filter((layer) => layer._class === 'artboard') as FileFormat.Artboard[];
  // const images = getBase64Images({sketchImages});
  const app = new PaperApp({canvas, dispatch});
  app.page.addLayer({
    layer: new PaperArtboard({
      size: {width: 375, height: 812},
      position: {x: 0, y: 0},
      dispatch: dispatch,
      parent: app.page
    })
  })
  // artboards.forEach((artboard) => {
  //   renderArtboard({artboard, symbols, images, dispatch});
  // });
  return app;
};

export default renderCanvas;