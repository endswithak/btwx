import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';

interface TweenDrawerTweensProps {
  tweenEvent: em.TweenEvent;
}

const TweenDrawerTweens = (props: TweenDrawerTweensProps): ReactElement => {
  const elementRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);

  return (
    <div
      className={`c-tween-drawer-tweens`}
      ref={elementRef}
      style={{
        background: theme.background.z3
      }}>

    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const tweenEvent = layer.present.tweenEventById[tweenDrawer.event];
  return { tweenEvent };
};

export default connect(
  mapStateToProps
)(TweenDrawerTweens);