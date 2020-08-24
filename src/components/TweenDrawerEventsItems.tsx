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
  const { layer, tweenDrawer } = state;
  const tweenEvents = layer.present.allTweenEventIds;
  const eventSort = tweenDrawer.eventSort;
  const getSort = (sortBy: 'layer' | 'event' | 'artboard' | 'destinationArtboard'): string[] => {
    return [...tweenEvents].sort((a, b) => {
      const eventA = layer.present.tweenEventById[a];
      const eventB = layer.present.tweenEventById[b];
      let sortA;
      let sortB;
      switch(sortBy) {
        case 'layer':
        case 'artboard':
        case 'destinationArtboard':
          sortA = layer.present.byId[eventA[sortBy]].name.toUpperCase();
          sortB = layer.present.byId[eventB[sortBy]].name.toUpperCase();
          break;
        case 'event':
          sortA = eventA[sortBy].toUpperCase();
          sortB = eventB[sortBy].toUpperCase();
          break;
      }
      if (sortA < sortB) {
        return -1;
      }
      if (sortA > sortB) {
        return 1;
      }
      return 0;
    });
  }
  const sortedTweenEvents = (() => {
    if (eventSort !== 'none') {
      switch(eventSort) {
        case 'layer-asc':
          return getSort('layer');
        case 'layer-dsc':
          return getSort('layer').reverse();
        case 'event-asc':
          return getSort('event');
        case 'event-dsc':
          return getSort('event').reverse();
        case 'artboard-asc':
          return getSort('artboard');
        case 'artboard-dsc':
          return getSort('artboard').reverse();
        case 'destinationArtboard-asc':
          return getSort('destinationArtboard');
        case 'destinationArtboard-dsc':
          return getSort('destinationArtboard').reverse();
      }
    } else {
      return tweenEvents;
    }
  })();
  return { tweenEvents: sortedTweenEvents };
};

export default connect(
  mapStateToProps,
)(TweenDrawerEventsItems);