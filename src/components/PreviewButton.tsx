import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';
import { RootState } from '../store/reducers';
import { PreviewTypes } from '../store/actionTypes/preview';
import { openPreview, stopPreviewRecording } from '../store/actions/preview';
import { DEFAULT_MAC_DEVICE, DEFAULT_WINDOWS_DEVICE, PREVIEW_PREFIX } from '../constants';
import { getPreviewWindow } from '../utils';
import TopbarButton from './TopbarButton';

interface PreviewButtonProps {
  activeArtboard?: em.Artboard;
  isOpen?: boolean;
  recording?: boolean;
  stopPreviewRecording?(): PreviewTypes;
  openPreview?(): PreviewTypes;
}

const PreviewButton = (props: PreviewButtonProps): ReactElement => {
  const { activeArtboard, isOpen, openPreview, recording, stopPreviewRecording } = props;

  const handlePreviewClick = (): void => {
    const defaultSize = remote.process.platform === 'darwin' ? DEFAULT_MAC_DEVICE : DEFAULT_WINDOWS_DEVICE;
    const windowSize = {
      width: activeArtboard ? activeArtboard.frame.width : defaultSize.width,
      height: activeArtboard ? activeArtboard.frame.height : defaultSize.height
    }
    if (isOpen) {
      const previewWindow = getPreviewWindow();
      if (!previewWindow) {
        ipcRenderer.send('openPreview', JSON.stringify(windowSize));
      }
      if (recording) {
        const previewContents = previewWindow.webContents;
        stopPreviewRecording();
        previewContents.executeJavaScript('stopPreviewRecording()');
        ipcRenderer.sendTo(previewContents.id, 'stopPreviewRecording');
      }
    } else {
      ipcRenderer.send('openPreview', JSON.stringify(windowSize));
      openPreview();
    }
  }

  return (
    <TopbarButton
      label='Preview'
      onClick={handlePreviewClick}
      icon={recording ? 'stop-recording' : 'preview'}
      isActive={isOpen}
      recording={recording} />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: em.Artboard;
  isOpen: boolean;
  recording: boolean;
} => {
  const { layer, preview } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard] as em.Artboard;
  const isOpen = preview.isOpen;
  const recording = preview.recording;
  return { activeArtboard, isOpen, recording };
};

export default connect(
  mapStateToProps,
  { openPreview, stopPreviewRecording }
)(PreviewButton);