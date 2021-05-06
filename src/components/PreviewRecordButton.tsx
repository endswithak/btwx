/* eslint-disable @typescript-eslint/no-use-before-define */
import { desktopCapturer, ipcRenderer } from 'electron';
import { gsap } from 'gsap';
import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { startPreviewRecording, stopPreviewRecording } from '../store/actions/preview';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';
import IconButton from './IconButton';

const getTitlebarHeight = (platform) =>
  platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT;

let previewMediaRecorder;
let previewVideoChunks: any[] = [];
let windowSize: { width: number; height: number } = { width: null, height: null };
const topbarHeight = PREVIEW_TOPBAR_HEIGHT;

// comes from PreviewButton
ipcRenderer.on('setPreviewRecordingStopped', (event, args) => {
  previewMediaRecorder.stop();
  const { instanceId, platform } = JSON.parse(args);
  const titlebarHeight = getTitlebarHeight(platform);
  gsap.to(document.getElementById(`${instanceId}-preview-titlebar`), {
    height: titlebarHeight,
    duration: 0.15,
    delay: 0.15,
    onComplete: () => {
      ipcRenderer.send('showPreviewTrafficLights', JSON.stringify({
        instanceId
      }));
    }
  });
  gsap.to(document.getElementById(`preview-topbar`), {
    height: topbarHeight,
    duration: 0.15
  });
  gsap.to(windowSize, {
    height: `+=${topbarHeight}`,
    duration: 0.15,
    onUpdate: () => {
      ipcRenderer.send('setPreviewWindowSize', JSON.stringify({
        instanceId: instanceId,
        width: windowSize.width,
        height: windowSize.height,
        animate: false
      }));
    }
  });
  gsap.to(windowSize, {
    height: `+=${titlebarHeight}`,
    duration: 0.15,
    delay: 0.15,
    onUpdate: () => {
      ipcRenderer.send('setPreviewWindowSize', JSON.stringify({
        instanceId: instanceId,
        width: windowSize.width,
        height: windowSize.height,
        animate: false
      }));
    }
  });
});

const PreviewRecordButton = (): ReactElement => {
  const recording = useSelector((state: RootState) => state.preview.recording);
  const instance = useSelector((state: RootState) => state.session.instance);
  const isOpen = useSelector((state: RootState) => state.preview.isOpen);
  const platform = useSelector((state: RootState) => state.session.platform);
  const dispatch = useDispatch();

  const handleVideoData = (e: any): void => {
    previewVideoChunks.push(e.data);
  }

  const handleStop = async (): Promise<void> => {
    const blob = new Blob(previewVideoChunks, {
      type: 'video/webm; codecs=vp9'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    dispatch(stopPreviewRecording());
    ipcRenderer.invoke('setDocumentRecordingStopped', JSON.stringify({
      instanceId: instance,
      buffer
    })).then((data) => {
      previewVideoChunks = [];
    });
  }

  const handleRecord = () => {
    if (!recording) {
      const titlebarHeight = getTitlebarHeight(platform);
      ipcRenderer.invoke('getPreviewWindowSize', JSON.stringify({
        instanceId: instance
      })).then((previewWindowSize) => {
        ipcRenderer.send('hidePreviewTrafficLights', JSON.stringify({
          instanceId: instance
        }));
        windowSize = JSON.parse(previewWindowSize);
        const timeline = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              dispatch(startPreviewRecording());
              ipcRenderer.send('setDocumentRecordingStarted', JSON.stringify({
                instanceId: instance
              }));
              previewMediaRecorder.start();
              ipcRenderer.send('buildRecordingTouchBar', JSON.stringify({
                instanceId: instance
              }));
            }, 0.15);
          }
        });
        timeline.to(document.getElementById(`${instance}-preview-titlebar`), {
          height: 0,
          duration: 0.15
        }, 0.15);
        timeline.to(document.getElementById(`preview-topbar`), {
          height: 0,
          duration: 0.15
        }, 0);
        timeline.to(windowSize, {
          height: `-=${topbarHeight}`,
          duration: 0.15,
          onUpdate: () => {
            ipcRenderer.send('setPreviewWindowSize', JSON.stringify({
              instanceId: instance,
              width: windowSize.width,
              height: windowSize.height,
              animate: false
            }));
          }
        }, 0);
        timeline.to(windowSize, {
          height: `-=${titlebarHeight}`,
          duration: 0.15,
          onUpdate: () => {
            ipcRenderer.send('setPreviewWindowSize', JSON.stringify({
              instanceId: instance,
              width: windowSize.width,
              height: windowSize.height,
              animate: false
            }));
          }
        }, 0.15);
      });
    }
  };

  useEffect(() => {
    (window as any)['startPreviewRecording'] = () => {
      handleRecord();
    }
    return () => {
      if (recording) {
        ipcRenderer.send('setPreviewRecordingStopped', JSON.stringify({
          instanceId: instance
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!previewMediaRecorder && !recording) {
      ipcRenderer.invoke('getPreviewMediaSource', JSON.stringify({
        instanceId: instance
      })).then((mediaSourceId) => {
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
          const source = sources.find((s) => s.id === mediaSourceId);
          if (source) {
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
          }
        });
      });
    }
    return () => {
      if (previewMediaRecorder && !isOpen) {
        previewMediaRecorder = null;
      }
    }
  }, [isOpen]);

  return (
    <IconButton
      size='small'
      onClick={handleRecord}
      iconName='start-recording'
      label='record'
      classNames='c-button--preview-record' />
  );
}

export default PreviewRecordButton;