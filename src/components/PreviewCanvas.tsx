/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { gsap } from 'gsap';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getAllArtboardTweenEvents, getAllArtboardTweenEventArtboards, getAllArtboardTweens, getAllArtboardTweenLayers, getAllArtboardTweenLayerDestinations, getAllArtboardTweenEventLayers } from '../store/selectors/layer';
import { bufferToBase64 } from '../utils';
import * as previewUtils from '../previewUtils';

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
  tweenEventLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  tweenEventDestinations: {
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
  tweenLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  tweenLayerDestinations: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
  touchCursor: boolean;
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, touchCursor, tweenEvents, tweenEventLayers, tweenEventDestinations, tweens, tweenLayers, tweenLayerDestinations, setActiveArtboard, documentImagesById } = props;

  const handleResize = (): void => {
    paperPreview.view.viewSize = new paperPreview.Size(
      canvasContainerRef.current.clientWidth,
      canvasContainerRef.current.clientHeight
    );
    paperPreview.view.center = new paperPreview.Point(activeArtboard.frame.x, activeArtboard.frame.y);
  }

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
    paperPreview.view.center = new paperPreview.Point(activeArtboard.frame.x, activeArtboard.frame.y);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // 1. clear current canvas
    paperPreview.project.clear();
    // 2. import updated paperProject
    paperPreview.project.importJSON(paperProject);
    // 3. store relevant origin and destination layer vars
    const paperActiveArtboard = paperPreview.project.getItem({ data: { id: activeArtboard.id } }) as paper.Item;
    const paperTweenEventLayersById = tweenEventLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenEventDestinationsById = tweenEventDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenLayersById = tweenLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenLayerDestinationsById = tweenLayerDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    // 4. clear project
    paperPreview.project.clear();
    // 5. add active artboard
    paperPreview.project.addLayer(new paperPreview.Layer({
      children: [paperActiveArtboard],
      position: paperPreview.view.center
    }));
    // 6. set timeline vars
    const timelines = {} as {
      [id: string]: gsap.core.Timeline;
    };
    const timelineProps = {} as {
      [tweenId: string]: {
        [tweenProp: string]: any;
      };
    };
    const eventLayerFunctions = {} as {
      [id: string]: any;
    };
    // 7. create timelines for each tween event
    tweenEvents.allIds.forEach((eventId) => {
      const tweenEvent = tweenEvents.byId[eventId];
      const tweenEventPaperLayer = paperTweenEventLayersById[tweenEvent.layer];
      const tweenEventTweensById = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current): {[id: string]: em.Tween} => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      // create event timeline and add it to global timelines
      timelines[eventId] = gsap.timeline({
        paused: true,
        onStart: () => {
          tweenEvents.allIds.forEach((id) => {
            const tweenEvent = tweenEvents.byId[id];
            paperTweenEventLayersById[tweenEvent.layer].off(tweenEvent.event, eventLayerFunctions[id]);
          });
        },
        onComplete: () => {
          setActiveArtboard({id: tweenEvent.destinationArtboard, scope: 2});
        }
      });
      // add tweens to event timeline
      Object.keys(tweenEventTweensById).forEach((tweenId) => {
        timelineProps[tweenId] = {};
        const tween = tweenEventTweensById[tweenId];
        previewUtils.addTweens({
          tween: tween,
          timeline: timelines[eventId],
          timelineTweenProps: timelineProps[tweenId],
          originLayerItem: tweenLayers.byId[tween.layer],
          destinationLayerItem: tweenLayerDestinations.byId[tween.destinationLayer],
          originPaperLayer: paperTweenLayersById[tween.layer],
          destinationPaperLayer: paperTweenLayerDestinationsById[tween.destinationLayer],
          originArtboardLayerItem: tweenEventDestinations.byId[tweenEvent.artboard] as em.Artboard,
          destinationArtboardLayerItem: tweenEventDestinations.byId[tweenEvent.destinationArtboard] as em.Artboard,
          originArtboardPaperLayer: paperTweenEventDestinationsById[tweenEvent.artboard],
          destinationArtboardPaperLayer: paperTweenEventDestinationsById[tweenEvent.destinationArtboard]
        });
      });
      // set event layer function
      eventLayerFunctions[eventId] = (e: paper.MouseEvent | paper.KeyEvent) => {
        timelines[eventId].play();
      };
      // play timeline on event
      tweenEventPaperLayer.on(tweenEvent.event, eventLayerFunctions[eventId]);
    });
  }, [paperProject, activeArtboard]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}
      style={{
        cursor: touchCursor ? `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAGqADAAQAAAABAAAAGgAAAABvAZQwAAADhElEQVRIDbWWT0tbQRTFk6hNrbYSFWyphUIWFdy4FFwZd25dKn4R134AP4Lixq0Ll4ILwaXLWLAtNKUVlFCxtol/0vO7fed1jJZCoRduZub+OefOvPfupFj4uxQVUpIyWsnqJHqbzbE/KCT+SQBHH0nLmfZlNg0FwK+krUzbmQ37PXmICBsEgA9MTExUlpeXR2q12tPx8fFHo6OjsavT09PbRqPR2t3dvdjY2Dir1+tNxX+TQnxvh91ErHukT8bGxkZWV1dfLS0tPSuXy9g5KgA81zRiO61Wq7C5uXm+srLy8eTk5Ez2S+mNlJyQlMgkg9PT0y+U+LparfYqigTHMUdMRlEIgKXj4+MbFfbh4ODgs9YX0pzMALJFdQMiebmzs1OtVCr4CPQuTOgqu8lY9zSbzc78/PyxyD5pzVFGcSaKZ6Ljer6/vz+R7MRn7WNTXr4bE5GLMIays5mZmbqO8Yts8czYelSicWhtba06NzfXrznABvfco3epkIhxsaxjPjw83KsTKW9vb5/LBlEHB9qvt2v88PDwjR48uzAY4D4y22QKca53RNHeVVEvSGlqauqt3saG7N/tKPMKi8RV/4L6/WsS/BTSXQyRzmUs8KaCyVRa4q2isnKtVhvM5qxTQD8nE9ivsFzYDX77YswwISqaqI+PMQumeogIRk2QjjLHMTFawPKuwOgRJiR0kyJHB1hJX7zPWsu8MhLwW1Iy5oj9rD1n7GSYwfEQeAQlSXHmyVrTO5L6fRLpGMEQYbyld2XpTmQZ1SR21qlmrtiJd5PnCzOwFdQx0RUNUgYeqr8tJwBgcHw8CzS1mcRjYGSYdPicKLqwDAgEJBAMGKPn3aT4U5vJA4POLn98sDg4shatXh+ZSWTKxTaTGiwtxsGOLdDRwZQjWhBJSJv7hFavuQE8pgTeGbZ4bTXa751HnrC+ZncUF2KAMhJc7mqq7NQdgRi/LABROcIcRSAKEjXV6+6mCgECSJtLi/tErZ51JGlMK2ae2u3L7eSCkV2Avt6jCuXmcqM3pb23t3c9Ozs7pC4MAGIgSKzY7ijXw8LCwvvs4uMu8incI+JIrkX2Y2tr61Kt/vHk5GR/by9v8x0CyExCpy6ur6+fLy4uvjs6OjqRzxeejziSAUnFIPSp7j8nfW5VfIx8J//65yQldMX/7e9WSsbcO/SzYUQ4FivPIj8mnN3yE/4Ik03mkJJbAAAAAElFTkSuQmCC) 12 12, auto` : 'default'
      }}>
      <canvas
        id='canvas-preview'
        ref={canvasRef}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, documentSettings, preview } = state;
  const paperProject = documentSettings.images.allIds.reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(documentSettings.images.byId[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, layer.present.paperProject);
  const tweenEvents = getAllArtboardTweenEvents(layer.present, layer.present.activeArtboard);
  const tweenEventDestinations = getAllArtboardTweenEventArtboards(layer.present, layer.present.activeArtboard);
  const tweenEventLayers = getAllArtboardTweenEventLayers(layer.present, layer.present.activeArtboard);
  const tweens = getAllArtboardTweens(layer.present, layer.present.activeArtboard);
  const tweenLayers = getAllArtboardTweenLayers(layer.present, layer.present.activeArtboard);
  const tweenLayerDestinations = getAllArtboardTweenLayerDestinations(layer.present, layer.present.activeArtboard);
  const documentImagesById = documentSettings.images.byId;
  const touchCursor = preview.touchCursor;
  return {
    activeArtboard: layer.present.byId[layer.present.activeArtboard],
    page: layer.present.page,
    paperProject,
    tweenEvents,
    tweenEventLayers,
    tweenEventDestinations,
    tweens,
    tweenLayers,
    tweenLayerDestinations,
    documentImagesById,
    touchCursor
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);