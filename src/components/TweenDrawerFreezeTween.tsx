import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { freezeLayerTween, unFreezeLayerTween } from '../store/actions/layer';
import { FreezeLayerTweenPayload, UnFreezeLayerTweenPayload, LayerTypes } from '../store/actionTypes/layer';
import TweenDrawerIcon from './TweenDrawerIcon';

interface TweenDrawerFreezeTweenProps {
  tweenId: string;
  tween?: em.Tween;
  freezeLayerTween?(payload: FreezeLayerTweenPayload): LayerTypes;
  unFreezeLayerTween?(payload: UnFreezeLayerTweenPayload): LayerTypes;
}

const TweenDrawerFreezeTween = (props: TweenDrawerFreezeTweenProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tweenId, tween, freezeLayerTween, unFreezeLayerTween } = props;

  const handleClick = () => {
    if (tween.frozen) {
      unFreezeLayerTween({id: tweenId});
    } else {
      freezeLayerTween({id: tweenId});
    }
  }

  return (
    <TweenDrawerIcon
      onClick={handleClick}
      icon='freeze'
      selected={tween.frozen} />
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerFreezeTweenProps) => {
  const { layer } = state;
  const tween = layer.present.tweenById[ownProps.tweenId];
  return { tween };
};

export default connect(
  mapStateToProps,
  { freezeLayerTween, unFreezeLayerTween }
)(TweenDrawerFreezeTween);