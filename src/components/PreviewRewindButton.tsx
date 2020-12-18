import { remote } from 'electron';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import TopbarButton from './TopbarButton';

const PreviewRewindButton = (): ReactElement => {
  const rewindOrigin = useSelector((state: RootState) => state.tweenDrawer.event ? state.layer.present.events.byId[state.tweenDrawer.event].artboard : null);
  const canRewind = useSelector((state: RootState) => state.tweenDrawer.event !== null && rewindOrigin && rewindOrigin !== state.layer.present.activeArtboard);
  const documentWindowId = useSelector((state: RootState) => state.preview.documentWindowId);

  const handleRewind = () => {
    if (canRewind) {
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(rewindOrigin)})`);
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