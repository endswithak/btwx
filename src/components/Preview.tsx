import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';
import { ThemeContext } from './ThemeProvider';
import EmptyState from './EmptyState';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';
import DocumentImages from './DocumentImages';

// if (remote.process.platform === 'darwin') {
//   remote.getCurrentWindow().addListener('swipe', (event: any, direction: any) => {
//     switch(direction) {
//       case 'right': {
//         const state = store.getState();
//         if (state.preview.isOpen && state.preview.focusing) {
//           remote.BrowserWindow.fromId(state.preview.documentWindowId).focus();
//         }
//         break;
//       }
//     }
//   });
// }

const Preview = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const [touchCursor, setTouchCursor] = useState(false);

  useEffect(() => {
    if (activeArtboard) {
      const windowSize = remote.getCurrentWindow().getSize();
      if ((windowSize[0] !== Math.round(activeArtboard.frame.width) || windowSize[1] !== (Math.round(activeArtboard.frame.height) + PREVIEW_TOPBAR_HEIGHT + (remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT))) && !recording) {
        remote.getCurrentWindow().setSize(Math.round(activeArtboard.frame.width), Math.round(activeArtboard.frame.height) + PREVIEW_TOPBAR_HEIGHT + (remote.process.platform === 'darwin' ? MAC_TITLEBAR_HEIGHT : WINDOWS_TITLEBAR_HEIGHT), true);
      }
    }
  }, [activeArtboard]);

  return (
    <div
      className='c-app'
      style={{
        background: theme.background.z0
      }}>
      {
        activeArtboard
        ? <>
            <PreviewTopbar
              touchCursor={touchCursor}
              setTouchCursor={setTouchCursor} />
            <div className='c-app__canvas'>
              <PreviewCanvas
                touchCursor={touchCursor} />
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
      <DocumentImages />
    </div>
  );
}

export default Preview;