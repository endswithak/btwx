import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setActiveArtboard } from '../store/actions/layer';
import { LayerTypes, SetActiveArtboardPayload } from '../store/actionTypes/layer';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('rewind')}
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