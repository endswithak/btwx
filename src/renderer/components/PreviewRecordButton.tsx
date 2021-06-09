/* eslint-disable @typescript-eslint/no-use-before-define */
// import { desktopCapturer } from 'electron';
import { gsap } from 'gsap';
import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { startPreviewRecording, stopPreviewRecording } from '../store/actions/preview';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';
import IconButton from './IconButton';
import { bufferToBase64 } from '../utils';

const getTitlebarHeight = (platform) =>
  platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT;

let previewMediaRecorder;
let previewVideoChunks: any[] = [];
let windowSize: { width: number; height: number } = { width: null, height: null };
const topbarHeight = PREVIEW_TOPBAR_HEIGHT;

const PreviewRecordButton = (): ReactElement => {
  const recording = useSelector((state: RootState) => state.preview.recording);
  const instance = useSelector((state: RootState) => state.session.instance);
  const isOpen = useSelector((state: RootState) => state.preview.isOpen);
  const platform = useSelector((state: RootState) => state.session.platform);
  const dispatch = useDispatch();

  const handleVideoData = (e: any): void => {
    previewVideoChunks.push(e.data);
  }

  const handleStop = () => {
    new Blob(previewVideoChunks, {
      type: 'video/webm; codecs=vp9'
    }).arrayBuffer().then((arrayBuffer) => {
      dispatch(stopPreviewRecording());
      (window as any).api.setDocumentRecordingStopped(JSON.stringify({
        instanceId: instance,
        base64: bufferToBase64(arrayBuffer)
      })).then(() => {
        previewVideoChunks = [];
      });
    });
  }

  const handleRecord = () => {
    if (!recording) {
      const titlebarHeight = getTitlebarHeight(platform);
      (window as any).api.getPreviewWindowSize(JSON.stringify({
        instanceId: instance,
      })).then((previewWindowSize) => {
        (window as any).api.hidePreviewTrafficLights(JSON.stringify({
          instanceId: instance
        }));
        windowSize = JSON.parse(previewWindowSize);
        const timeline = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              dispatch(startPreviewRecording());
              (window as any).api.setDocumentRecordingStarted(JSON.stringify({
                instanceId: instance
              }));
              previewMediaRecorder.start();
              (window as any).api.buildRecordingTouchBar(JSON.stringify({
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
            (window as any).api.setPreviewWindowSize(JSON.stringify({
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
            (window as any).api.setPreviewWindowSize(JSON.stringify({
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
    (window as any).startPreviewRecording = () => {
      handleRecord();
    }
    (window as any).handlePreviewRecordingStopped = (params) => {
      const { instanceId, platform } = params;
      const titlebarHeight = getTitlebarHeight(platform);
      previewMediaRecorder.stop();
      gsap.to(document.getElementById(`${instanceId}-preview-titlebar`), {
        height: titlebarHeight,
        duration: 0.15,
        delay: 0.15,
        onComplete: () => {
          (window as any).api.showPreviewTrafficLights(JSON.stringify({
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
          (window as any).api.setPreviewWindowSize(JSON.stringify({
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
          (window as any).api.setPreviewWindowSize(JSON.stringify({
            instanceId: instanceId,
            width: windowSize.width,
            height: windowSize.height,
            animate: false
          }));
        }
      });
    }
    return () => {
      if (recording) {
        (window as any).api.setPreviewRecordingStopped(JSON.stringify({
          instanceId: instance
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!previewMediaRecorder && !recording) {
      (window as any).api.getPreviewMediaSource(JSON.stringify({
        instanceId: instance,
      })).then((mediaSourceId) => {
        (window as any).api.getDesktopCapturerSources().then((sources) => {
          const source = sources.find((s) => s.id === mediaSourceId);
          if (source) {
            const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
            navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id
                }
              } as MediaTrackConstraints
            }).then((stream) => {
              videoElement.srcObject = stream;
              videoElement.play();
              const options = { mimeType: 'video/webm; codecs=vp9' };
              previewMediaRecorder = new MediaRecorder(stream, options);
              previewMediaRecorder.ondataavailable = handleVideoData;
              previewMediaRecorder.onstop = handleStop;
            });
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