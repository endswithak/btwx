import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getLongestEventTween, getPositionInArtboard, getAllArtboardTweenEvents, getAllArtboardTweenEventDestinations, getAllArtboardTweens, getAllArtboardTweenLayers, getAllArtboardTweenLayerDestinations } from '../store/selectors/layer';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

interface PreviewCanvasProps {
  layer?: any;
  paperProject?: string;
  activeArtboard?: em.Artboard;
  page?: string;
  tweenEvents: {
    allIds: string[];
    byId: {
      [id: string]: em.TweenEvent;
    };
  };
  destinations: {
    allIds: string[];
    byId: {
      [id: string]: em.Artboard;
    };
  };
  tweens: {
    allIds: string[];
    byId: {
      [id: string]: em.Tween;
    };
  };
  layers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  destinationLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, tweenEvents, destinations, tweens, layers, destinationLayers, setActiveArtboard } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
  }, []);

  useEffect(() => {
    paperPreview.project.clear();
    paperPreview.project.importJSON(paperProject);
    const paperActiveArtboard = paperPreview.project.getItem({ data: { id: activeArtboard.id } });
    const paperDestinationsById = destinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperLayersById = layers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperDestinationLayersById = destinationLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    paperPreview.project.clear();
    const rootLayer = new paper.Layer();
    paperPreview.project.addLayer(rootLayer);
    paperActiveArtboard.parent = rootLayer;
    paperActiveArtboard.position = paperPreview.view.center;
    // add animation events
    tweenEvents.allIds.forEach((eventId) => {
      const tweenEvent = tweenEvents.byId[eventId];
      const tweenEventDestinationArtboardPaperLayer = paperDestinationsById[tweenEvent.destinationArtboard];
      const tweenEventPaperLayer = paperLayersById[tweenEvent.layer];
      const tweenEventTweensById = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current) => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      const longestTween = getLongestEventTween(tweenEventTweensById);
      // add tweens for each animation event
      tweenEventPaperLayer.on(tweenEvent.event, (e) => {
        Object.keys(tweenEventTweensById).forEach((tweenId) => {
          let paperTween: gsap.core.Tween;
          const tweenProp: any = {};
          const tween = tweenEventTweensById[tweenId];
          const tweenPaperLayer = paperLayersById[tween.layer];
          const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenPaperLayer, paperActiveArtboard);
          const tweenDestinationLayerPaperLayer = paperDestinationLayersById[tween.destinationLayer];
          const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayerPaperLayer, tweenEventDestinationArtboardPaperLayer);
          const tweenPaperLayerPositionDiffX = tweenDestinationLayerArtboardPosition.x - tweenPaperLayerArtboardPosition.x;
          const tweenPaperLayerPositionDiffY = tweenDestinationLayerArtboardPosition.y - tweenPaperLayerArtboardPosition.y;
          switch(tween.prop) {
            case 'shapePath': {
              const morphData = [
                (tweenPaperLayer as paper.Path).pathData,
                (tweenDestinationLayerPaperLayer as paper.Path).pathData
              ];
              MorphSVGPlugin.pathFilter(morphData);
              tweenProp[tween.prop] = morphData[0];
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: morphData[1],
                onUpdate: () => {
                  (tweenPaperLayer as paper.Path).pathData = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'fillColor': {
              tweenProp[tween.prop] = tweenPaperLayer.fillColor.toCSS(true);
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                onUpdate: () => {
                  tweenPaperLayer.fillColor = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'strokeColor': {
              tweenProp[tween.prop] = tweenPaperLayer.strokeColor.toCSS(true);
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                onUpdate: () => {
                  tweenPaperLayer.strokeColor = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'strokeWidth': {
              tweenProp[tween.prop] = tweenPaperLayer.strokeWidth;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.strokeWidth,
                onUpdate: () => {
                  tweenPaperLayer.strokeWidth = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'x': {
              tweenProp[tween.prop] = tweenPaperLayer.position.x;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: `-=${tweenPaperLayerPositionDiffX}`,
                onUpdate: () => {
                  tweenPaperLayer.position.x = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'y': {
              tweenProp[tween.prop] = tweenPaperLayer.position.y;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: `-=${tweenPaperLayerPositionDiffY}`,
                onUpdate: () => {
                  tweenPaperLayer.position.y = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'width': {
              tweenProp[tween.prop] = tweenPaperLayer.bounds.width;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.bounds.width,
                onUpdate: () => {
                  tweenPaperLayer.bounds.width = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'height': {
              tweenProp[tween.prop] = tweenPaperLayer.bounds.height;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.bounds.height,
                onUpdate: () => {
                  tweenPaperLayer.bounds.height = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'rotation': {
              tweenProp[tween.prop] = tweenPaperLayer.rotation;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.rotation,
                onUpdate: () => {
                  tweenPaperLayer.rotation = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowColor': {
              tweenProp[tween.prop] = tweenPaperLayer.shadowColor;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowColor,
                onUpdate: () => {
                  tweenPaperLayer.shadowColor = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowOffsetX': {
              tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.x;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.x,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset.x = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowOffsetY': {
              tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.y;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.y,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset.y = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowBlur': {
              tweenProp[tween.prop] = tweenPaperLayer.shadowBlur;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowBlur,
                onUpdate: () => {
                  tweenPaperLayer.shadowBlur = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'opacity': {
              tweenProp[tween.prop] = tweenPaperLayer.opacity;
              paperTween = gsap.to(tweenProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.opacity,
                onUpdate: () => {
                  tweenPaperLayer.opacity = tweenProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
          }
          if (tween.id === longestTween.id) {
            paperTween.then(() => {
              setActiveArtboard({id: tweenEvent.destinationArtboard});
            });
          }
        });
      });
    });
  }, [paperProject, activeArtboard, tweens, tweenEvents]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-preview'
        ref={canvasRef}
        onClick={() => (document.activeElement as HTMLElement).blur()}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const tweenEvents = getAllArtboardTweenEvents(layer.present, layer.present.activeArtboard);
  const destinations = getAllArtboardTweenEventDestinations(layer.present, layer.present.activeArtboard);
  const tweens = getAllArtboardTweens(layer.present, layer.present.activeArtboard);
  const layers = getAllArtboardTweenLayers(layer.present, layer.present.activeArtboard);
  const destinationLayers = getAllArtboardTweenLayerDestinations(layer.present, layer.present.activeArtboard);
  return {
    paperProject: layer.present.paperProject,
    activeArtboard: layer.present.byId[layer.present.activeArtboard],
    page: layer.present.page,
    tweenEvents,
    destinations,
    tweens,
    layers,
    destinationLayers
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);