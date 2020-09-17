import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetCanvasMatrixPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { SetCanvasZoomingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';

interface ZoomOutButtonProps {
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  disabled: boolean;
}

const ZoomOutButton = (props: ZoomOutButtonProps): ReactElement => {
  const { setCanvasMatrix, disabled, setCanvasZooming } = props;

  const handleZoomOutClick = (): void => {
    if (paperMain.view.zoom / 2 >= 0.01) {
      paperMain.view.zoom /= 2;
    } else {
      paperMain.view.zoom = 0.01;
    }
    setCanvasZooming({zooming: true});
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
    setCanvasZooming({zooming: false});
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
  const { documentSettings } = state;
  const disabled = documentSettings.matrix[0] === 0.01;
  return { disabled };
};

export default connect(
  mapStateToProps,
  { setCanvasMatrix, setCanvasZooming }
)(ZoomOutButton);