import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer, remote } from 'electron';
import { RootState } from '../store/reducers';
import { openPreview, stopPreviewRecording } from '../store/actions/preview';
import { DEFAULT_MAC_DEVICE, DEFAULT_WINDOWS_DEVICE } from '../constants';
import TopbarButton from './TopbarButton';

const PreviewButton = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const isOpen = useSelector((state: RootState) => state.preview.isOpen);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const focusing = useSelector((state: RootState) => state.preview.focusing);
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const documentWindowId = useSelector((state: RootState) => state.preview.documentWindowId);
  const dispatch = useDispatch();

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
          dispatch(stopPreviewRecording());
          previewContents.executeJavaScript('stopPreviewRecording()');
          ipcRenderer.sendTo(previewContents.id, 'stopPreviewRecording');
        }
        if (!focusing) {
          previewWindow.focus();
        }
      }
    } else {
      ipcRenderer.send('openPreview', JSON.stringify({windowSize, documentWindowId}));
      dispatch(openPreview({}));
    }
  }

  const buttonIcon = (): string => {
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

export default PreviewButton;