import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import TopbarButton from './TopbarButton';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';

interface ZoomOutButtonProps {
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): CanvasSettingsTypes;
  disabled: boolean;
}

const ZoomOutButton = (props: ZoomOutButtonProps): ReactElement => {
  const { setCanvasMatrix, disabled } = props;

  const handleZoomOutClick = (): void => {
    if (paperMain.view.zoom / 2 >= 0.01) {
      paperMain.view.zoom /= 2;
    } else {
      paperMain.view.zoom = 0.01;
    }
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
  }

  return (
    <TopbarButton
      hideLabel
      label='Zoom Out'
      onClick={handleZoomOutClick}
      disabled={disabled}
      icon='M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M18,11 L6,11 L6,13 L18,13 L18,11 Z' />
  );
}

const mapStateToProps = (state: RootState): {
  disabled: boolean;
} => {
  const { canvasSettings } = state;
  const disabled = canvasSettings.matrix[0] === 0.01;
  return { disabled };
};

export default connect(
  mapStateToProps,
  { setCanvasMatrix }
)(ZoomOutButton);