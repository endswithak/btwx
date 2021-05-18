import { ipcRenderer } from 'electron';
import debounce from 'lodash.debounce';
import React, { useEffect, ReactElement, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { paperPreview } from '../canvas';
import { RootState } from '../store/reducers';
import EmptyState from './EmptyState';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';
import SessionImages from './SessionImages';
import Titlebar from './Titlebar';
import PreviewDevice from './PreviewDevice';

const Preview = (): ReactElement => {
  const instance = useSelector((state: RootState) => state.session.instance);
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const platform = useSelector((state: RootState) => state.session.platform);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const [prevActiveArtboard, setPrevActiveArtboard] = useState(null);
  const [touchCursor, setTouchCursor] = useState(false);

  // debounce to prevent screen bouncing when timelines autoplay
  const updatePreviewFrame = useCallback(debounce(({activeArtboard, activeArtboardItem, prevActiveArtboard, instance}) => {
    if (activeArtboard) {
      const activeArtboardPosition = new paperPreview.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
      if (
        !prevActiveArtboard
        // || (activeArtboard.frame.width !== prevActiveArtboard.frame.width || activeArtboard.frame.height !== prevActiveArtboard.frame.height)
      ) {
        ipcRenderer.send('resizePreview', JSON.stringify({
          instanceId: instance,
          size: {
            width: activeArtboardItem.frame.width,
            height: activeArtboardItem.frame.height
          }
        }));
      }
      if (!paperPreview.view.center.equals(activeArtboardPosition)) {
        paperPreview.view.center = activeArtboardPosition;
      }
    }
    setPrevActiveArtboard(activeArtboard);
  }, 0.25), []);

  // handle resize when first artboard is created
  // handle view position on active artboard change
  useEffect(() => {
    updatePreviewFrame({
      activeArtboard,
      activeArtboardItem,
      prevActiveArtboard,
      instance
    });
  }, [activeArtboard]);

  useEffect(() => {
    if (activeArtboard && platform === 'darwin') {
      if (recording) {
        ipcRenderer.send('buildPreviewRecordingTouchBar', JSON.stringify({
          instanceId: instance
        }));
      } else {
        ipcRenderer.send('buildPreviewTouchBar', JSON.stringify({
          instanceId: instance
        }));
      }
    }
  }, [recording, activeArtboard]);

  return (
    <div className={`
      c-preview
      theme--${theme}
      ${`os--${platform === 'darwin' ? 'mac' : 'windows'}`}${
        !activeArtboard
        ? `${' '}c-preview--empty`
        : ''
      }
    `}>
      <Titlebar />
      {
        activeArtboard
        ? <>
            <PreviewTopbar
              touchCursor={touchCursor}
              setTouchCursor={setTouchCursor} />
            <div className='c-preview__canvas'>
              <PreviewCanvas
                touchCursor={touchCursor} />
              <PreviewDevice />
            </div>
            <video
              id='preview-video'
              style={{
              position: 'absolute',
              opacity: 0
            }} />
          </>
        : <EmptyState
            icon='preview'
            text='Preview'
            detail='Add an artboard to preview it.'
            style={{paddingRight: 24, paddingLeft: 24}} />
      }
      <SessionImages />
    </div>
  );
}

export default Preview;