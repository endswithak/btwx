import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedStrokeDashOffset, selectedStrokeEnabled } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import { setLayersStrokeDashOffset } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const StrokeDashOffsetInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const offset = useSelector((state: RootState) => getSelectedStrokeDashOffset(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newOffset: any): void => {
    dispatch(setLayersStrokeDashOffset({layers: selected, strokeDashOffset: newOffset}));
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-stroke-dash-offset'
      value={offset}
      disabled={disabled}
      size='small'
      min={0}
      label='Offset'
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default StrokeDashOffsetInput;