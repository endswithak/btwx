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
      icon='M18.455728,7.10493221 L17.455728,7.10493221 L17.455728,11.1021746 C17.455728,11.8965883 16.9576969,12.5243547 16.3554822,12.5954608 L16.2414422,12.6021746 L7.80972796,12.602728 L10.955728,9.45572796 L10.2486212,8.74862118 L5.89506779,13.1021746 L10.2486212,17.455728 L10.955728,16.7486212 L7.80972796,13.602728 L16.2414422,13.6021746 C17.4312058,13.6021746 18.3741954,12.5598558 18.4507123,11.2715447 L18.455728,11.1021746 L18.455728,7.10493221 Z'
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