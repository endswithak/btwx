import React, { ReactElement, useEffect } from 'react';
import { getPaperFillColor } from '../store/utils/paper';
import { uiPaperScope } from '../canvas';

interface CanvasArtboardLayerProps {
  id: string;
  layerItem: Btwx.Artboard;
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasArtboardLayer = (props: CanvasArtboardLayerProps): ReactElement => {
  const { id, layerItem, rendered, setRendered } = props;

  const createArtboard = () => {
    new uiPaperScope.Group({
      name: layerItem.name,
      data: { id: id, type: 'Layer', layerType: 'Artboard', scope: ['root'] },
      children: [
        new uiPaperScope.Path.Rectangle({
          name: 'Artboard Background',
          from: new uiPaperScope.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2)),
          to: new uiPaperScope.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2)),
          data: { id: 'artboardBackground', type: 'LayerChild', layerType: 'Artboard' },
          fillColor: getPaperFillColor(layerItem.style.fill, layerItem.frame),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new uiPaperScope.Point(0, 2),
          shadowBlur: 10
        }),
        new uiPaperScope.Group({
          name: 'Artboard Masked Layers',
          data: { id: 'artboardMaskedLayers', type: 'LayerChild', layerType: 'Artboard' },
          children: [
            new uiPaperScope.Path.Rectangle({
              name: 'Artboard Layers Mask',
              from: new uiPaperScope.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2)),
              to: new uiPaperScope.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2)),
              data: { id: 'artboardLayersMask', type: 'LayerChild', layerType: 'Artboard' },
              fillColor: '#fff',
              clipMask: true
            }),
            new uiPaperScope.Group({
              name: 'Artboard Layers',
              data: { id: 'artboardLayers', type: 'LayerChild', layerType: 'Artboard' }
            })
          ]
        })
      ],
      parent: uiPaperScope.projects[layerItem.projectIndex].activeLayer
    });
  }

  useEffect(() => {
    // build layer
    createArtboard();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = uiPaperScope.projects[layerItem.projectIndex].getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <></>
  );
}

export default CanvasArtboardLayer;