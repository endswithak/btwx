import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { getAllArtboardTweenEvents } from '../store/selectors/layer';
import TweenDrawerEventsItem from './TweenDrawerEventsItem';

interface TweenDrawerEventsItemsProps {
  tweenEvents?: string[];
}

const TweenDrawerEventsItems = (props: TweenDrawerEventsItemsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEvents } = props;

  return (
    <div className='c-tween-drawer-event-items'>
      {
        tweenEvents.map((tweenEvent, index) => (
          <TweenDrawerEventsItem
            key={index}
            id={tweenEvent} />
        ))
      }
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const tweenEvents = getAllArtboardTweenEvents(layer.present, layer.present.activeArtboard).allIds;
  return { tweenEvents };
};

export default connect(
  mapStateToProps,
)(TweenDrawerEventsItems);