import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  activeArtboard?: string;
  allArtboardIds?: string[];
  artboardsById?: {
    [id: string]: em.Artboard;
  };
  tweenEventItems?: em.TweenEvent[];
  allArtboardItems?: em.Artboard[];
  eventHover?: string;
  themeName?: em.ThemeName;
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { allArtboardIds, allArtboardItems, tweenEventItems, eventHover, artboardsById, activeArtboard, themeName } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const tweenEventFrame = paperMain.project.getItem({ data: { id: 'tweenEventFrame' } });
      if (tweenEventFrame) {
        tweenEventFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateTweenEventsFrame({allArtboardIds, byId: artboardsById, activeArtboard} as LayerState, tweenEventItems, eventHover, themeName);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'tweenEventsFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (tweenEventsFrame) {
        tweenEventsFrame.remove();
      }
    }
  }, [allArtboardIds, allArtboardItems, tweenEventItems, eventHover, activeArtboard]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: string;
  allArtboardIds: string[];
  artboardsById: { [id: string]: em.Artboard };
  tweenEventItems: em.TweenEvent[];
  allArtboardItems: em.Artboard[];
  eventHover: string;
  themeName: em.ThemeName;
} => {
  const { layer, tweenDrawer, theme } = state;
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
  const eventHoverItem = layer.present.tweenEventById[eventHover]
  const tweenEventItems = tweenDrawer.event === null ? layer.present.allTweenEventIds.reduce((result, current) => {
    const tweenEvent = layer.present.tweenEventById[current];
    if (tweenEvent.artboard === activeArtboard) {
      result = [...result, tweenEvent];
    }
    return result;
  }, []) : [layer.present.tweenEventById[tweenDrawer.event]];
  const themeName = theme.theme;
  if (eventHoverItem && !tweenEventItems.some((item: em.TweenEvent) => item.id === eventHoverItem.id)) {
    tweenEventItems.unshift(eventHoverItem);
  }
  return { allArtboardIds, tweenEventItems, allArtboardItems, eventHover, artboardsById, activeArtboard, themeName };
};

export default connect(
  mapStateToProps
)(TweenEventsFrame);