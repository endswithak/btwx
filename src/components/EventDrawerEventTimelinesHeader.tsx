import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

const EventDrawerEventTimelinesHeaders = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <div
        className='c-event-drawer-event-layers-timeline__header'
        style={{
          background: theme.name === 'dark'
          ? theme.background.z3
          : theme.background.z0,
          boxShadow: `0 -1px 0 ${theme.name === 'dark'
          ? theme.background.z4
          : theme.background.z5} inset`,
          zIndex: 4
        }} />
      <div
        className='c-event-drawer-event-layers-timeline__header'
        style={{
          background: theme.name === 'dark'
          ? theme.background.z2
          : theme.background.z1,
          boxShadow: `0 -1px 0 ${theme.name === 'dark'
          ? theme.background.z4
          : theme.background.z5} inset`,
          zIndex: 3,
          position: 'absolute',
          top: 32
        }}>
        {
          [...Array(200).keys()].map((item, index) => (
            <div
              key={index}
              style={{
                width: theme.unit * 5,
                minWidth: theme.unit * 5,
                height:
                (index + 1) % 20 === 0
                ? '100%'
                : (index + 1) % 10 === 0
                  ? '75%'
                  : (index + 1) % 5 === 0
                    ? '50%'
                    : '25%',
                boxShadow: `-1px 0 0 ${theme.background.z5} inset`,
                flexShrink: 0,
                position: 'relative',
                display: 'flex',
                alignSelf: 'flex-end'
              }}>
              <span style={{
                position: 'absolute',
                bottom: theme.unit * 4,
                right: theme.unit,
                color: theme.text.lighter,
                fontSize: 10
              }}>
                {
                  (index + 1) % 20 === 0
                  ?  `${(index + 1) / 20}s`
                  : (index + 1) % 10 === 0
                    ? `${(index + 1) / 20}s`
                    : (index + 1) % 5 === 0
                      ? `${(index + 1) / 20}s`
                      : ''
                }
              </span>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default EventDrawerEventTimelinesHeaders;