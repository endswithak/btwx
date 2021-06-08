import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedStrokeDashArrayWidth, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeDashArrayWidth } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const StrokeDashArrayWidthInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const width = useSelector((state: RootState) => getSelectedStrokeDashArrayWidth(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newWidth: any): void => {
    dispatch(setLayersStrokeDashArrayWidth({layers: selected, strokeDashArrayWidth: newWidth}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-stroke-dash-array-width'
      value={width}
      disabled={disabled}
      size='small'
      min={0}
      label='Dash'
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default StrokeDashArrayWidthInput;