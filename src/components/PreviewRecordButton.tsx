/* eslint-disable @typescript-eslint/no-use-before-define */
import { desktopCapturer, remote, ipcRenderer } from 'electron';
import { gsap } from 'gsap';
import { writeFile } from 'fs';
import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { startPreviewRecording } from '../store/actions/preview';
import { PreviewTypes } from '../store/actionTypes/preview';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT, PREVIEW_PREFIX } from '../constants';
import TopbarButton from './TopbarButton';

interface PreviewRecordButtonProps {
  recording?: boolean;
  documentName?: string;
  startPreviewRecording?(): PreviewTypes;
}

let previewMediaRecorder: MediaRecorder;
let previewVideoChunks: any[] = [];
let windowSize: { width: number; height: number } = { width: null, height: null };
const titlebarHeight = remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT;
const topbarHeight = PREVIEW_TOPBAR_HEIGHT;

ipcRenderer.on('stopPreviewRecording', () => {
  const titlebarContent = document.getElementsByClassName('container-after-titlebar')[0];
  if (remote.process.platform === 'darwin') {
    remote.getCurrentWindow().setWindowButtonVisibility(true);
  }
  previewMediaRecorder.stop();
  gsap.to('.titlebar', {
    height: titlebarHeight,
    duration: 0.15,
    delay: 0.15
  });
  gsap.to('.c-preview-topbar', {
    height: topbarHeight,
    duration: 0.15
  });
  gsap.to(windowSize, {
    height: `+=${topbarHeight}`,
    duration: 0.15,
    onUpdate: () => {
      remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
    }
  });
  gsap.to(titlebarContent, {
    top: `+=${titlebarHeight}`,
    duration: 0.15,
    delay: 0.15
  });
  gsap.to(windowSize, {
    height: `+=${titlebarHeight}`,
    duration: 0.15,
    delay: 0.15,
    onUpdate: () => {
      remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
    }
  });
});

const PreviewRecordButton = (props: PreviewRecordButtonProps): ReactElement => {
  const { recording, startPreviewRecording, documentName } = props;

  const handleVideoData = (e: any): void => {
    previewVideoChunks.push(e.data);
  }

  const handleStop = async (): Promise<void> => {
    const blob = new Blob(previewVideoChunks, {
      type: 'video/webm; codecs=vp9'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    remote.dialog.showSaveDialog({
      buttonLabel: 'Save video',
      defaultPath: `vid-${Date.now()}.webm`
    }).then((result) => {
      if (!result.canceled && result.filePath) {
        writeFile(result.filePath, buffer, (err) => {
          if(err) {
            return console.log(err);
          }
        });
      }
      previewVideoChunks = [];
    });
  }

  const handleRecord = () => {
    if (!recording) {
      const currentWindow = remote.getCurrentWindow();
      if (remote.process.platform === 'darwin') {
        currentWindow.setWindowButtonVisibility(false);
      }
      const currentWindowSize = currentWindow.getSize();
      const titlebarContent = document.getElementsByClassName('container-after-titlebar')[0];
      windowSize = {
        width: currentWindowSize[0],
        height: currentWindowSize[1]
      }
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            startPreviewRecording();
            currentWindow.getParentWindow().webContents.executeJavaScript('startPreviewRecording()');
            previewMediaRecorder.start();
          }, 0.15);
        }
      });
      timeline.to('.titlebar', {
        height: 0,
        duration: 0.15
      }, 0.15);
      timeline.to('.c-preview-topbar', {
        height: 0,
        duration: 0.15
      }, 0);
      timeline.to(windowSize, {
        height: `-=${topbarHeight}`,
        duration: 0.15,
        onUpdate: () => {
          remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
        }
      }, 0);
      timeline.to(titlebarContent, {
        top: `-=${titlebarHeight}`,
        duration: 0.15
      }, 0.15);
      timeline.to(windowSize, {
        height: `-=${titlebarHeight}`,
        duration: 0.15,
        onUpdate: () => {
          remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
        }
      }, 0.15);
    }
  };

  useEffect(() => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      const source = sources.find((s) => s.name.startsWith(`${PREVIEW_PREFIX}${documentName}`));
      const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        } as MediaTrackConstraints
      });
      videoElement.srcObject = stream;
      videoElement.play();
      const options = { mimeType: 'video/webm; codecs=vp9' };
      previewMediaRecorder = new MediaRecorder(stream, options);
      previewMediaRecorder.ondataavailable = handleVideoData;
      previewMediaRecorder.onstop = handleStop;
    });
  }, []);

  return (
    <TopbarButton
      onClick={handleRecord}
      icon={recording ? 'stop-recording' : 'start-recording'} />
  );
}

const mapStateToProps = (state: RootState): {
  recording: boolean;
  documentName: string;
} => {
  const { preview, documentSettings } = state;
  const recording = preview.recording;
  const documentName = documentSettings.name
  return { recording, documentName };
};

export default connect(
  mapStateToProps,
  { startPreviewRecording }
)(PreviewRecordButton);