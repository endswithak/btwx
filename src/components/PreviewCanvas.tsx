import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getLongestEventTween, getPositionInArtboard } from '../store/selectors/layer';
//import { getLongestAnimationByDestination, getDestinationAnimations, getPositionInArtboard } from '../store/selectors/preview';

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
      const eventArtboard = layerById[animationEvent.artboard];
      const eventArtboardPaperLayer = paperLayersById[animationEvent.artboard];
      const eventDestinationArtboard = layerById[animationEvent.destinationArtboard];
      const eventDestinationArtboardPaperLayer = paperLayersById[animationEvent.destinationArtboard];
      const eventLayer = layerById[animationEvent.layer];
      const eventPaperLayer = paperLayersById[animationEvent.layer];
      const eventTweenById = animationEvent.tweens.reduce((result: {[id: string]: em.Tween}, current) => {
        result[current] = tweenById[current];
        return result;
      }, {});
      const longestTween = getLongestEventTween(eventTweenById);
      // add tweens for each animation event
      eventPaperLayer.on(animationEvent.event, (e) => {
        Object.keys(eventTweenById).forEach((tweenId) => {
          let paperTween: paper.Tween;
          const tween = eventTweenById[tweenId];
          const tweenPaperLayer = paperLayersById[tween.layer];
          const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenPaperLayer, eventArtboardPaperLayer);
          const tweenDestinationLayerPaperLayer = paperLayersById[tween.destinationLayer];
          const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayerPaperLayer, eventDestinationArtboardPaperLayer);
          const tweenPaperLayerPositionDiffX = tweenDestinationLayerArtboardPosition.x - tweenPaperLayerArtboardPosition.x;
          const tweenPaperLayerPositionDiffY = tweenDestinationLayerArtboardPosition.y - tweenPaperLayerArtboardPosition.y;
          switch(tween.prop) {
            case 'fillColor':
              paperTween = tweenPaperLayer.tweenTo({
                fillColor: tweenDestinationLayerPaperLayer.fillColor
              }, tween.duration * 1000);
              break;
            case 'strokeColor':
              paperTween = tweenPaperLayer.tweenTo({
                strokeColor: tweenDestinationLayerPaperLayer.strokeColor
              }, tween.duration * 1000);
              break;
            case 'strokeWidth':
              paperTween = tweenPaperLayer.tweenTo({
                strokeWidth: tweenDestinationLayerPaperLayer.strokeWidth
              }, tween.duration * 1000);
              break;
            case 'x':
              paperTween = tweenPaperLayer.tweenTo({
                'position.x': `-=${tweenPaperLayerPositionDiffX}`,
              }, tween.duration * 1000);
              break;
            case 'y':
              paperTween = tweenPaperLayer.tweenTo({
                'position.y': `-=${tweenPaperLayerPositionDiffY}`,
              }, tween.duration * 1000);
              break;
            case 'width':
              paperTween = tweenPaperLayer.tweenTo({
                'bounds.width': tweenDestinationLayerPaperLayer.bounds.width,
              }, tween.duration * 1000);
              break;
            case 'height':
              paperTween = tweenPaperLayer.tweenTo({
                'bounds.height': tweenDestinationLayerPaperLayer.bounds.height,
              }, tween.duration * 1000);
              break;
            case 'rotation':
              paperTween = tweenPaperLayer.tweenTo({
                rotation: tweenDestinationLayerPaperLayer.rotation,
              }, tween.duration * 1000);
              break;
            case 'shadowColor':
              paperTween = tweenPaperLayer.tweenTo({
                shadowColor: tweenDestinationLayerPaperLayer.shadowColor,
              }, tween.duration * 1000);
              break;
            case 'shadowOffsetX':
              paperTween = tweenPaperLayer.tweenTo({
                'shadowOffset.x': tweenDestinationLayerPaperLayer.shadowOffset.x,
              }, tween.duration * 1000);
              break;
            case 'shadowOffsetY':
              paperTween = tweenPaperLayer.tweenTo({
                'shadowOffset.y': tweenDestinationLayerPaperLayer.shadowOffset.y,
              }, tween.duration * 1000);
              break;
            case 'shadowBlur':
              paperTween = tweenPaperLayer.tweenTo({
                shadowBlur: tweenDestinationLayerPaperLayer.shadowBlur,
              }, tween.duration * 1000);
              break;
            case 'opacity':
              paperTween = tweenPaperLayer.tweenTo({
                opacity: tweenDestinationLayerPaperLayer.opacity,
              }, tween.duration * 1000);
              break;
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