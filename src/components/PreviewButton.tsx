import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';
import { RootState } from '../store/reducers';
import { PreviewTypes } from '../store/actionTypes/preview';
import { openPreview, stopPreviewRecording } from '../store/actions/preview';
import TopbarButton from './TopbarButton';

interface PreviewButtonProps {
  activeArtboard?: em.Artboard;
  canPreview?: boolean;
  isOpen?: boolean;
  recording?: boolean;
  stopPreviewRecording?(): PreviewTypes;
  openPreview?(): PreviewTypes;
}

const PreviewButton = (props: PreviewButtonProps): ReactElement => {
  const { activeArtboard, canPreview, isOpen, openPreview, recording, stopPreviewRecording } = props;

  const handlePreviewClick = (): void => {
    if (isOpen) {
      if (recording) {
        const previewContents = remote.getCurrentWindow().getChildWindows().find((window) => window.getTitle() === 'Preview').webContents;
        stopPreviewRecording();
        ipcRenderer.sendTo(previewContents.id, 'stopPreviewRecording');
      }
    } else {
      const windowSize = {
        width: activeArtboard.frame.width,
        height: activeArtboard.frame.height
      }
      ipcRenderer.send('openPreview', JSON.stringify(windowSize));
      openPreview();
    }
  }

  return (
    <TopbarButton
      label='Preview'
      onClick={handlePreviewClick}
      icon={recording ? 'stop-recording' : 'preview'}
      disabled={!canPreview}
      isActive={isOpen}
      recording={recording} />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: em.Artboard;
  canPreview: boolean;
  isOpen: boolean;
  recording: boolean;
} => {
  const { layer, preview } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard] as em.Artboard;
  const canPreview = layer.present.allTweenEventIds.length > 0;
  const isOpen = preview.isOpen;
  const recording = preview.recording;
  return { activeArtboard, canPreview, isOpen, recording };
};

export default connect(
  mapStateToProps,
  { openPreview, stopPreviewRecording }
)(PreviewButton);