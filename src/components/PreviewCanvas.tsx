import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getLongestEventTween, getPositionInArtboard } from '../store/selectors/layer';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

interface PreviewCanvasProps {
  layer?: any;
  paperProject?: string;
  activeArtboard?: string;
  page?: string;
  allAnimationEventIds: string[];
  animationEventById?: {
    [id: string]: em.AnimationEvent;
  };
  allTweenIds?: string[];
  tweenById?: {
    [id: string]: em.Tween;
  };
  allLayerIds?: string[];
  layerById?: {
    [id: string]: em.Layer;
  };
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, allAnimationEventIds, animationEventById, allTweenIds, tweenById, allLayerIds, layerById, setActiveArtboard } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
  }, []);

  useEffect(() => {
    paperPreview.project.clear();
    paperPreview.project.importJSON(paperProject);
    const paperLayersById = allLayerIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    paperPreview.project.clear();
    const rootLayer = new paper.Layer();
    paperPreview.project.addLayer(rootLayer);
    paperLayersById[activeArtboard].parent = rootLayer;
    paperLayersById[activeArtboard].position = paperPreview.view.center;
    // add animation events
    allAnimationEventIds.forEach((eventId) => {
      const animationEvent = animationEventById[eventId];
      const eventArtboardPaperLayer = paperLayersById[animationEvent.artboard];
      const eventDestinationArtboardPaperLayer = paperLayersById[animationEvent.destinationArtboard];
      const eventPaperLayer = paperLayersById[animationEvent.layer];
      const eventTweenById = animationEvent.tweens.reduce((result: {[id: string]: em.Tween}, current) => {
        result[current] = tweenById[current];
        return result;
      }, {});
      const longestTween = getLongestEventTween(eventTweenById);
      // add tweens for each animation event
      eventPaperLayer.on(animationEvent.event, (e) => {
        Object.keys(eventTweenById).forEach((tweenId) => {
          let paperTween: gsap.core.Tween;
          let animateProp: any = {};
          const tween = eventTweenById[tweenId];
          const tweenPaperLayer = paperLayersById[tween.layer];
          const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenPaperLayer, eventArtboardPaperLayer);
          const tweenDestinationLayerPaperLayer = paperLayersById[tween.destinationLayer];
          const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayerPaperLayer, eventDestinationArtboardPaperLayer);
          const tweenPaperLayerPositionDiffX = tweenDestinationLayerArtboardPosition.x - tweenPaperLayerArtboardPosition.x;
          const tweenPaperLayerPositionDiffY = tweenDestinationLayerArtboardPosition.y - tweenPaperLayerArtboardPosition.y;
          switch(tween.prop) {
            case 'shapePath': {
              const morphData = [
                (tweenPaperLayer as paper.Path).pathData,
                (tweenDestinationLayerPaperLayer as paper.Path).pathData
              ];
              MorphSVGPlugin.pathFilter(morphData);
              animateProp[tween.prop] = morphData[0];
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: morphData[1],
                onUpdate: () => {
                  (tweenPaperLayer as paper.Path).pathData = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'fillColor': {
              animateProp[tween.prop] = tweenPaperLayer.fillColor.toCSS(true);
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                onUpdate: () => {
                  tweenPaperLayer.fillColor = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'strokeColor': {
              animateProp[tween.prop] = tweenPaperLayer.strokeColor.toCSS(true);
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                onUpdate: () => {
                  tweenPaperLayer.strokeColor = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'strokeWidth': {
              animateProp[tween.prop] = tweenPaperLayer.strokeWidth;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.strokeWidth,
                onUpdate: () => {
                  tweenPaperLayer.strokeWidth = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'x': {
              animateProp[tween.prop] = tweenPaperLayer.position.x;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: `-=${tweenPaperLayerPositionDiffX}`,
                onUpdate: () => {
                  tweenPaperLayer.position.x = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'y': {
              animateProp[tween.prop] = tweenPaperLayer.position.y;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: `-=${tweenPaperLayerPositionDiffY}`,
                onUpdate: () => {
                  tweenPaperLayer.position.y = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'width': {
              animateProp[tween.prop] = tweenPaperLayer.bounds.width;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.bounds.width,
                onUpdate: () => {
                  tweenPaperLayer.bounds.width = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'height': {
              animateProp[tween.prop] = tweenPaperLayer.bounds.height;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.bounds.height,
                onUpdate: () => {
                  tweenPaperLayer.bounds.height = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'rotation': {
              animateProp[tween.prop] = tweenPaperLayer.rotation;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.rotation,
                onUpdate: () => {
                  tweenPaperLayer.rotation = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowColor': {
              animateProp[tween.prop] = tweenPaperLayer.shadowColor;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowColor,
                onUpdate: () => {
                  tweenPaperLayer.shadowColor = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowOffsetX': {
              animateProp[tween.prop] = tweenPaperLayer.shadowOffset.x;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.x,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset.x = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowOffsetY': {
              animateProp[tween.prop] = tweenPaperLayer.shadowOffset.y;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.y,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset.y = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'shadowBlur': {
              animateProp[tween.prop] = tweenPaperLayer.shadowBlur;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.shadowBlur,
                onUpdate: () => {
                  tweenPaperLayer.shadowBlur = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
            case 'opacity': {
              animateProp[tween.prop] = tweenPaperLayer.opacity;
              paperTween = gsap.to(animateProp, {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.opacity,
                onUpdate: () => {
                  tweenPaperLayer.opacity = animateProp[tween.prop];
                },
                ease: tween.ease,
                delay: tween.delay
              });
              break;
            }
          }
          if (tween.id === longestTween.id) {
            paperTween.then(() => {
              setActiveArtboard({id: animationEvent.destinationArtboard});
            });
          }
        });
      });
    });
  }, [paperProject, activeArtboard, allAnimationEventIds, animationEventById]);

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
  const allAnimationEventIds: string[] = [];
  const animationEventById = Object.keys(layer.present.animationEventById).reduce((result: {[id: string]: em.AnimationEvent}, current) => {
    if (layer.present.animationEventById[current].artboard === layer.present.activeArtboard) {
      result[current] = layer.present.animationEventById[current];
      allAnimationEventIds.push(current);
    }
    return result;
  }, {});
  const allTweenIds: string[] = [];
  const tweenById = Object.keys(animationEventById).reduce((result: {[id: string]: em.Tween}, current) => {
    animationEventById[current].tweens.forEach((tween) => {
      result[tween] = layer.present.tweenById[tween];
      allTweenIds.push(tween);
    });
    return result;
  }, {});
  const allLayerIds: string[] = [layer.present.activeArtboard];
  const layerById = {
    [layer.present.activeArtboard]: layer.present.byId[layer.present.activeArtboard]
  }
  Object.keys(tweenById).forEach((current) => {
    if (!allLayerIds.includes(tweenById[current].layer)) {
      layerById[tweenById[current].layer] = layer.present.byId[tweenById[current].layer];
      allLayerIds.push(tweenById[current].layer);
    } else if (!allLayerIds.includes(tweenById[current].destinationLayer)) {
      layerById[tweenById[current].destinationLayer] = layer.present.byId[tweenById[current].destinationLayer];
      allLayerIds.push(tweenById[current].destinationLayer);
    } else if (!allLayerIds.includes(animationEventById[tweenById[current].event].artboard)) {
      layerById[animationEventById[tweenById[current].event].artboard] = layer.present.byId[animationEventById[tweenById[current].event].artboard];
      allLayerIds.push(animationEventById[tweenById[current].event].artboard);
    } else if (!allLayerIds.includes(animationEventById[tweenById[current].event].destinationArtboard)) {
      layerById[animationEventById[tweenById[current].event].destinationArtboard] = layer.present.byId[animationEventById[tweenById[current].event].destinationArtboard];
      allLayerIds.push(animationEventById[tweenById[current].event].destinationArtboard);
    }
  });
  return {
    paperProject: layer.present.paperProject,
    activeArtboard: layer.present.activeArtboard,
    page: layer.present.page,
    allAnimationEventIds,
    animationEventById,
    allTweenIds,
    tweenById,
    allLayerIds,
    layerById
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);