import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventsFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface TweenEventsFrameProps {
  allArtboardIds?: string[];
  tweenEventItems?: em.TweenEvent[];
  allArtboardItems?: em.Artboard[];
}

const TweenEventsFrame = (props: TweenEventsFrameProps): ReactElement => {
  const { allArtboardIds, allArtboardItems, tweenEventItems } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const tweenEventFrame = paperMain.project.getItem({ data: { id: 'tweenEventFrame' } });
      if (tweenEventFrame) {
        tweenEventFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateTweenEventsFrame({allArtboardIds} as LayerState, tweenEventItems);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'tweenEventsFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (tweenEventsFrame) {
        tweenEventsFrame.remove();
      }
    }
  }, [allArtboardIds, allArtboardItems, tweenEventItems]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState): {
  allArtboardIds: string[];
  tweenEventItems: em.TweenEvent[];
  allArtboardItems: em.Artboard[];
} => {
  const { layer, tweenDrawer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const allArtboardIds = layer.present.allArtboardIds;
  const allArtboardItems = allArtboardIds.reduce((result, current) => {
    return [...result, layer.present.byId[current]];
  }, []);
  const tweenEventItems = tweenDrawer.event === null ? layer.present.allTweenEventIds.reduce((result, current) => {
    const tweenEvent = layer.present.tweenEventById[current];
    if (tweenEvent.artboard === activeArtboard) {
      result = [...result, tweenEvent];
    }
    return result;
  }, []) : [layer.present.tweenEventById[tweenDrawer.event]];
  return { allArtboardIds, tweenEventItems, allArtboardItems };
};

export default connect(
  mapStateToProps
)(TweenEventsFrame);