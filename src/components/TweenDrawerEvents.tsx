import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { getAllArtboardTweenEvents } from '../store/selectors/layer';
import TweenDrawerEventItem from './TweenDrawerEventItem';

interface TweenDrawerEventsProps {
  tweenEvents: string[];
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawerEvents = (props: TweenDrawerEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenEvents, setTweenDrawerEvent } = props;

  return (
    <div
      className={`c-tween-drawer-events`}>
      <div
        className='c-tween-drawer-events__labels'
        style={{
          background: theme.background.z2
        }}>
        <div
          className='c-tween-drawer-event-item c-tween-drawer-event-item--labels'
          style={{
            color: theme.text.lighter
          }}>
          <div className='c-tween-drawer-event-item__module c-tween-drawer-event-item__module--label'>
            layer
          </div>
          <div className='c-tween-drawer-event-item__module c-tween-drawer-event-item__module--label'>
            destination
          </div>
          <div className='c-tween-drawer-event-item__module c-tween-drawer-event-item__module--label'>
            event
          </div>
          <div className='c-tween-drawer-event-item__module c-tween-drawer-event-item__module--end c-tween-drawer-event-item__module--label'>
            actions
          </div>
        </div>
      </div>
      <div className='c-tween-drawer-events__scroll'>
        {
          tweenEvents.map((tweenEvent, index) => (
            <TweenDrawerEventItem
              key={index}
              id={tweenEvent} />
          ))
        }
      </div>
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
  { setTweenDrawerEvent }
)(TweenDrawerEvents);