/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { gsap } from 'gsap';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { getEventTweenLayers } from '../store/selectors/layer';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';

interface CanvasPreviewLayerEventProps {
  eventId: string;
}

interface CanvasPreviewLayerEventStateProps {
  event: Btwx.TweenEvent;
  eventTweenLayers: string[];
  documentWindowId: number;
  destinationArtboardPosition: paper.Point;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  textLinesGroup: paper.Group;
  textContent: paper.PointText;
  textBackground: paper.Path.Rectangle;
}

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps & CanvasPreviewLayerEventStateProps): ReactElement => {
  const { event, eventId, documentWindowId, destinationArtboardPosition, eventTweenLayers } = props;

  // create event timeline
  const eventTimeline = gsap.timeline({
    id: eventId,
    paused: true,
    data: eventTweenLayers.reduce((result, current) => ({
      ...result,
      [current]: {}
    }), { garbageCollection: [] }),
    onComplete: function() {
      // set preview view center to destination artboard
      paperPreview.view.center = destinationArtboardPosition;
      // set main window active artboard to destination artboard
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.destinationArtboard)})`);
      // reset timeline and pause it
      this.time(0);
      this.pause();
      // remove any items added during timeline duration
      if (this.data.garbageCollection.length > 0) {
        this.data.garbageCollection.forEach((item: any) => {
          switch(item.type) {
            case 'FSColor': {
              item.paperLayer[`${item.style}Color` as 'fillColor' | 'strokeColor'] = item.color;
              break;
            }
            case 'image': {
              const image = item.paperLayer.getItem({id:item.imageId});
              image.remove();
              break;
            }
            case 'gradientStop': {
              switch(item.layerType) {
                case 'Text': {
                  const textLinesGroup = item.paperLayer.getItem({data:{id:'textLines'}});
                  textLinesGroup.children.forEach((line: any) => {
                    line[`${item.style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.pop();
                  });
                  break;
                }
                case 'Artboard': {
                  const artboardBackground = item.paperLayer.getItem({data:{id:'artboardBackground'}});
                  artboardBackground[`${item.style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.pop();
                  break;
                }
                default:
                  item.paperLayer[`${item.style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.pop();
              }
              break;
            }
            case 'textLine': {
              const textLinesGroup = item.paperLayer.getItem({data:{id:'textLines'}});
              const textBackground = item.paperLayer.getItem({data:{id:'textBackground'}});
              const textLine = item.paperLayer.getItem({id:item.lineId});
              item.paperLayer.rotation = -item.rotation;
              textLine.remove();
              textBackground.bounds = textLinesGroup.bounds;
              item.paperLayer.rotation = item.rotation;
              break;
            }
            case 'justification': {
              const textContent = item.paperLayer.getItem({data:{id:'textContent'}});
              const textLinesGroup = item.paperLayer.getItem({data:{id:'textLines'}});
              item.paperLayer.rotation = -item.rotation;
              textContent.justification = item.justification;
              textContent.point.x = item.pointX;
              textLinesGroup.children.forEach((line: any) => {
                line.leading = line.fontSize;
                line.skew(new paperPreview.Point(item.oblique, 0));
                line.justification = item.justification;
                line.point.x = item.pointX;
                line.skew(new paperPreview.Point(-item.oblique, 0));
                line.leading = textContent.leading;
              });
              item.paperLayer.rotation = item.rotation;
              break;
            }
          }
        });
        this.data.garbageCollection = [];
      }
    }
  })

  // create timelines for all event layers
  eventTweenLayers.reduce((result, current) => {
    const eventLayerTimeline = gsap.timeline({
      id: `${eventId}-${current}`,
      data: {
        paperLayer: null,
        artboardBackground: null,
        textLinesGroup: null,
        textContent: null,
        textBackground: null
      },
      // on start supply layer timeline with relevant paper layers
      onStart: function() {
        this.data = ((): EventLayerTimelineData => {
          const paperLayer = paperPreview.project.getItem({data:{id: current}});
          let textLinesGroup: paper.Group = null;
          let artboardBackground: paper.Path.Rectangle = null;
          let textContent: paper.PointText = null;
          let textBackground: paper.Path.Rectangle = null;
          if (paperLayer.data.layerType === 'Artboard') {
            artboardBackground = paperLayer.getItem({data:{id:'artboardBackground'}}) as paper.Path.Rectangle;
          }
          if (paperLayer.data.layerType === 'Text') {
            textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
            textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
            textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
          }
          return {
            paperLayer,
            artboardBackground,
            textLinesGroup,
            textContent,
            textBackground
          }
        })();
      }
    });
    eventTimeline.add(eventLayerTimeline, 0);
    return {
      ...result,
      [current]: eventLayerTimeline
    }
  }, {});

  // add event listener to event paper layer
  useEffect(() => {
    const paperLayer = paperPreview.project.getItem({data:{id: event.layer}});
    paperLayer.on(event.event === 'rightclick' ? 'click' : event.event, (e: paper.MouseEvent | paper.KeyEvent): void => {
      if (event.event === 'rightclick') {
        if ((e as any).event.which === 3) {
          eventTimeline.play();
        }
      } else {
        eventTimeline.play();
      }
    });
    return (): void => {
      eventTimeline.kill();
    }
  }, []);

  // attach tweens to event layer timelines
  return (
    <>
      {
        event.tweens.map((tweenId, index) => (
          <CanvasPreviewLayerTween
            key={tweenId}
            tweenId={tweenId}
            eventTimeline={eventTimeline} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasPreviewLayerEventProps): CanvasPreviewLayerEventStateProps => {
  const event = state.layer.present.events.byId[ownProps.eventId];
  const documentWindowId = state.preview.documentWindowId;
  const destinationArtboardItem = state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard;
  const destinationArtboardPosition = new paperPreview.Point(destinationArtboardItem.frame.x, destinationArtboardItem.frame.y);
  const eventTweenLayers = getEventTweenLayers(state, ownProps.eventId);
  return {
    event,
    eventTweenLayers,
    documentWindowId,
    destinationArtboardPosition
  }
}

export default connect(
  mapStateToProps
)(CanvasPreviewLayerEvent);