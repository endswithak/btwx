import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetSymbolsPage {
  sketchPages: FileFormat.Page[];
}

export const getSymbolsPage = ({ sketchPages }: GetSymbolsPage) => {
  return sketchPages.find((page: FileFormat.Page) => {
    return page.layers.length > 0 && page.layers[0]._class === 'symbolMaster';
  });
};