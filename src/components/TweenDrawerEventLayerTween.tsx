import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenHover } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import TweenDrawerFreezeTween from './TweenDrawerFreezeTween';
import TweenDrawerEditEase from './TweenDrawerEditEase';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  index: number;
  tweenHover?: string;
  tweenEditing?: string;
  tween?: em.Tween;
  titleCaseProp?: string;
  hover?: string;
  setTweenDrawerTweenHover?(payload: SetTweenDrawerTweenHoverPayload): TweenDrawerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, index, tween, setTweenDrawerTweenHover, tweenEditing, tweenHover, titleCaseProp, hover, setLayerHover } = props;

  const handleMouseEnter = () => {
    if (!tweenEditing) {
      if (hover !== tween.layer) {
        setLayerHover({id: tween.layer});
      }
      setTweenDrawerTweenHover({id: tweenId});
    }
  }

  const handleMouseLeave = () => {
    if (!tweenEditing) {
      setTweenDrawerTweenHover({id: null});
    }
  }

  return (
    <div
      className='c-tween-drawer-event-layer__tween'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? theme.background.z3
        : 'none',
        boxShadow: tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? `2px 0 0 0 ${theme.palette.primary} inset`
        : 'none'
      }}>
      <div className='c-tween-drawer__icon' />
      <div
        className='c-tween-drawer-event-layer-tween__name'
        style={{
          color: theme.text.lighter
        }}>
        { titleCaseProp }
      </div>
      {
        tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? <TweenDrawerEditEase tweenId={tweenId} />
        : null
      }
      {/* <TweenDrawerFreezeTween tweenId={tweenId} /> */}
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerTweenProps) => {
  const { layer, tweenDrawer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  const tweenHover = tweenDrawer.tweenHover;
  const tweenEditing = tweenDrawer.tweenEditing;
  const titleCaseProp = ((): string => {
    const reg = tween.prop.replace( /([A-Z])/g, " $1" );
    return reg.charAt(0).toUpperCase() + reg.slice(1);
  })();
  const hover = layer.present.hover;
  return { tween, tweenHover, tweenEditing, titleCaseProp, hover };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerTweenHover, setLayerHover }
)(TweenDrawerEventLayerTween);