import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerFreezeTween from './TweenDrawerFreezeTween';
import TweenDrawerEditEase from './TweenDrawerEditEase';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  index: number;
  tween?: em.Tween;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, index, tween } = props;

  return (
    <div
      className={`c-tween-drawer-event-layer__tween`}>
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
  const { layer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps
)(TweenDrawerEventLayerTween);