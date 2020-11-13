import React, { ReactElement, useContext } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import TweenDrawerEventsItem from './TweenDrawerEventsItem';
import { ThemeContext } from './ThemeProvider';

interface TweenDrawerEventsItemsProps {
  activeArtboardEvents?: string[];
  otherEvents?: string[];
}

const TweenDrawerEventsItems = (props: TweenDrawerEventsItemsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboardEvents, otherEvents } = props;

  return (
    <div className='c-tween-drawer-events__items'>
      {
        activeArtboardEvents.length > 0
        ? <>
            <div>
              {
                activeArtboardEvents.map((tweenEvent, index) => (
                  <TweenDrawerEventsItem
                    key={index}
                    id={tweenEvent} />
                ))
              }
            </div>
            <div
              className='c-tween-drawer-events__divider'
              style={{
                height: 1,
                marginTop: theme.unit / 2,
                marginBottom: theme.unit / 2,
                width: '100%',
                background: theme.name === 'dark' ? theme.background.z4 : theme.background.z5,
                flexShrink: 0
              }} />
          </>
        : null
      }
      <div>
        {
          otherEvents.map((tweenEvent, index) => (
            <TweenDrawerEventsItem
              key={index}
              id={tweenEvent} />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const sortedTweenEvents = getActiveArtboardSortedEvents(state);
  const activeArtboardEvents = sortedTweenEvents.activeArtboardEvents;
  const otherEvents = sortedTweenEvents.otherEventIds;
  return { activeArtboardEvents, otherEvents };
};

export default connect(
  mapStateToProps,
)(TweenDrawerEventsItems);