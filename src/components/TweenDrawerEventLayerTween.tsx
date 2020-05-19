import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenHover } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import TweenDrawerFreezeTween from './TweenDrawerFreezeTween';
import TweenDrawerEditEase from './TweenDrawerEditEase';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  index: number;
  tweenHover?: string;
  tween?: em.Tween;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, index, tween, setTweenDrawerTweenHover, tweenHover } = props;

  const handleMouseEnter = () => {
    setTweenDrawerTweenHover({id: tweenId});
  }

  const handleMouseLeave = () => {
    setTweenDrawerTweenHover({id: null});
  }

  return (
    <div
      className={`c-tween-drawer-event-layer__tween`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: tweenId === tweenHover
        ? theme.background.z3
        : 'none'
      }}>
      <div className='c-tween-drawer__icon' />
      <div
        className='c-tween-drawer-event-layer-tween__name'
        style={{
          color: theme.text.lighter
        }}>
        {tween.prop}
      </div>
      <TweenDrawerEditEase tweenId={tweenId} />
      {/* <TweenDrawerFreezeTween tweenId={tweenId} /> */}
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenProps) => {
  const { layer, tweenDrawer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  const tweenHover = tweenDrawer.tweenHover;
  return { tween, tweenHover };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerTweenHover }
)(TweenDrawerEventLayerTween);