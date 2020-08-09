import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';
import { PREVIEW_TOPBAR_HEIGHT } from '../constants';

interface PreviewProps {
  activeArtboard: em.Artboard;
}

const Preview = (props: PreviewProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard } = props;

  useEffect(() => {
    const windowSize = remote.getCurrentWindow().getSize();
    if (windowSize[0] !== Math.round(activeArtboard.frame.width) || windowSize[1] !== Math.round(activeArtboard.frame.height) + PREVIEW_TOPBAR_HEIGHT) {
      remote.getCurrentWindow().setSize(Math.round(activeArtboard.frame.width), Math.round(activeArtboard.frame.height) + PREVIEW_TOPBAR_HEIGHT, true);
    }
  }, [activeArtboard]);

  return (
    <div
      className='c-app'
      style={{
        background: theme.background.z0
      }}>
      <PreviewTopbar />
      <div className='c-app__canvas'>
        <PreviewCanvas />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    activeArtboard: layer.present.byId[layer.present.activeArtboard]
  };
};

export default connect(
  mapStateToProps
)(Preview);