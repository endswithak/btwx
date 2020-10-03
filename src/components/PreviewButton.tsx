import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { BrowserWindow, ipcRenderer, remote } from 'electron';
import { RootState } from '../store/reducers';
import { PreviewTypes, OpenPreviewPayload } from '../store/actionTypes/preview';
import { openPreview, stopPreviewRecording } from '../store/actions/preview';
import { DEFAULT_MAC_DEVICE, DEFAULT_WINDOWS_DEVICE, PREVIEW_PREFIX } from '../constants';
import TopbarButton from './TopbarButton';

interface PreviewButtonProps {
  activeArtboard?: em.Artboard;
  isOpen?: boolean;
  recording?: boolean;
  focusing?: boolean;
  previewWindowId?: number;
  documentWindowId?: number;
  stopPreviewRecording?(): PreviewTypes;
  openPreview?(payload: OpenPreviewPayload): PreviewTypes;
}

const PreviewButton = (props: PreviewButtonProps): ReactElement => {
  const { activeArtboard, isOpen, openPreview, recording, stopPreviewRecording, focusing, previewWindowId, documentWindowId } = props;

  const handlePreviewClick = (): void => {
    const defaultSize = remote.process.platform === 'darwin' ? DEFAULT_MAC_DEVICE : DEFAULT_WINDOWS_DEVICE;
    const windowSize = {
      width: activeArtboard ? activeArtboard.frame.width : defaultSize.width,
      height: activeArtboard ? activeArtboard.frame.height : defaultSize.height
    }
    if (isOpen) {
      if (!previewWindowId) {
        ipcRenderer.send('openPreview', JSON.stringify({windowSize, documentWindowId}));
      } else {
        const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
        const previewContents = previewWindow.webContents;
        if (recording) {
          stopPreviewRecording();
          previewContents.executeJavaScript('stopPreviewRecording()');
          ipcRenderer.sendTo(previewContents.id, 'stopPreviewRecording');
        }
        if (!focusing) {
          previewWindow.focus();
        }
      }
    } else {
      ipcRenderer.send('openPreview', JSON.stringify({windowSize, documentWindowId}));
      openPreview({});
    }
  }

  const buttonIcon = () => {
    if (isOpen) {
      if (recording) {
        return 'stop-recording';
      } else {
        if (focusing) {
          return 'preview';
        } else {
          return 'move-forward';
        }
      }
    } else {
      return 'preview';
    }
  }

  return (
    <TopbarButton
      label='Preview'
      onClick={handlePreviewClick}
      icon={buttonIcon()}
      isActive={isOpen}
      recording={recording} />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: em.Artboard;
  isOpen: boolean;
  recording: boolean;
  focusing: boolean;
  previewWindowId: number;
  documentWindowId: number;
} => {
  const { layer, preview } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard] as em.Artboard;
  const isOpen = preview.isOpen;
  const recording = preview.recording;
  const focusing = preview.focusing;
  const previewWindowId = preview.windowId;
  const documentWindowId = preview.documentWindowId;
  return { activeArtboard, isOpen, recording, focusing, previewWindowId, documentWindowId };
};

export default connect(
  mapStateToProps,
  { openPreview, stopPreviewRecording }
)(PreviewButton);