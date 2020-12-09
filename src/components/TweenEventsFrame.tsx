import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrameThunk } from '../store/actions/layer';
import { uiPaperScope } from '../canvas';

interface TweenEventsFrameProps {
  activeArtboard?: string;
  theme?: Btwx.ThemeName;
  tweenDrawerEventSort?: Btwx.TweenEventSort;
  tweenDrawerEventHover?: string;
  tweenDrawerEvent?: string;
  activeArtboardEvents?: string[];
  zoom?: number;
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
  const { zoom, activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, updateTweenEventsFrameThunk, activeArtboardEvents } = props;

  useEffect(() => {
    updateTweenEventsFrameThunk();
    // updateTweenEventsFrame({allArtboardIds, byId: {...artboardsById, ...tweenEventLayers.byId}, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    return () => {
      const tweenEventsFrame = uiPaperScope.projects[0].getItem({ data: { id: 'artboardEvents' } });
      tweenEventsFrame.removeChildren();
    }
  }, [activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, activeArtboardEvents, zoom]);

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
  zoom: number;
} => {
  const { layer, tweenDrawer, viewSettings, documentSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardEvents = (layer.present.byId[activeArtboard] as Btwx.Artboard).originArtboardForEvents;
  const theme = viewSettings.theme;
  const tweenDrawerEventSort = tweenDrawer.eventSort;
  const tweenDrawerEventHover = tweenDrawer.eventHover;
  const tweenDrawerEvent = tweenDrawer.event;
  const zoom = documentSettings.zoom;
  return { activeArtboard, theme, tweenDrawerEventSort, tweenDrawerEventHover, tweenDrawerEvent, activeArtboardEvents, zoom };
};

export default connect(
  mapStateToProps,
  { updateTweenEventsFrameThunk }
)(TweenEventsFrame);