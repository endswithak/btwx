import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ActiveArtboardFrame from './ActiveArtboardFrame';

interface ActiveArtboardFrameWrapProps {
  isEnabled?: boolean;
}

const ActiveArtboardFrameWrap = (props: ActiveArtboardFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <ActiveArtboardFrame />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer, canvasSettings } = state;
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isZooming = canvasSettings.zooming;
  const activeArtboard = layer.present.activeArtboard;
  const isEnabled = activeArtboard && !isResizing && !isDragging && !isZooming;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrameWrap);