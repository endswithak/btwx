import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('zoom-in')}
      />
  );
}

export default connect(
  null,
  { setCanvasMatrix }
)(ZoomInButton);