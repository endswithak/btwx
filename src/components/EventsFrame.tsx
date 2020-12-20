import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateEventsFrameThunk } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

const EventsFrame = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardEvents = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.activeArtboard] as Btwx.Artboard).originArtboardForEvents);
  const theme = useSelector((state: RootState) => state.viewSettings.theme);
  const eventDrawerEventSort = useSelector((state: RootState) => state.eventDrawer.eventSort);
  const eventDrawerEventHover = useSelector((state: RootState) => state.eventDrawer.eventHover);
  const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateEventsFrameThunk());
    return (): void => {
      const eventsFrame = uiPaperScope.projects[0].getItem({ data: { id: 'eventsFrame' } });
      eventsFrame.removeChildren();
    }
  }, [activeArtboard, theme, eventDrawerEventSort, eventDrawerEventHover, eventDrawerEvent, activeArtboardEvents, zoom]);

  return (
    <></>
  );
}

export default EventsFrame;