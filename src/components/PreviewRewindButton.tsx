import { remote } from 'electron';
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setActiveArtboard } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const PreviewRewindButton = (): ReactElement => {
  const rewindOrigin = useSelector((state: RootState) => state.tweenDrawer.event ? state.layer.present.events.byId[state.tweenDrawer.event].artboard : null);
  const canRewind = useSelector((state: RootState) => state.tweenDrawer.event !== null && rewindOrigin && rewindOrigin !== state.layer.present.activeArtboard);
  const dispatch = useDispatch();

  const handleRewind = () => {
    if (canRewind) {
      const currentWindow = remote.getCurrentWindow();
      dispatch(setActiveArtboard({id: rewindOrigin}));
      currentWindow.webContents.executeJavaScript(JSON.stringify(`setActiveArtboard(${rewindOrigin})`));
    }
  }

  return (
    <TopbarButton
      onClick={handleRewind}
      icon='rewind'
      disabled={!canRewind} />
  );
}

export default PreviewRewindButton;