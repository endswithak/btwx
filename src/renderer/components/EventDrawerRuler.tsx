import React, { ReactElement } from 'react';
import { MAX_TWEEN_DURATION, TWEEN_RULER_SECOND_SEGMENTS } from '../constants';

const EventDrawerRuler = (): ReactElement => (
  <div className='c-event-drawer-ruler'>
    {
      [...Array(MAX_TWEEN_DURATION * TWEEN_RULER_SECOND_SEGMENTS).keys()].map((item, index) => (
        <div
          className={`c-event-drawer-ruler__unit${
            (index + 1) % 20 === 0
            ? `${' '}c-event-drawer-ruler__unit--second`
            : ''
          }${
            (index + 1) % 10 === 0
            ? `${' '}c-event-drawer-ruler__unit--half-second`
            : ''
          }${
            (index + 1) % 5 === 0
            ? `${' '}c-event-drawer-ruler__unit--quarter-second`
            : ''
          }${
            index === ((MAX_TWEEN_DURATION * TWEEN_RULER_SECOND_SEGMENTS) - 1)
            ? `${' '}c-event-drawer-ruler__unit--end`
            : ''
          }`}
          key={index}>
          <span>
            {
              (index + 1) % 20 === 0
              ? `${(index + 1) / TWEEN_RULER_SECOND_SEGMENTS}s`
              : (index + 1) % 10 === 0
                ? `${(index + 1) / TWEEN_RULER_SECOND_SEGMENTS}s`
                : (index + 1) % 5 === 0
                  ? `${(index + 1) / TWEEN_RULER_SECOND_SEGMENTS}s`
                  : ''
            }
          </span>
        </div>
      ))
    }
  </div>
);

export default EventDrawerRuler;