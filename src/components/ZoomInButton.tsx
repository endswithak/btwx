import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { SetCanvasMatrixPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { SetCanvasZoomingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { paperMain } from '../canvas';
import TopbarButton from './TopbarButton';

interface ZoomInButtonProps {
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
}

const ZoomInButton = (props: ZoomInButtonProps): ReactElement => {
  const { setCanvasMatrix, setCanvasZooming } = props;

  const handleZoomInClick = (): void => {
    paperMain.view.zoom *= 2;
    setCanvasZooming({zooming: true});
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
    setCanvasZooming({zooming: false});
  }

  return (
    <TopbarButton
      hideLabel
      label='Zoom In'
      onClick={handleZoomInClick}
      icon='zoom-in'
      />
  );
}

export default connect(
  null,
  { setCanvasMatrix, setCanvasZooming }
)(ZoomInButton);