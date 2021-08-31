import React, { ReactElement, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { useSelector, useDispatch } from 'react-redux';
import { DEFAULT_TWEEN_EVENTS } from '../constants';
import { RootState } from '../store/reducers';
import { getArtboardEventItems, getArtboardsTopTop } from '../store/selectors/layer';
import getTheme from '../theme';
import { updateEventsFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';
import { activateUI } from './CanvasUI';
import { getIconData } from './Icon';

export const eventsFrameId = 'eventsFrame';

export const eventsFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Artboard Events",
    "data": {
      "id": "${eventsFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getEventsFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: eventsFrameId } }) as paper.Group;

export const clearEventsFrame = () => {
  const eventsFrame = getEventsFrame();
  if (eventsFrame) {
    eventsFrame.removeChildren();
  }
}

export const updateEventsFrame = (state: RootState): void => {
  activateUI();
  clearEventsFrame();
  const selectedEvents = state.layer.present.events.selected;
  const editingEvent = state.eventDrawer.event !== null;
  const events = (getArtboardEventItems(state) as {
    eventItems: Btwx.Event[];
    eventLayers: {
      allIds: string[];
      byId: {
        [id: string]: Btwx.Layer;
      };
    };
  }).eventItems;
  if (events) {
    const eventsFrame = getEventsFrame();
    const theme = getTheme((() => {
      switch(state.preferences.canvasTheme) {
        case 'btwx-default':
          return state.preferences.theme;
        default:
          return state.preferences.canvasTheme as 'light' | 'dark';
      }
    })());
    events.forEach((event, index) => {
      const isSelected = selectedEvents.includes(event.id);
      const eventLayerItem = state.layer.present.byId[event.layer];
      // const groupOpacity = state.layer.present.hover ? state.layer.present.hover === event.id ? 1 : 0.25 : 1;
      const elementColor = isSelected && !editingEvent ? '#fff' : event.origin === state.layer.present.activeArtboard ? theme.palette.primary : theme.eventFrameInactiveColor;
      const artboardTopTop = getArtboardsTopTop(state.layer.present);
      const origin = state.layer.present.byId[event.origin];
      const destination = state.layer.present.byId[event.destination];
      const leftToRight = origin.frame.x < destination.frame.x;
      const tweenEventDestinationIndicator = new paperMain.Path.RegularPolygon({
        center: new paperMain.Point(destination.frame.x, artboardTopTop - (48 / paperMain.view.zoom)),
        sides: 3,
        radius: 4 / paperMain.view.zoom,
        fillColor: elementColor,
        insert: false,
        rotation: leftToRight ? 90 : -90,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const tweenEventDestinationIndicatorBackground = new paperMain.Path.Ellipse({
        center: tweenEventDestinationIndicator.bounds.center,
        radius: 14 / paperMain.view.zoom,
        fillColor: isSelected && !editingEvent ? theme.palette.primary : theme.background.z0,
        opacity: 0,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const tweenEventOriginIndicator = new paperMain.Path.Ellipse({
        center: new paperMain.Point(origin.frame.x, artboardTopTop - (48 / paperMain.view.zoom)),
        radius: 8 / paperMain.view.zoom,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const tweenEventIconBackground = new paperMain.Path.Ellipse({
        center: tweenEventOriginIndicator.bounds.center,
        radius: 14 / paperMain.view.zoom,
        fillColor: isSelected && !editingEvent ? theme.palette.primary : theme.background.z0,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const tweenEventIcon = new paperMain.CompoundPath({
        pathData: ((): string => {
          switch(eventLayerItem.type) {
            case 'Artboard':
              return getIconData({
                name: 'artboard'
              }).fill;
            case 'Group':
              return `${getIconData({
                name: 'group',
                theme: state.preferences.theme
              }).fill}, ${getIconData({
                name: 'group',
                theme: state.preferences.theme
              }).opacity}`;
            case 'Shape':
              return getIconData({
                name: 'shape',
                pathData: (eventLayerItem as Btwx.Shape).pathData
              }).fill;
            case 'Text':
              return getIconData({
                name: 'text'
              }).fill;
            case 'Image':
              return `${getIconData({
                name: 'image',
                theme: state.preferences.theme
              }).fill}, ${getIconData({
                name: 'image',
                theme: state.preferences.theme
              }).opacity}`;
          }
        })(),
        fillColor: eventLayerItem.type === 'Shape' && (!(eventLayerItem as Btwx.Shape).closed || (eventLayerItem as Btwx.Shape).mask) ? null : elementColor,
        strokeColor: eventLayerItem.type === 'Shape' && (!(eventLayerItem as Btwx.Shape).closed || (eventLayerItem as Btwx.Shape).mask) ? elementColor : null,
        strokeWidth: 1 / paperMain.view.zoom,
        closed: eventLayerItem.type === 'Shape' ? (eventLayerItem as Btwx.Shape).closed : true,
        fillRule: 'nonzero',
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      tweenEventIcon.fitBounds(tweenEventOriginIndicator.bounds);
      tweenEventDestinationIndicator.bounds.center.y = tweenEventOriginIndicator.bounds.center.y;
      const tweenEventConnector = new paperMain.Path.Line({
        from: tweenEventOriginIndicator.bounds.center,
        to: tweenEventDestinationIndicator.bounds.center,
        strokeColor: elementColor,
        strokeWidth: 1 / paperMain.view.zoom,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const tweenEventText = new paperMain.PointText({
        content: DEFAULT_TWEEN_EVENTS.find((tweenEvent) => event.listener === tweenEvent.listener).titleCase,
        point: new paperMain.Point(
          tweenEventConnector.bounds.center.x,
          tweenEventDestinationIndicator.bounds.top - ((1 / paperMain.view.zoom) * 8)
        ),
        justification: 'center',
        fontSize: 10 / paperMain.view.zoom,
        visible: paperMain.view.zoom > 0.3,
        fillColor: elementColor,
        insert: false,
        fontFamily: 'Space Mono',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      const eventFrame = new paperMain.Group({
        children: [tweenEventConnector, tweenEventIconBackground, tweenEventIcon, tweenEventDestinationIndicator, tweenEventDestinationIndicatorBackground, tweenEventText],
        data: {
          id: 'eventFrame',
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        },
        parent: eventsFrame,
        // opacity: groupOpacity
      });
      const margin = 8 / paperMain.view.zoom;
      const eventFrameBackground = new paperMain.Path.Rectangle({
        from: eventFrame.bounds.topLeft.subtract(new paperMain.Point(margin, margin)),
        to: eventFrame.bounds.bottomRight.add(new paperMain.Point(margin, margin)),
        fillColor: isSelected && !editingEvent ? theme.palette.primary : tinyColor(theme.background.z0).setAlpha(0.01).toRgbString(),
        strokeColor: !state.eventDrawer.event && state.eventDrawer.eventHover === event.id ? theme.palette.primary : null,
        strokeWidth: 1 / paperMain.view.zoom,
        radius: 4 / paperMain.view.zoom,
        parent: eventFrame,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: eventsFrameId
        }
      });
      eventFrameBackground.sendToBack();
      eventFrame.position.y -= eventFrame.bounds.height * index;
    });
  }
};

const EventsFrame = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardEvents = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard] && (state.layer.present.byId[state.layer.present.activeArtboard] as Btwx.Artboard).originForEvents);
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const canvasTheme = useSelector((state: RootState) => state.preferences.canvasTheme);
  const eventDrawerEventSort = useSelector((state: RootState) => state.eventDrawer.eventSort);
  const eventDrawerEventHover = useSelector((state: RootState) => state.eventDrawer.eventHover);
  const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const selectedEvents = useSelector((state: RootState) => state.layer.present.events.selected);
  const shapeIcons = useSelector((state: RootState) => state.layer.present.shapeIcons);
  const allEventIds = useSelector((state: RootState) => state.layer.present.events.allIds);
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateEventsFrameThunk());
    return (): void => {
      clearEventsFrame();
    }
  }, [
    activeArtboard, theme, canvasTheme, eventDrawerEventSort, eventDrawerEventHover,
    eventDrawerEvent, activeArtboardEvents, zoom, allEventIds, selectedEvents,
    shapeIcons
  ]);

  return null;
}

export default EventsFrame;