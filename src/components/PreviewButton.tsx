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
      icon={recording ? 'M9,8 L15,8 C15.5522847,8 16,8.44771525 16,9 L16,15 C16,15.5522847 15.5522847,16 15,16 L9,16 C8.44771525,16 8,15.5522847 8,15 L8,9 C8,8.44771525 8.44771525,8 9,8 Z' : 'M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z'}
      iconOpacity={recording ? 'M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 Z' : null}
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