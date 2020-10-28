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
  theme: Btwx.ThemeName;
  tweenDrawerEventSort: Btwx.TweenEventSort;
  tweenDrawerEventHover: string;
  tweenDrawerEvent: string;
  // allArtboardIds: string[];
  // artboardsById: { [id: string]: Btwx.Artboard };
  // tweenEventItems: Btwx.TweenEvent[];
  // tweenEventLayers: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: Btwx.Layer;
  //   };
  // };
  // allArtboardItems: Btwx.Artboard[];
} => {
  const { layer, tweenDrawer, viewSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const theme = viewSettings.theme;
  const tweenDrawerEventSort = tweenDrawer.eventSort;
  const tweenDrawerEventHover = tweenDrawer.eventHover;
  const tweenDrawerEvent = tweenDrawer.event;
  // const allArtboardIds = layer.present.allArtboardIds;
  // const artboardsById = allArtboardIds.reduce((result: {[id: string]: Btwx.Artboard}, current) => {
  //   result[current] = layer.present.byId[current] as Btwx.Artboard;
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