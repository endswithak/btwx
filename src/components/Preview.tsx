import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';

const Preview = (): ReactElement => {
  const theme = useContext(ThemeContext);

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