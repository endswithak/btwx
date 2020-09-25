import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSortedTweenEvents } from '../store/selectors/layer';
import TweenDrawerEventsItem from './TweenDrawerEventsItem';

interface TweenDrawerEventsItemsProps {
  tweenEvents?: string[];
}

const TweenDrawerEventsItems = (props: TweenDrawerEventsItemsProps): ReactElement => {
  const { tweenEvents } = props;

  return (
    <div className='c-tween-drawer-events__items'>
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
  const sortedTweenEvents = getSortedTweenEvents(state);
  return { tweenEvents: sortedTweenEvents };
};

export default connect(
  mapStateToProps,
)(TweenDrawerEventsItems);