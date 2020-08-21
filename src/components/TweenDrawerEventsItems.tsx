import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
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
  const tweenEvents = layer.present.allTweenEventIds;
  return { tweenEvents };
};

export default connect(
  mapStateToProps,
)(TweenDrawerEventsItems);