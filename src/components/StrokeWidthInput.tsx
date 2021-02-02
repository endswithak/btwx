import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedStrokeWidth, selectedStrokeEnabled } from '../store/selectors/layer';
import { setLayersStrokeWidth } from '../store/actions/layer';
import MathFormGroup from './MathFormGroup';

const StrokeWidthInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeWidth = useSelector((state: RootState) => getSelectedStrokeWidth(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  const handleSubmitSuccess = (newStrokeWidth: any): void => {
    dispatch(setLayersStrokeWidth({layers: selected, strokeWidth: newStrokeWidth}));
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-stroke-width'
      value={strokeWidth}
      disabled={disabled}
      size='small'
      min={0}
      label='Width'
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default StrokeWidthInput;