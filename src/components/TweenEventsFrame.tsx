import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { getTweenEventsFrameItems } from '../store/selectors/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  activeArtboard?: string;
  allArtboardIds?: string[];
  artboardsById?: {
    [id: string]: em.Artboard;
  };
  tweenEventItems?: em.TweenEvent[];
  allArtboardItems?: em.Artboard[];
  eventHover?: string;
  themeName?: em.ThemeName;
  eventSort?: em.TweenEventSort;
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { tweenEventLayers, allArtboardIds, allArtboardItems, tweenEventItems, eventHover, artboardsById, activeArtboard, themeName, eventSort } = props;

  useEffect(() => {
    updateTweenEventsFrame({allArtboardIds, byId: {...artboardsById, ...tweenEventLayers.byId}, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'TweenEventsFrame' } });
      if (tweenEventsFrame) {
        tweenEventsFrame.remove();
      }
    }
  }, [allArtboardIds, allArtboardItems, tweenEventItems, eventHover, activeArtboard, themeName, eventSort]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  allArtboardIds: string[];
  artboardsById: { [id: string]: em.Artboard };
  tweenEventItems: em.TweenEvent[];
  tweenEventLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  allArtboardItems: em.Artboard[];
  eventHover: string;
  themeName: em.ThemeName;
  eventSort: em.TweenEventSort;
} => {
  const { layer, tweenDrawer, theme } = state;
  const eventSort = tweenDrawer.eventSort;
  const activeArtboard = layer.present.activeArtboard;
  const allArtboardIds = layer.present.allArtboardIds;
  const artboardsById = allArtboardIds.reduce((result: {[id: string]: em.Artboard}, current) => {
    result[current] = layer.present.byId[current] as em.Artboard;
    return result;
  }, {});
  const allArtboardItems = allArtboardIds.reduce((result, current) => {
    return [...result, layer.present.byId[current]];
  }, []);
  const eventHover = tweenDrawer.eventHover;
  const sortedTweenEventItems = getTweenEventsFrameItems(state);
  const themeName = theme.theme;
  return { tweenEventLayers: sortedTweenEventItems.tweenEventLayers, allArtboardIds, tweenEventItems: sortedTweenEventItems.tweenEventItems, allArtboardItems, eventHover, artboardsById, activeArtboard, themeName, eventSort };
};

export default connect(
  mapStateToProps
)(TweenEventsFrame);