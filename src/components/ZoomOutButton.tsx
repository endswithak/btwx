import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetCanvasMatrixPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasMatrix } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon='zoom-out'
      />
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