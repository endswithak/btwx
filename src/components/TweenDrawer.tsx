import React, { useRef, useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEvents from './TweenDrawerEvents';
import TweenDrawerEvent from './TweenDrawerEvent';
import TweenDrawerDragHandle from './TweenDrawerDragHandle';

interface TweenDrawerProps {
  tweenDrawerHeight?: number;
  isOpen?: boolean;
  tweenEvent?: em.TweenEvent;
}

const TweenDrawer = (props: TweenDrawerProps): ReactElement => {
  const elementRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { isOpen, tweenEvent, tweenDrawerHeight } = props;

  return (
    isOpen
    ? <>
        <TweenDrawerDragHandle />
        <div
          id='tween-drawer'
          className='c-tween-drawer'
          ref={elementRef}
          style={{
            height: tweenDrawerHeight,
            background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
            boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
          }}>
          {
            tweenEvent
            ? <TweenDrawerEvent />
            : <TweenDrawerEvents />
          }
        </div>
      </>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer, canvasSettings } = state;
  const isOpen = tweenDrawer.isOpen;
  const tweenEvent = layer.present.tweenEventById[tweenDrawer.event];
  const tweenDrawerHeight = canvasSettings.tweenDrawerHeight;
  return { isOpen, tweenEvent, tweenDrawerHeight };
};

export default connect(
  mapStateToProps
)(TweenDrawer);