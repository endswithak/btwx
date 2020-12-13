import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrameThunk } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

const TweenEventsFrame = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardEvents = useSelector((state: RootState) => (state.layer.present.byId[state.layer.present.activeArtboard] as Btwx.Artboard).originArtboardForEvents);
  const theme = useSelector((state: RootState) => state.viewSettings.theme);
  const tweenDrawerEventSort = useSelector((state: RootState) => state.tweenDrawer.eventSort);
  const tweenDrawerEventHover = useSelector((state: RootState) => state.tweenDrawer.eventHover);
  const tweenDrawerEvent = useSelector((state: RootState) => state.tweenDrawer.event);
  const zoom = useSelector((state: RootState) => state.documentSettings.zoom);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateTweenEventsFrameThunk());
    return () => {
      const tweenEventsFrame = uiPaperScope.projects[0].getItem({ data: { id: 'artboardEvents' } });
      tweenEventsFrame.removeChildren();
    }
  }, [activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, activeArtboardEvents, zoom]);

  return (
    <></>
  );
}

export default TweenEventsFrame;