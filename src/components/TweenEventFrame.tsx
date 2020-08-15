import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { updateTweenEventFrame } from '../store/utils/layer';
import { LayerState } from '../store/reducers/layer';
import { paperMain } from '../canvas';

interface TweenEventFrameProps {
  allArtboardIds?: string[];
  allArtboardItems?: em.Artboard[];
  tweenEventItem?: em.TweenEvent;
  zoom: number;
}

const TweenEventFrame = (props: TweenEventFrameProps): ReactElement => {
  const { allArtboardIds, allArtboardItems, tweenEventItem, zoom } = props;

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      const tweenEventFrame = paperMain.project.getItem({ data: { id: 'tweenEventFrame' } });
      if (tweenEventFrame) {
        tweenEventFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateTweenEventFrame({allArtboardIds} as LayerState, tweenEventItem);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const tweenEventFrame = paperMain.project.getItem({ data: { id: 'tweenEventFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (tweenEventFrame) {
        tweenEventFrame.remove();
      }
    }
  }, [allArtboardIds, allArtboardItems, tweenEventItem, zoom]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, canvasSettings, tweenDrawer } = state;
  const allArtboardIds = layer.present.allArtboardIds;
  const allArtboardItems = allArtboardIds.reduce((result, current) => {
    return [...result, layer.present.byId[current]];
  }, []);
  const tweenEvent = tweenDrawer.event;
  const tweenEventItem = tweenEvent ? layer.present.tweenEventById[tweenEvent] : null;
  const zoom = canvasSettings.matrix[0];
  return { allArtboardIds, tweenEventItem, zoom, allArtboardItems };
};

export default connect(
  mapStateToProps
)(TweenEventFrame);