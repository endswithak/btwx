/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { remote } from 'electron';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { getAllArtboardPaperProjects, getEventsByOriginArtboard, getAllArtboardEventsConnectedArtboards, getAllArtboardTweens, getAllArtboardTweenLayers, getAllArtboardTweenDestinationLayers, getAllArtboardEventLayers, getActiveArtboardTextLayers } from '../store/selectors/layer';
import * as previewUtils from '../previewUtils';
import { ThemeContext } from './ThemeProvider';
import PreviewTextLayers from './PreviewTextLayers';

interface PreviewCanvasProps {
  touchCursor: boolean;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const { touchCursor } = props;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const paperProjects = useSelector((state: RootState) => getAllArtboardPaperProjects(state));
  const events = useSelector((state: RootState) => getEventsByOriginArtboard(state, state.layer.present.activeArtboard));
  const eventDestinations = useSelector((state: RootState) => getAllArtboardEventsConnectedArtboards(state, state.layer.present.activeArtboard));
  const eventLayers = useSelector((state: RootState) => getAllArtboardEventLayers(state, state.layer.present.activeArtboard));
  const tweens = useSelector((state: RootState) => getAllArtboardTweens(state, state.layer.present.activeArtboard));
  const tweenLayers = useSelector((state: RootState) => getAllArtboardTweenLayers(state, state.layer.present.activeArtboard));
  const tweenLayerDestinations = useSelector((state: RootState) => getAllArtboardTweenDestinationLayers(state, state.layer.present.activeArtboard));
  // const activeArtboardTextLayers = useSelector((state: RootState) => getActiveArtboardTextLayers(state));
  // const documentImagesById = useSelector((state: RootState) => state.documentSettings.images.byId);
  const documentWindowId = useSelector((state: RootState) => state.preview.documentWindowId);

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
    return (): void => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // 1. clear current canvas
    paperPreview.project.clear();
    // 2. import updated paperProjects
    Object.keys(paperProjects).forEach((key) => {
      paperPreview.project.activeLayer.importJSON(paperProjects[key]);
    });
    // 3. store relevant origin and destination layer vars
    const paperActiveArtboard = paperPreview.project.getItem({ data: { id: activeArtboard.id } }) as paper.Item;
    const paperEventLayersById = eventLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenEventDestinationsById = eventDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenLayersById = tweenLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      const paperLayer = paperPreview.project.getItem({ data: { id: current } });
      const isArtboard = tweenLayers.byId[current].type === 'Artboard';
      result[current] = isArtboard ? paperLayer.getItem({data: {id: 'artboardBackground'}}) : paperLayer;
      return result;
    }, {});
    const paperTweenLayerDestinationsById = tweenLayerDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      const paperLayer = paperPreview.project.getItem({ data: { id: current } });
      const isArtboard = tweenLayerDestinations.byId[current].type === 'Artboard';
      result[current] = isArtboard ? paperLayer.getItem({data: {id: 'artboardBackground'}}) : paperLayer;
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
      [id: string]: (e: paper.MouseEvent | paper.KeyEvent) => void;
    };
    // 7. create timelines for each tween event
    events.allIds.forEach((eventId) => {
      const event = events.byId[eventId];
      const paperLayer = paperEventLayersById[event.layer];
      const tweensById = event.tweens.reduce((result: { [id: string]: Btwx.Tween }, current): {[id: string]: Btwx.Tween} => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      // create event timeline and add it to global timelines
      timelines[eventId] = gsap.timeline({
        paused: true,
        onStart: () => {
          // if (timelines[eventId].data.justification) {
          //   (timelines[eventId].data.justification as string[]).forEach((id, index) => {
          //     const tween = tweensById[id];
          //     const data = {
          //       tween: tween,
          //       timelineTweenProps: timelineProps[id],
          //       originLayerItem: tweenLayers.byId[tween.layer],
          //       destinationLayerItem: tweenLayerDestinations.byId[tween.destinationLayer],
          //       originPaperLayer: paperTweenLayersById[tween.layer],
          //       destinationPaperLayer: paperTweenLayerDestinationsById[tween.destinationLayer],
          //       originArtboardLayerItem: eventDestinations.byId[event.artboard] as Btwx.Artboard,
          //       destinationArtboardLayerItem: eventDestinations.byId[event.destinationArtboard] as Btwx.Artboard,
          //       originArtboardPaperLayer: paperTweenEventDestinationsById[event.artboard],
          //       destinationArtboardPaperLayer: paperTweenEventDestinationsById[event.destinationArtboard]
          //     };
          //     const { timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = data;
          //     const originTextItem = originLayerItem as Btwx.Text;
          //     const destinationTextItem = destinationLayerItem as Btwx.Text;
          //     const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
          //     const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
          //     const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
          //     const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
          //     const newLines = maxLines - originTextItem.lines.length;
          //     const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
          //     const startSkew = originPaperLayer.data.skew || originPaperLayer.data.skew === 0 ? originPaperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
          //     const originJustification = (originLayerItem as Btwx.Text).textStyle.justification;
          //     const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
          //     originPaperLayer.rotation = -startRotation;
          //     // handle lines
          //     [...Array(maxLines).keys()].forEach((key, index) => {
          //       const lines = originTextLinesGroup.children;
          //       let line = originTextLinesGroup.children[index] as paper.PointText;
          //       if (line) {
          //         line.skew(new paperPreview.Point(startSkew, 0));
          //         line.leading = line.fontSize;
          //       } else {
          //         line = new paperPreview.PointText({
          //           point: new paperPreview.Point(originTextContent.point.x, originTextContent.point.y + (index * (originTextContent.style.leading as number))),
          //           content: ' ',
          //           style: lines[0].style,
          //           data: lines[0].data,
          //           parent: originTextLinesGroup
          //         });
          //       }
          //       let startBounds;
          //       let start;
          //       let end;
          //       switch(originJustification) {
          //         case 'left':
          //           startBounds = line.bounds.left;
          //           break;
          //         case 'center':
          //           startBounds = line.bounds.center.x;
          //           break;
          //         case 'right':
          //           startBounds = line.bounds.right;
          //           break;
          //       }
          //       line.justification = destinationJustification;
          //       if (originJustification === 'center') {
          //         line.bounds[originJustification].x = startBounds;
          //       } else {
          //         line.bounds[originJustification] = startBounds;
          //       }
          //       if (destinationJustification === 'center') {
          //         start = line.bounds[destinationJustification].x - originArtboardPaperLayer.bounds.center.x;
          //         end = originTextContent.bounds[destinationJustification].x - originArtboardPaperLayer.bounds.center.x;
          //       } else {
          //         start = line.bounds[destinationJustification] - originArtboardPaperLayer.bounds[destinationJustification];
          //         end = originTextContent.bounds[destinationJustification] - originArtboardPaperLayer.bounds[destinationJustification];
          //       }
          //       line.skew(new paperPreview.Point(-startSkew, 0));
          //       originPaperLayer.data[`${tween.prop}-${index}-diff`] = end - start;
          //       originPaperLayer.data[`${tween.prop}-${index}-id`] = line.id;
          //     });
          //     // handle content
          //     let contentStart;
          //     switch(originJustification) {
          //       case 'left':
          //         contentStart = originTextContent.bounds.left;
          //         break;
          //       case 'center':
          //         contentStart = originTextContent.bounds.center.x;
          //         break;
          //       case 'right':
          //         contentStart = originTextContent.bounds.right;
          //         break;
          //     }
          //     originTextContent.justification = destinationJustification;
          //     if (originJustification === 'center') {
          //       originTextContent.bounds[originJustification].x = contentStart;
          //     } else {
          //       originTextContent.bounds[originJustification] = contentStart;
          //     }
          //     originPaperLayer.rotation = startRotation;
          //   });
          // }
          events.allIds.forEach((id) => {
            const event = events.byId[id];
            paperEventLayersById[event.layer].off(event.event, eventLayerFunctions[id]);
          });
        },
        onComplete: () => {
          remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.destinationArtboard)})`);
        }
      });
      // add tween timelines to event timeline
      Object.keys(tweensById).forEach((tweenId) => {
        const tweenTimeline = gsap.timeline();
        const tween = tweensById[tweenId];
        timelineProps[tweenId] = {};
        previewUtils.addTweens({
          tween: tween,
          timeline: tweenTimeline,
          timelineTweenProps: timelineProps[tweenId],
          originLayerItem: tweenLayers.byId[tween.layer],
          destinationLayerItem: tweenLayerDestinations.byId[tween.destinationLayer],
          originPaperLayer: paperTweenLayersById[tween.layer],
          destinationPaperLayer: paperTweenLayerDestinationsById[tween.destinationLayer],
          originArtboardLayerItem: eventDestinations.byId[event.artboard] as Btwx.Artboard,
          destinationArtboardLayerItem: eventDestinations.byId[event.destinationArtboard] as Btwx.Artboard,
          originArtboardPaperLayer: paperTweenEventDestinationsById[event.artboard],
          destinationArtboardPaperLayer: paperTweenEventDestinationsById[event.destinationArtboard]
        });
        timelines[eventId].add(tweenTimeline, 0);
      });
      // set event layer function
      eventLayerFunctions[eventId] = (e: paper.MouseEvent | paper.KeyEvent): void => {
        if (event.event === 'rightclick') {
          if ((e as any).event.which === 3) {
            timelines[eventId].play();
          }
        } else {
          timelines[eventId].play();
        }
      };
      // play timeline on event
      paperLayer.on(event.event === 'rightclick' ? 'click' : event.event, eventLayerFunctions[eventId]);
    });
  }, [paperProjects, activeArtboard]);

  return (
    <>
      <PreviewTextLayers />
      <div
        className={`c-canvas`}
        ref={canvasContainerRef}
        style={{
          background: theme.background.z0,
          cursor: touchCursor ? `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAGqADAAQAAAABAAAAGgAAAABvAZQwAAADhElEQVRIDbWWT0tbQRTFk6hNrbYSFWyphUIWFdy4FFwZd25dKn4R134AP4Lixq0Ll4ILwaXLWLAtNKUVlFCxtol/0vO7fed1jJZCoRduZub+OefOvPfupFj4uxQVUpIyWsnqJHqbzbE/KCT+SQBHH0nLmfZlNg0FwK+krUzbmQ37PXmICBsEgA9MTExUlpeXR2q12tPx8fFHo6OjsavT09PbRqPR2t3dvdjY2Dir1+tNxX+TQnxvh91ErHukT8bGxkZWV1dfLS0tPSuXy9g5KgA81zRiO61Wq7C5uXm+srLy8eTk5Ez2S+mNlJyQlMgkg9PT0y+U+LparfYqigTHMUdMRlEIgKXj4+MbFfbh4ODgs9YX0pzMALJFdQMiebmzs1OtVCr4CPQuTOgqu8lY9zSbzc78/PyxyD5pzVFGcSaKZ6Ljer6/vz+R7MRn7WNTXr4bE5GLMIays5mZmbqO8Yts8czYelSicWhtba06NzfXrznABvfco3epkIhxsaxjPjw83KsTKW9vb5/LBlEHB9qvt2v88PDwjR48uzAY4D4y22QKca53RNHeVVEvSGlqauqt3saG7N/tKPMKi8RV/4L6/WsS/BTSXQyRzmUs8KaCyVRa4q2isnKtVhvM5qxTQD8nE9ivsFzYDX77YswwISqaqI+PMQumeogIRk2QjjLHMTFawPKuwOgRJiR0kyJHB1hJX7zPWsu8MhLwW1Iy5oj9rD1n7GSYwfEQeAQlSXHmyVrTO5L6fRLpGMEQYbyld2XpTmQZ1SR21qlmrtiJd5PnCzOwFdQx0RUNUgYeqr8tJwBgcHw8CzS1mcRjYGSYdPicKLqwDAgEJBAMGKPn3aT4U5vJA4POLn98sDg4shatXh+ZSWTKxTaTGiwtxsGOLdDRwZQjWhBJSJv7hFavuQE8pgTeGbZ4bTXa751HnrC+ZncUF2KAMhJc7mqq7NQdgRi/LABROcIcRSAKEjXV6+6mCgECSJtLi/tErZ51JGlMK2ae2u3L7eSCkV2Avt6jCuXmcqM3pb23t3c9Ozs7pC4MAGIgSKzY7ijXw8LCwvvs4uMu8incI+JIrkX2Y2tr61Kt/vHk5GR/by9v8x0CyExCpy6ur6+fLy4uvjs6OjqRzxeejziSAUnFIPSp7j8nfW5VfIx8J//65yQldMX/7e9WSsbcO/SzYUQ4FivPIj8mnN3yE/4Ik03mkJJbAAAAAElFTkSuQmCC) 12 12, auto` : 'default'
        }}>
        <canvas
          id='canvas-preview'
          ref={canvasRef} />
      </div>
    </>
  );
}

export default PreviewCanvas;