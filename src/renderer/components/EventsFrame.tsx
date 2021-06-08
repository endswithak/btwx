import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateEventsFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

const EventsFrame = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardEvents = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.activeArtboard] as Btwx.Artboard).originForEvents);
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
      const eventsFrame = paperMain.projects[0].getItem({ data: { id: 'eventsFrame' } });
      eventsFrame.removeChildren();
    }
  }, [
    activeArtboard, theme, canvasTheme, eventDrawerEventSort, eventDrawerEventHover,
    eventDrawerEvent, activeArtboardEvents, zoom, allEventIds, selectedEvents,
    shapeIcons
  ]);

  return null;
}

export default EventsFrame;