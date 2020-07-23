import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import TopbarButton from './TopbarButton';

interface PreviewButtonProps {
  activeArtboard: em.Artboard;
}

const PreviewButton = (props: PreviewButtonProps): ReactElement => {
  const { activeArtboard } = props;

  const handlePreviewClick = (): void => {
    ipcRenderer.send('openPreview', JSON.stringify(activeArtboard));
  }

  return (
    <TopbarButton
      label='Preview'
      onClick={handlePreviewClick}
      icon='M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z' />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: em.Artboard;
} => {
  const { layer } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard] as em.Artboard;
  return { activeArtboard };
};

export default connect(
  mapStateToProps
)(PreviewButton);