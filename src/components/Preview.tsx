import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';
import { ThemeContext } from './ThemeProvider';
import PreviewMain from './PreviewMain';
import EmptyState from './EmptyState';

interface PreviewProps {
  activeArtboard: Btwx.Artboard;
  recording: boolean;
}

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

const Preview = (props: PreviewProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard, recording } = props;

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
        ? <PreviewMain />
        : <EmptyState
            icon='preview'
            text='Preview'
            detail='Add an artboard to preview it.'
            style={{paddingRight: 24, paddingLeft: 24}} />
      }
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, preview } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard];
  const recording = preview.recording;
  return {
    activeArtboard,
    recording
  };
};

export default connect(
  mapStateToProps
)(Preview);