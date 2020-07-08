import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerEvent } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';

interface TweenDrawerProps {
  activeArtboard: string;
  isOpen: boolean;
  tweenEvent: em.TweenEvent;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const [artboard, setArtboard] = useState(props.activeArtboard);
  const elementRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { activeArtboard, isOpen, tweenEvent, setTweenDrawerEvent } = props;

  useEffect(() => {
    if (activeArtboard !== artboard) {
      setArtboard(activeArtboard);
      setTweenDrawerEvent({id: null});
    }
  }, [activeArtboard]);

  return (
    isOpen
    ? <div
        className={`c-tween-drawer`}
        ref={elementRef}
        style={{
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        {
          tweenEvent
          ? <TweenDrawerEvent />
          : <TweenDrawerEvents />
        }
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const isOpen = tweenDrawer.isOpen;
  const tweenEvent = layer.present.tweenEventById[tweenDrawer.event];
  return { activeArtboard, isOpen, tweenEvent };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEvent }
)(TweenDrawer);