/* eslint-disable @typescript-eslint/no-use-before-define */
import { desktopCapturer, remote, ipcRenderer } from 'electron';
import { gsap } from 'gsap';
import { writeFile } from 'fs';
import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { startPreviewRecording } from '../store/actions/preview';
import { PreviewTypes } from '../store/actionTypes/preview';
import TopbarButton from './TopbarButton';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';

interface PreviewRecordButtonProps {
  recording?: boolean;
  startPreviewRecording?(): PreviewTypes;
}

let previewMediaRecorder: MediaRecorder;
let previewVideoChunks: any[] = [];
let windowSize: { width: number; height: number } = { width: null, height: null };
const titlebarHeight = remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT;
const topbarHeight = PREVIEW_TOPBAR_HEIGHT;

ipcRenderer.on('stopPreviewRecording', () => {
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
    onComplete: function() {
      remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
    }
  });
  gsap.to(windowSize, {
    height: `+=${titlebarHeight}`,
    duration: 0.15,
    delay: 0.15,
    onComplete: function() {
      remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
    }
  });
});

const PreviewRecordButton = (props: PreviewRecordButtonProps): ReactElement => {
  const { recording, startPreviewRecording } = props;

  const handleVideoData = (e) => {
    previewVideoChunks.push(e.data);
  }

  const handleStop = async () => {
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
      if (remote.process.platform === 'darwin') {
        remote.getCurrentWindow().setWindowButtonVisibility(false);
      }
      const currentWindowSize = remote.getCurrentWindow().getSize();
      windowSize = {
        width: currentWindowSize[0],
        height: currentWindowSize[1]
      }
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            startPreviewRecording();
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
        onComplete: () => {
          remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
        }
      }, 0);
      timeline.to(windowSize, {
        height: `-=${titlebarHeight}`,
        duration: 0.15,
        onComplete: () => {
          remote.getCurrentWindow().setSize(windowSize.width, windowSize.height, false);
        }
      }, 0.15);
    }
  };

  useEffect(() => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      const source = sources.find((s) => s.name === 'Preview');
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
      icon={recording ? 'M9,8 L15,8 C15.5522847,8 16,8.44771525 16,9 L16,15 C16,15.5522847 15.5522847,16 15,16 L9,16 C8.44771525,16 8,15.5522847 8,15 L8,9 C8,8.44771525 8.44771525,8 9,8 Z' : 'M12,7 C14.7614237,7 17,9.23857625 17,12 C17,14.7614237 14.7614237,17 12,17 C9.23857625,17 7,14.7614237 7,12 C7,9.23857625 9.23857625,7 12,7 Z'}
      iconOpacity={recording ? 'M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 Z' : 'M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 Z'} />
  );
}

const mapStateToProps = (state: RootState): {
  recording: boolean;
} => {
  const { preview } = state;
  const recording = preview.recording;
  return { recording };
};

export default connect(
  mapStateToProps,
  { startPreviewRecording }
)(PreviewRecordButton);