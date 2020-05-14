import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

const TweenDrawerEventsHeader = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-tween-drawer-events__header'
      style={{
        background: theme.background.z2
      }}>
      <div
        className='c-tween-drawer-events__item c-tween-drawer-events__item--labels'
        style={{
          color: theme.text.lighter
        }}>
        <div className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'>
          layer
        </div>
        <div className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'>
          destination
        </div>
        <div className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'>
          event
        </div>
        <div className='c-tween-drawer-events-item__module c-tween-drawer-events-item__module--label'>
          actions
        </div>
      </div>
    </div>
  );
}

export default TweenDrawerEventsHeader;