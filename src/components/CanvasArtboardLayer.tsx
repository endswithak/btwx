import React, { ReactElement, useEffect, useState } from 'react';
import { getPaperFillColor } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import CanvasLayerFrame from './CanvasLayerFrame';
import CanvasLayerStyle from './CanvasLayerStyle';
import CanvasLayers from './CanvasLayers';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasArtboardLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasArtboardLayer = (props: CanvasLayerContainerProps & CanvasArtboardLayerProps): ReactElement => {
  const { id, paperScope, layerItem, parentItem, artboardItem, projectIndex, rendered, tweening, setRendered } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;
  const [prevTweening, setPrevTweening] = useState(tweening);

  const createArtboard = () => {
    const artboardBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2)),
      to: new paperLayerScope.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2))
    });
    new paperLayerScope.Group({
      name: layerItem.name,
      data: { id, type: 'Layer', layerType: 'Artboard', scope: ['root'] },
      children: [
        new paperLayerScope.Path.Rectangle({
          name: 'Artboard Background',
          rectangle: artboardBounds,
          data: { id: 'artboardBackground', type: 'LayerChild', layerType: 'Artboard' },
          fillColor: getPaperFillColor({
            fill: layerItem.style.fill,
            layerFrame: layerItem.frame,
            artboardFrame: null,
            isLine: false
          }),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new paperLayerScope.Point(0, 2),
          shadowBlur: 10
        }),
        new paperLayerScope.Group({
          name: 'Artboard Masked Layers',
          data: { id: 'artboardMaskedLayers', type: 'LayerChild', layerType: 'Artboard' },
          children: [
            new paperLayerScope.Path.Rectangle({
              name: 'Artboard Layers Mask',
              rectangle: artboardBounds,
              data: { id: 'artboardLayersMask', type: 'LayerChild', layerType: 'Artboard' },
              fillColor: '#fff',
              clipMask: true
            }),
            new paperLayerScope.Group({
              name: 'Artboard Layers',
              data: { id: 'artboardLayers', type: 'LayerChild', layerType: 'Artboard' }
            })
          ]
        })
      ],
      parent: paperProject.activeLayer
    });
  }

  useEffect(() => {
    // build layer
    createArtboard();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  useEffect(() => {
    if (prevTweening !== tweening && paperScope === 'preview') {
      if (!tweening) {
        const paperLayer = paperProject.getItem({data: {id}});
        const background = paperLayer.getItem({data:{id:'artboardBackground'}}) as paper.Path.Rectangle;
        paperLayer.data = { id, type: 'Layer', layerType: 'Artboard', scope: ['root'] };
        background.replaceWith(new paperLayerScope.Path.Rectangle({
          name: 'Artboard Background',
          rectangle: background.bounds,
          data: { id: 'artboardBackground', type: 'LayerChild', layerType: 'Artboard' },
          fillColor: getPaperFillColor({
            fill: layerItem.style.fill,
            layerFrame: layerItem.frame,
            artboardFrame: null,
            isLine: false
          }),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new paperLayerScope.Point(0, 2),
          shadowBlur: 10
        }));
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

  return (
    <>
      {
        rendered && layerItem.children.length > 0
        ? <CanvasLayers
            layers={layerItem.children}
            paperScope={paperScope} />
        : null
      }
      <CanvasLayerFrame
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      <CanvasLayerStyle
        layerItem={layerItem}
        artboardItem={artboardItem}
        parentItem={parentItem}
        paperScope={paperScope}
        rendered={rendered}
        projectIndex={projectIndex} />
      {
        paperScope === 'preview' && rendered && !tweening && !prevTweening
        ? layerItem.events.map((eventId, index) => (
            <CanvasPreviewLayerEvent
              key={eventId}
              eventId={eventId} />
          ))
        : null
      }
    </>
  );
}

export default CanvasLayerContainer(CanvasArtboardLayer);