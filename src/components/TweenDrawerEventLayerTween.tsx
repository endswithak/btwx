import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setTweenDrawerTweenHoverThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerTweenHoverPayload } from '../store/actionTypes/tweenDrawer';
import TweenDrawerEditEase from './TweenDrawerEditEase';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  index: number;
  tweenHover?: string;
  tweenEditing?: string;
  tween?: em.Tween;
  titleCaseProp?: string;
  setTweenDrawerTweenHoverThunk?(payload: SetTweenDrawerTweenHoverPayload): void;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, index, tween, setTweenDrawerTweenHoverThunk, tweenEditing, tweenHover, titleCaseProp } = props;

  const handleMouseEnter = () => {
    setTweenDrawerTweenHoverThunk({id: tweenId});
  }

  const handleMouseLeave = () => {
    setTweenDrawerTweenHoverThunk({id: null});
  }

  return (
    <div
      className='c-tween-drawer-event-layer__tween'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='c-tween-drawer__icon' />
      <div
        className='c-tween-drawer-event-layer-tween__name'
        style={{
          color: tweenId === tweenEditing
          ? theme.palette.primary
          : tweenId === tweenHover
            ? theme.text.base
            : theme.text.lighter
        }}>
        { titleCaseProp }
      </div>
      {
        tweenId === tweenHover && !tweenEditing || tweenId === tweenEditing
        ? <TweenDrawerEditEase tweenId={tweenId} />
        : null
      }
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
  { setTweenDrawerTweenHoverThunk }
)(TweenDrawerEventLayerTween);