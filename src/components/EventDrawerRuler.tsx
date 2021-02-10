import React, { ReactElement } from 'react';

const EventDrawerRuler = (): ReactElement => (
  <div className='c-event-drawer-ruler'>
    {
      [...Array(200).keys()].map((item, index) => (
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
            index === 199
            ? `${' '}c-event-drawer-ruler__unit--end`
            : ''
          }`}
          key={index}>
          <span>
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
);

export default EventDrawerRuler;