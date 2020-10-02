import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';
import EmptyState from './EmptyState';
import { PREVIEW_TOPBAR_HEIGHT, MAC_TITLEBAR_HEIGHT, WINDOWS_TITLEBAR_HEIGHT } from '../constants';

interface PreviewProps {
  activeArtboard: em.Artboard;
  recording: boolean;
}

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
        ? <>
            <PreviewTopbar />
            <div className='c-app__canvas'>
              <PreviewCanvas />
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
            style={{width: 211}} />
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