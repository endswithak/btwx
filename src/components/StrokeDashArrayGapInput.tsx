import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedStrokeDashArrayGap, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeDashArrayGap } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const StrokeDashArrayGapInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const gap = useSelector((state: RootState) => getSelectedStrokeDashArrayGap(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newGap: any): void => {
    dispatch(setLayersStrokeDashArrayGap({layers: selected, strokeDashArrayGap: newGap}));
  }

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-stroke-dash-array-gap'
      value={gap}
      disabled={disabled}
      size='small'
      min={0}
      label='Gap'
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default StrokeDashArrayGapInput;