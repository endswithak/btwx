import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrameThunk } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  activeArtboard?: string;
  theme?: em.ThemeName;
  tweenDrawerEventSort?: em.TweenEventSort;
  tweenDrawerEventHover?: string;
  tweenDrawerEvent?: string;
  updateTweenEventsFrameThunk?(): void;
  // tweenEventLayers?: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: em.Layer;
  //   };
  // };
  // activeArtboard?: string;
  // allArtboardIds?: string[];
  // artboardsById?: {
  //   [id: string]: em.Artboard;
  // };
  // tweenEventItems?: em.TweenEvent[];
  // allArtboardItems?: em.Artboard[];
  // eventHover?: string;
  // themeName?: em.ThemeName;
  // eventSort?: em.TweenEventSort;
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, updateTweenEventsFrameThunk } = props;

  useEffect(() => {
    updateTweenEventsFrameThunk();
    // updateTweenEventsFrame({allArtboardIds, byId: {...artboardsById, ...tweenEventLayers.byId}, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'TweenEventsFrame' } });
      if (tweenEventsFrame) {
        tweenEventsFrame.remove();
      }
    }
  }, [activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  theme: em.ThemeName;
  tweenDrawerEventSort: em.TweenEventSort;
  tweenDrawerEventHover: string;
  tweenDrawerEvent: string;
  // allArtboardIds: string[];
  // artboardsById: { [id: string]: em.Artboard };
  // tweenEventItems: em.TweenEvent[];
  // tweenEventLayers: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: em.Layer;
  //   };
  // };
  // allArtboardItems: em.Artboard[];
} => {
  const { layer, tweenDrawer, viewSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const theme = viewSettings.theme;
  const tweenDrawerEventSort = tweenDrawer.eventSort;
  const tweenDrawerEventHover = tweenDrawer.eventHover;
  const tweenDrawerEvent = tweenDrawer.event;
  // const allArtboardIds = layer.present.allArtboardIds;
  // const artboardsById = allArtboardIds.reduce((result: {[id: string]: em.Artboard}, current) => {
  //   result[current] = layer.present.byId[current] as em.Artboard;
  //   return result;
  // }, {});
  // const allArtboardItems = allArtboardIds.reduce((result, current) => {
  //   return [...result, layer.present.byId[current]];
  // }, []);
  // const eventHover = tweenDrawer.eventHover;
  // const sortedTweenEventItems = getTweenEventsFrameItems(state);
  // const themeName = viewSettings.theme;
  return { activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent };
};

export default connect(
  mapStateToProps,
  { updateTweenEventsFrameThunk }
)(TweenEventsFrame);