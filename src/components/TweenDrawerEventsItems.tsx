import React, { ReactElement, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import TweenDrawerEventsItem from './TweenDrawerEventsItem';
import { ThemeContext } from './ThemeProvider';

const TweenDrawerEventsItems = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const sortedTweenEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const activeArtboardEvents = sortedTweenEvents.activeArtboardEvents;
  const otherEvents = sortedTweenEvents.otherEventIds;

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

export default TweenDrawerEventsItems;