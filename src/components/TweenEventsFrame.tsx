import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  activeArtboard?: string;
  theme?: Btwx.ThemeName;
  tweenDrawerEventSort?: Btwx.TweenEventSort;
  tweenDrawerEventHover?: string;
  tweenDrawerEvent?: string;
  activeArtboardEvents?: string[];
  updateTweenEventsFrameThunk?(): void;
  // tweenEventLayers?: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: Btwx.Layer;
  //   };
  // };
  // activeArtboard?: string;
  // allArtboardIds?: string[];
  // artboardsById?: {
  //   [id: string]: Btwx.Artboard;
  // };
  // tweenEventItems?: Btwx.TweenEvent[];
  // allArtboardItems?: Btwx.Artboard[];
  // eventHover?: string;
  // themeName?: Btwx.ThemeName;
  // eventSort?: Btwx.TweenEventSort;
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, updateTweenEventsFrameThunk, activeArtboardEvents } = props;

  useEffect(() => {
    updateTweenEventsFrameThunk();
    // updateTweenEventsFrame({allArtboardIds, byId: {...artboardsById, ...tweenEventLayers.byId}, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'artboardEvents' } });
      tweenEventsFrame.removeChildren();
    }
  }, [activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, activeArtboardEvents]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  theme: Btwx.ThemeName;
  tweenDrawerEventSort: Btwx.TweenEventSort;
  tweenDrawerEventHover: string;
  tweenDrawerEvent: string;
  activeArtboardEvents: string[];
} => {
  const { layer, tweenDrawer, viewSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardEvents = (layer.present.byId[activeArtboard] as Btwx.Artboard).originArtboardForEvents;
  const theme = viewSettings.theme;
  const tweenDrawerEventSort = tweenDrawer.eventSort;
  const tweenDrawerEventHover = tweenDrawer.eventHover;
  const tweenDrawerEvent = tweenDrawer.event;
  return { activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, activeArtboardEvents };
};

export default connect(
  mapStateToProps,
  { updateTweenEventsFrameThunk }
)(TweenEventsFrame);