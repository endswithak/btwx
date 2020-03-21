import paper, { Group, Rectangle, view, Shape, Layer } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import renderLayers from './layers';

interface RenderArtboard {
  artboard: FileFormat.Artboard;
}

const renderArtboard = async ({ artboard }: RenderArtboard): Promise<paper.Group> => {
  console.log(artboard);
  const artboardContainer = new Group();
  const artboardBackground = new Layer();
  const artboardRectangle = new Rectangle({
    x: 0,
    y: 0,
    width: artboard.frame.width,
    height: artboard.frame.height
  });
  const artboardBackgroundCanvas = new Shape.Rectangle({
    rectangle: artboardRectangle,
    fillColor: '#ffffff'
  });
  artboardBackground.addChild(artboardBackgroundCanvas);
  if (artboard.hasBackgroundColor) {
    const artboardBackgroundColor = new Shape.Rectangle({
      rectangle: artboardRectangle,
      fillColor: artboard.backgroundColor
    });
    artboardBackground.addChild(artboardBackgroundColor);
  }
  artboardContainer.addChild(artboardBackground);
  await renderLayers({
    layers: artboard.layers,
    container: artboardContainer
  });
  artboardContainer.position = view.center;
  artboardContainer.position.x += artboard.frame.x;
  artboardContainer.position.y += artboard.frame.y;
  return artboardContainer;
};

export default renderArtboard;