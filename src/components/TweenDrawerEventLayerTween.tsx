import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';

interface TweenDrawerEventLayerTweenProps {
  tweenId: string;
  tween?: em.Tween;
}

const TweenDrawerEventLayerTween = (props: TweenDrawerEventLayerTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tween } = props;

  return (
    <div
      className={`c-tween-drawer-event-layer__tween`}
      style={{
        color: theme.text.lighter
      }}>
      {tween.prop}
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