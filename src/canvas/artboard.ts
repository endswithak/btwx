import paper, { Group, Rectangle, view, Shape, Layer } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from './layers';

interface RenderArtboardBackground {
  artboard: FileFormat.Artboard;
  container: paper.Group;
}

const renderArtboardBackground = ({ artboard, container }: RenderArtboardBackground): void => {
  // artboard background
  const artboardBackground = new Layer({
    parent: container
  });
  // artboard rectangle
  const artboardRectangle = new Rectangle({
    x: 0,
    y: 0,
    width: artboard.frame.width,
    height: artboard.frame.height
  });
  // artboard canvas
  new Shape.Rectangle({
    rectangle: artboardRectangle,
    fillColor: '#ffffff',
    parent: artboardBackground
  });
  // artboard backgroundColor
  if (artboard.hasBackgroundColor) {
    new Shape.Rectangle({
      rectangle: artboardRectangle,
      fillColor: artboard.backgroundColor,
      parent: artboardBackground
    });
  }
};

interface RenderArtboard {
  artboard: FileFormat.Artboard;
  symbols: FileFormat.SymbolMaster[] | null;
  images: {
    [id: string]: string;
  };
}

const renderArtboard = ({ artboard, symbols, images }: RenderArtboard): paper.Group => {
  console.log(artboard);
  const artboardContainer = new Group();
  renderArtboardBackground({
    artboard: artboard,
    container: artboardContainer
  });
  renderLayers({
    layers: artboard.layers,
    container: artboardContainer,
    symbols: symbols,
    images: images
  });
  artboardContainer.position = view.center;
  artboardContainer.position.x += artboard.frame.x;
  artboardContainer.position.y += artboard.frame.y;
  return artboardContainer;
};

export default renderArtboard;