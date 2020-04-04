import paper, { Group, Rectangle, Path, view, Shape, Layer } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from './layers';

interface RenderArtboardLayersMask {
  artboard: FileFormat.Artboard;
  container: paper.Group;
}

const renderArtboardLayersMask = ({ artboard, container }: RenderArtboardLayersMask): void => {
  new Path.Rectangle({
    name: 'layers-mask',
    position: [artboard.frame.width / 2, artboard.frame.height / 2],
    size: [artboard.frame.width, artboard.frame.height],
    fillColor: '#ffffff',
    parent: container,
    clipMask: true
  });
};

interface RenderArtboardBackground {
  artboard: FileFormat.Artboard;
  container: paper.Group;
}

const renderArtboardBackground = ({ artboard, container }: RenderArtboardBackground): void => {
  // artboard rectangle
  const artboardRectangle = new Rectangle({
    position: [0,0],
    size: [artboard.frame.width, artboard.frame.height]
  });
  // artboard canvas
  new Shape.Rectangle({
    rectangle: artboardRectangle,
    fillColor: '#ffffff',
    parent: container
  });
  // artboard backgroundColor
  if (artboard.hasBackgroundColor) {
    new Shape.Rectangle({
      rectangle: artboardRectangle,
      fillColor: artboard.backgroundColor,
      parent: container
    });
  }
};

interface RenderArtboard {
  artboard: FileFormat.Artboard;
  symbols: FileFormat.SymbolMaster[] | null;
  images: {
    [id: string]: string;
  };
  dispatch: any;
}

const renderArtboard = ({ artboard, symbols, images, dispatch }: RenderArtboard): paper.Group => {
  console.log(artboard);
  const artboardContainer = new Group({
    name: artboard.name,
    data: {
      frame: {
        width: artboard.frame.width,
        height: artboard.frame.height,
      },
      sketch: {
        name: artboard.name,
        id: artboard.do_objectID,
        type: 'shapePath',
        frame: artboard.frame
      }
    }
  });
  const artboardBackground = new Group({
    name: 'background',
    parent: artboardContainer
  });
  const artboardLayers = new Group({
    name: 'layers',
    parent: artboardContainer
  });
  renderArtboardBackground({
    artboard: artboard,
    container: artboardBackground
  });
  // renderArtboardLayersMask({
  //   artboard: artboard,
  //   container: artboardContainer
  // });
  renderLayers({
    layers: artboard.layers,
    container: artboardLayers,
    symbols: symbols,
    images: images,
    dispatch: dispatch
  });
  artboardContainer.position = view.center;
  //artboardContainer.position.x += artboard.frame.x;
  //artboardContainer.position.y += artboard.frame.y;
  dispatch({
    type: 'add-artboard',
    artboard: artboardContainer
  });
  return artboardContainer;
};

export default renderArtboard;