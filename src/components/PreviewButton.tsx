import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { RootState } from '../store/reducers';
import { PreviewTypes } from '../store/actionTypes/preview';
import { openPreview } from '../store/actions/preview';
import TopbarButton from './TopbarButton';

interface PreviewButtonProps {
  activeArtboard?: em.Artboard;
  canPreview?: boolean;
  isOpen?: boolean;
  openPreview?(): PreviewTypes;
}

const PreviewButton = (props: PreviewButtonProps): ReactElement => {
  const { activeArtboard, canPreview, isOpen, openPreview } = props;

  const handlePreviewClick = (): void => {
    const windowSize = {
      width: activeArtboard.frame.width,
      height: activeArtboard.frame.height
    }
    ipcRenderer.send('openPreview', JSON.stringify(windowSize));
    openPreview();
  }

  return (
    <TopbarButton
      label='Preview'
      onClick={handlePreviewClick}
      icon='M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z'
      disabled={!canPreview}
      isActive={isOpen} />
  );
}

const mapStateToProps = (state: RootState): {
  activeArtboard: em.Artboard;
  canPreview: boolean;
  isOpen: boolean;
} => {
  const { layer, preview } = state;
  const activeArtboard = layer.present.byId[layer.present.activeArtboard] as em.Artboard;
  const canPreview = layer.present.allTweenEventIds.length > 0;
  const isOpen = preview.isOpen;
  return { activeArtboard, canPreview, isOpen };
};

export default connect(
  mapStateToProps,
  { openPreview }
)(PreviewButton);