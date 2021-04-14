import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperFillColor } from '../store/utils/paper';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayer from './CanvasLayer';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasArtboardLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

const CanvasArtboardLayer = (props: CanvasArtboardLayerProps): ReactElement => {
  const { id, paperScope } = props;
  const layerItem: Btwx.Artboard = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Artboard);
  const projectIndex: number = useSelector((state: RootState) => state.layer.present.byId[id] ? (state.layer.present.byId[id] as Btwx.Artboard).projectIndex : null);
  const project = paperScope === 'main' ? projectIndex ? paperMain.projects[projectIndex] : null : paperPreview.project;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const tweening = useSelector((state: RootState) => state.preview.tweening === id);
  const [rendered, setRendered] = useState<boolean>(false);
  const [prevTweening, setPrevTweening] = useState(tweening);
  const [eventInstance, setEventInstance] = useState(0);

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    layers: paper.Group;
    layersMask: paper.Path.Rectangle;
    maskedLayers: paper.Group;
    background: paper.Path.Rectangle;
  } => {
    const paperLayer = project.getItem({ data: { id } }) as paper.Group;
    if (paperLayer) {
      const layers = paperLayer.getItem({ data: { id: 'artboardLayers' } }) as paper.Group;
      const layersMask = paperLayer.getItem({ data: { id: 'artboardLayersMask' } }) as paper.Path.Rectangle;
      const maskedLayers = paperLayer.getItem({ data: { id: 'artboardMaskedLayers' } }) as paper.Group;
      const background = paperLayer.getItem({ data: { id: 'artboardBackground' } }) as paper.Path.Rectangle;
      return {
        paperLayer,
        layers,
        layersMask,
        maskedLayers,
        background
      };
    } else {
      return {
        paperLayer: null,
        layers: null,
        layersMask: null,
        maskedLayers: null,
        background: null
      }
    }
  }

  const createArtboard = (paperProject = project) => {
    const artboardBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(
        layerItem.frame.x - (layerItem.frame.width / 2),
        layerItem.frame.y - (layerItem.frame.height / 2)
      ),
      to: new paperLayerScope.Point(
        layerItem.frame.x + (layerItem.frame.width / 2),
        layerItem.frame.y + (layerItem.frame.height / 2)
      )
    });
    new paperLayerScope.Group({
      name: `artboard-${layerItem.name}`,
      data: {
        id,
        type: 'Layer',
        layerType: 'Artboard',
        scope: ['root']
      },
      children: [
        new paperLayerScope.Path.Rectangle({
          name: 'Artboard Background',
          rectangle: artboardBounds,
          data: {
            id: 'artboardBackground',
            type: 'LayerChild',
            layerType: 'Artboard',
            layerId: id
          },
          fillColor: getPaperFillColor({
            fill: layerItem.style.fill,
            isLine: false,
            layerFrame: layerItem.frame,
            artboardFrame: null
          }),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new paperLayerScope.Point(0, 2),
          shadowBlur: 10
        }),
        new paperLayerScope.Group({
          name: 'Artboard Masked Layers',
          data: {
            id: 'artboardMaskedLayers',
            type: 'LayerChild',
            layerType: 'Artboard',
            layerId: id
          },
          children: [
            new paperLayerScope.Path.Rectangle({
              name: 'Artboard Layers Mask',
              rectangle: artboardBounds,
              data: {
                id: 'artboardLayersMask',
                type: 'LayerChild',
                layerType: 'Artboard',
                layerId: id
              },
              fillColor: '#fff',
              clipMask: true
            }),
            new paperLayerScope.Group({
              name: 'Artboard Layers',
              data: {
                id: 'artboardLayers',
                type: 'LayerChild',
                layerType: 'Artboard',
                layerId: id
              }
            })
          ]
        })
      ],
      parent: paperProject.activeLayer
    });
  }

  const applyFill = (): void => {
    const { background } = getPaperLayer();
    background.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: null
    });
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    // build layer
    createArtboard();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = project.getItem({ data: { id } });
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // TWEENING
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (paperScope === 'preview') {
      if (!tweening && prevTweening) {
        const { paperLayer, background } = getPaperLayer();
        paperLayer.data = {
          id,
          type: 'Layer',
          layerType: 'Artboard',
          scope: ['root'],
          layerId: id
        };
        background.replaceWith(new paperLayerScope.Path.Rectangle({
          name: 'Artboard Background',
          rectangle: background.bounds,
          data: {
            id: 'artboardBackground',
            type: 'LayerChild',
            layerType: 'Artboard',
            layerId: id
          },
          fillColor: getPaperFillColor({
            fill: layerItem.style.fill,
            isLine: false,
            layerFrame: layerItem.frame,
            artboardFrame: null
          }),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new paperLayerScope.Point(0, 2),
          shadowBlur: 10
        }));
        setEventInstance(eventInstance + 1);
      }
      setPrevTweening(tweening);
    }
  }, [tweening]);

  ///////////////////////////////////////////////////////
  // FRAME
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer, layersMask, background } = getPaperLayer();
      layersMask.bounds.width = layerItem.frame.innerWidth;
      background.bounds.width = layerItem.frame.innerWidth;
      layersMask.position.x = layerItem.frame.x;
      background.position.x = layerItem.frame.x;
      if (rendered && layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer, layersMask, background } = getPaperLayer();
      layersMask.bounds.height = layerItem.frame.innerHeight;
      background.bounds.height = layerItem.frame.innerHeight;
      layersMask.position.y = layerItem.frame.y;
      background.position.y = layerItem.frame.y;
      if (rendered && layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
    }
  }, [layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer } = getPaperLayer();
      paperLayer.position.x = layerItem.frame.x;
    }
  }, [layerItem.frame.x]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer } = getPaperLayer();
      paperLayer.position.y = layerItem.frame.y;
    }
  }, [layerItem.frame.y]);

  ///////////////////////////////////////////////////////
  // FILL STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered && layerItem) {
      applyFill();
    }
  }, [layerItem.style.fill]);

  ///////////////////////////////////////////////////////
  // CHILDREN & EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered && layerItem
      ? <>
          {
            layerItem.children.length > 0
            ? layerItem.children.map((childId) => (
                <CanvasLayer
                  key={childId}
                  id={childId}
                  paperScope={paperScope} />
              ))
            : null
          }
          {
            layerItem.events.map((eventId) => (
              <CanvasPreviewLayerEvent
                key={eventId}
                eventId={eventId}
                instanceId={`${eventInstance}-${eventId}`} />
            ))
          }
        </>
      : null
    )
  } else {
    return (
      rendered && layerItem && layerItem.children.length > 0
      ? <>
          {
            layerItem.children.map((childId) => (
              <CanvasLayer
                key={childId}
                id={childId}
                paperScope={paperScope} />
            ))
          }
        </>
      : null
    );
  }
}

export default CanvasArtboardLayer;