import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { SetCanvasZoomingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZooming } from '../store/actions/canvasSettings';
import { SetCanvasMatrixPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { setCanvasMatrix } from '../store/actions/documentSettings';
import { LayerTypes } from '../store/actionTypes/layer';
import { updateInViewLayers } from '../store/actions/layer';
import { paperMain } from '../canvas';

interface CanvasZoomWrapProps {
  children: ReactElement | ReactElement[];
  setCanvasMatrix?(payload: SetCanvasMatrixPayload): DocumentSettingsTypes;
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  updateInViewLayers?(): LayerTypes;
}

const CanvasZoomWrap = (props: CanvasZoomWrapProps): ReactElement => {
  const { children, setCanvasMatrix, setCanvasZooming, updateInViewLayers } = props;

  const handleWheel = debounce((e: any) => {
    setCanvasZooming({zooming: false});
    setCanvasMatrix({matrix: paperMain.view.matrix.values});
    updateInViewLayers();
  }, 150);

  useEffect(() => {
    const canvasWrap = document.getElementById('canvas-container');
    canvasWrap.addEventListener('wheel', handleWheel);
    return () => {
      canvasWrap.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <>
      { children }
    </>
  );
}

export default connect(
  null,
  { setCanvasMatrix, updateInViewLayers, setCanvasZooming }
)(CanvasZoomWrap);