import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';
import TweenDrawerDragHandle from './TweenDrawerDragHandle';

interface TweenDrawerProps {
  ready: boolean;
  tweenDrawerHeight?: number;
  isOpen?: boolean;
  tweenEvent?: em.TweenEvent;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { ready, isOpen, tweenEvent, tweenDrawerHeight } = props;

  return (
    isOpen
    ? <>
        <TweenDrawerDragHandle />
        <div
          id='tween-drawer'
          className='c-tween-drawer'
          style={{
            height: tweenDrawerHeight,
            background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
            boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
          }}>
          {
            ready
            ? tweenEvent
              ? <TweenDrawerEvent />
              : <TweenDrawerEvents />
            : null
          }
        </div>
      </>
    : null
  );
}

const mapStateToProps = (state: RootState): {
  tweenDrawerHeight: number;
  isOpen: boolean;
  tweenEvent: em.TweenEvent;
} => {
  const { layer, tweenDrawer, canvasSettings } = state;
  const isOpen = tweenDrawer.isOpen;
  const tweenEvent = layer.present.tweenEventById[tweenDrawer.event];
  const tweenDrawerHeight = canvasSettings.tweenDrawerHeight;
  return { isOpen, tweenEvent, tweenDrawerHeight };
};

export default connect(
  mapStateToProps
)(TweenDrawer);