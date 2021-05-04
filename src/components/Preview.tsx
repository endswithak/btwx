import { ipcRenderer } from 'electron';
import React, { useEffect, ReactElement, useState } from 'react';
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
  const activeArtboard = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const [prevActiveArtboard, setPrevActiveArtboard] = useState(null);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const [touchCursor, setTouchCursor] = useState(false);

  useEffect(() => {
    if (activeArtboard) {
      const activeArtboardPosition = new paperPreview.Point(activeArtboard.frame.x, activeArtboard.frame.y);
      if (
        !prevActiveArtboard
        // || (activeArtboard.frame.width !== prevActiveArtboard.frame.width || activeArtboard.frame.height !== prevActiveArtboard.frame.height)
      ) {
        ipcRenderer.send('resizePreview', JSON.stringify({
          instanceId: instance,
          size: {
            width: activeArtboard.frame.width,
            height: activeArtboard.frame.height
          }
        }));
      }
      if (!paperPreview.view.center.equals(activeArtboardPosition)) {
        paperPreview.view.center = activeArtboardPosition;
      }
    }
    setPrevActiveArtboard(activeArtboard);
  }, [activeArtboard]);

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