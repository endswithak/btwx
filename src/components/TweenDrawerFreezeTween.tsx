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
      iconPath='M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z'
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