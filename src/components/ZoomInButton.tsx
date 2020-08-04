import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import TopbarButton from './TopbarButton';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';

interface ZoomInButtonProps {
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): CanvasSettingsTypes;
}

const ZoomInButton = (props: ZoomInButtonProps): ReactElement => {
  const { setCanvasMatrix } = props;

  const handleZoomInClick = (): void => {
    paperMain.view.zoom *= 2;
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
  }

  return (
    <TopbarButton
      hideLabel
      label='Zoom In'
      onClick={handleZoomInClick}
      icon='M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M13,6 L11,6 L11,11 L6,11 L6,13 L11,13 L11,18 L13,18 L13,13 L18,13 L18,11 L13,11 L13,6 Z'
      />
  );
}

export default connect(
  null,
  { setCanvasMatrix }
)(ZoomInButton);