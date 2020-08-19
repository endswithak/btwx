import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { setActiveArtboard } from '../store/actions/layer';
import { LayerTypes, SetActiveArtboardPayload } from '../store/actionTypes/layer';
import TopbarButton from './TopbarButton';

interface PreviewRewindButtonProps {
  canRewind: boolean;
  rewindOrigin: string;
  setActiveArtboard(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewRewindButton = (props: PreviewRewindButtonProps): ReactElement => {
  const { canRewind, rewindOrigin, setActiveArtboard } = props;

  const handleRewind = () => {
    if (canRewind) {
      setActiveArtboard({id: rewindOrigin, scope: 2});
    }
  }

  return (
    <TopbarButton
      onClick={handleRewind}
      icon='M21,6 L18.8666667,6 L18.8666667,10.8689927 C18.8666667,11.4042237 18.4548905,11.8453526 17.9243959,11.9056403 L17.8,11.9126618 L6.798,11.913 L10,8.48679212 L8.60987928,7 L3,13 L8.60987928,19 L10,17.5132079 L6.716,14 L17.8,14 C19.5041929,14 20.8972383,12.6965408 20.9945678,11.0529632 L21,10.8689927 L21,6 Z'
      disabled={!canRewind} />
  );
}

const mapStateToProps = (state: RootState): {
  canRewind: boolean;
  rewindOrigin: string;
} => {
  const { tweenDrawer, layer } = state;
  const rewindOrigin = tweenDrawer.event ? layer.present.tweenEventById[tweenDrawer.event].artboard : null;
  const canRewind = tweenDrawer.event !== null && rewindOrigin !== layer.present.activeArtboard;
  return { canRewind, rewindOrigin };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewRewindButton);